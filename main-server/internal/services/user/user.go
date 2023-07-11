package user

import (
	"context"
	"database/sql"
	"errors"
	"main-server/db/plohub"
	"main-server/internal/models"
	"main-server/internal/services/wallet"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrMismatchedHashAndPassword = errors.New("mismatched hash and password")
	ErrEmailAlreadyExists        = errors.New("email already exists")
	ErrSameNickname              = errors.New("same nickname")
	ErrInsufficientToken         = errors.New("insufficient token")
)

type Service interface {
	ChangeNickname(ctx context.Context, userID int32, nickname string) error
	EmailExists(ctx context.Context, email string) error
	Login(ctx context.Context, email, password string) (*models.UserInfo, error)
	UserInfo(ctx context.Context, userID int32) (*models.UserInfo, error)
	MyPage(ctx context.Context, userID int32) (*models.MyPageInfo, error)
	SignUp(ctx context.Context, email, password string) error
	Withdraw(ctx context.Context, userID int32) error
	MintNFT(ctx context.Context, userID int32, name, description, imageUrl string) (int32, error)
}

type service struct {
	walletSvc wallet.Service
	repo      plohub.Repository
}

func NewService(walletSvc wallet.Service, repo plohub.Repository) Service {
	svc := &service{
		walletSvc: walletSvc,
		repo:      repo,
	}

	return svc
}

// ChangeNickname changes the nickname of the user
func (s *service) ChangeNickname(ctx context.Context, userID int32, nickname string) error {
	// transaction function
	fn := func(q plohub.Querier) error {
		// get user by id
		user, err := q.GetUserByID(ctx, userID)
		if err != nil {
			return err
		}

		// check if nickname is same
		if strings.EqualFold(nickname, user.Nickname) {
			return ErrSameNickname
		}

		return q.UpdateUser(ctx, plohub.UpdateUserParams{
			Nickname:        nickname,
			Level:           user.Level,
			Address:         user.Address,
			EthAmount:       user.EthAmount,
			TokenAmount:     user.TokenAmount,
			LatestLoginDate: user.LatestLoginDate,
			DailyToken:      user.DailyToken,
			ID:              user.ID,
		})
	}

	// execute transaction
	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return err
	}

	// return result
	return nil
}

// EmailExists checks if the email is already registered
func (s *service) EmailExists(ctx context.Context, email string) error {
	// transaction function
	fn := func(q plohub.Querier) error {
		// check if email exists
		exists, err := q.EmailExists(ctx, email)
		if err != nil {
			return err
		}

		if exists {
			return ErrEmailAlreadyExists
		}

		return nil
	}

	// execute transaction
	return s.repo.ExecTx(ctx, fn)
}

// Login logs in the user
func (s *service) Login(ctx context.Context, email string, password string) (*models.UserInfo, error) {
	var userInfo *models.UserInfo

	// transaction function
	fn := func(q plohub.Querier) error {
		// get user by email
		user, err := q.GetUserByEmail(ctx, email)
		if err != nil {
			return err
		}

		// check if password matches
		match, err := matchPassword(user.HashedPassword, password)
		if err != nil {
			return err
		}

		// if password does not match
		if !match {
			return ErrMismatchedHashAndPassword
		}

		userInfo = models.ToUserInfo(user)

		// if user never logged in before or user logged in before but not today
		if !user.LatestLoginDate.Valid || checkIfUserNotLoggedInToday(user.LatestLoginDate.Time) {
			reward, err := s.walletSvc.IssueReward(ctx, user.ID, models.RewardTypeLogin)
			if err != nil {
				return err
			}

			level := user.Level

			// if level is 1, check if token amount is greater than 40 which is the requirement for level 2
			if level == 1 {
				tokenAmount, err := strconv.ParseInt(reward.TokenAmount, 10, 64)
				if err != nil {
					return err
				}

				if tokenAmount >= 40 {
					level = 2
				}
			}

			err = q.UpdateUser(ctx, plohub.UpdateUserParams{
				Nickname:    user.Nickname,
				Level:       level,
				Address:     user.Address,
				EthAmount:   user.EthAmount,
				TokenAmount: reward.TokenAmount,
				LatestLoginDate: sql.NullTime{
					Valid: true,
					Time:  time.Now(),
				},
				DailyToken: reward.RewardAmount,
				ID:         user.ID,
			})
			if err != nil {
				return err
			}

			userInfo.TokenAmount = reward.TokenAmount
			userInfo.DailyToken = reward.RewardAmount
		}

		return nil
	}

	// execute transaction
	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return nil, err
	}
	// return result
	return userInfo, nil
}

// UserInfo returns user info
func (s *service) UserInfo(ctx context.Context, userID int32) (*models.UserInfo, error) {
	var userInfo *models.UserInfo

	// transaction function
	fn := func(q plohub.Querier) error {
		// get user by id
		user, err := q.GetUserByID(ctx, userID)
		if err != nil {
			return err
		}

		userInfo = models.ToUserInfo(user)

		return nil
	}

	// execute transaction
	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return nil, err
	}
	// return result
	return userInfo, nil
}

// MyPage returns my page info
func (s *service) MyPage(ctx context.Context, userID int32) (*models.MyPageInfo, error) {
	var myPageInfo *models.MyPageInfo

	// transaction function
	fn := func(q plohub.Querier) error {
		// get user by id
		user, err := q.GetUserByID(ctx, userID)
		if err != nil {
			return err
		}

		// get posts by user id
		posts, err := q.GetPostsByUserID(ctx, userID)
		if err != nil {
			return err
		}

		// TODO: request NFTs by user id

		myPageInfo.UserInfo = *models.ToUserInfo(user)

		myPageInfo.Posts = make([]models.PostInfo, len(posts))

		for i, post := range posts {
			myPageInfo.Posts[i] = models.PostInfo{
				ID: post.ID,
				Author: models.Author{
					ID:       post.UserID,
					Nickname: post.Author.String,
					Email:    post.AuthorEmail.String,
					Level:    post.AuthorLevel.Int16,
					Address:  post.AuthorAddress.String,
				},
				Title:        post.Title,
				Content:      post.Content,
				Category:     post.Category,
				RewardAmount: post.RewardAmount,
				Nftnized:     post.Nftnized,
				CreatedAt:    post.CreatedAt,
				UpdatedAt:    post.UpdatedAt,
			}
		}

		myPageInfo.NFTs = nil

		return nil
	}

	// execute transaction
	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return nil, err
	}
	// return result
	return myPageInfo, nil
}

// SignUp signs up the user
func (s *service) SignUp(ctx context.Context, email string, password string) error {
	// transaction function
	fn := func(q plohub.Querier) error {
		exists, err := q.EmailExists(ctx, email)
		if err != nil {
			return err
		}

		if exists {
			return ErrEmailAlreadyExists
		}

		randCost := rand.Intn(bcrypt.MaxCost)
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), randCost)
		if err != nil {
			return err
		}

		id, err := q.CreateUser(ctx, plohub.CreateUserParams{
			Email:          email,
			HashedPassword: string(hashedPassword),
		})
		if err != nil {
			return err
		}

		wallet, err := s.walletSvc.CreateWallet(ctx, id)
		if err != nil {
			return err
		}

		return q.UpdateUser(ctx, plohub.UpdateUserParams{
			Nickname:    wallet.Address,
			Level:       1,
			Address:     wallet.Address,
			EthAmount:   wallet.EthAmount,
			TokenAmount: wallet.TokenAmount,
			LatestLoginDate: sql.NullTime{
				Valid: false,
			},
			DailyToken: 0,
			ID:         id,
		})
	}

	// execute transaction
	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return err
	}

	// return result
	return nil
}

// Withdraw withdraws the user
func (s *service) Withdraw(ctx context.Context, userID int32) error {
	// transaction function
	fn := func(q plohub.Querier) error {
		// delete user by id
		return q.DeleteUser(ctx, userID)
	}

	// execute transaction
	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return err
	}

	// return result
	return nil
}

// MintNFT mints NFT
func (s *service) MintNFT(ctx context.Context, userID int32, name, description, imageUrl string) (int32, error) {
	var tokenID int32

	fn := func(q plohub.Querier) error {
		// get user by id
		user, err := q.GetUserByID(ctx, userID)
		if err != nil {
			return err
		}

		// check token amount
		tokenAmount, err := strconv.ParseInt(user.TokenAmount, 10, 64)
		if err != nil {
			return err
		}

		if tokenAmount < 20 {
			return ErrInsufficientToken
		}

		// mint NFT
		minted, err := s.walletSvc.MintNFT(ctx, userID, name, description, imageUrl)
		if err != nil {
			return err
		}

		// update user
		err = q.UpdateUser(ctx, plohub.UpdateUserParams{
			Nickname:        user.Nickname,
			Level:           user.Level,
			Address:         user.Address,
			EthAmount:       minted.EthAmount,
			TokenAmount:     minted.TokenAmount,
			LatestLoginDate: user.LatestLoginDate,
			DailyToken:      user.DailyToken,
			ID:              user.ID,
		})
		if err != nil {
			return err
		}

		tokenID = minted.TokenID

		return nil
	}

	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return 0, err
	}

	return tokenID, nil
}

func matchPassword(hashedPassword, password string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return false, nil
		}
		return false, err
	}

	return true, nil
}

func checkIfUserNotLoggedInToday(t time.Time) bool {
	now := time.Now()
	return t.Year() != now.Year() || t.Month() != now.Month() || t.Day() != now.Day()
}
