package user

import (
	"context"
	"errors"
	"main-server/db/plohub"
	"main-server/internal/models"
	"math/rand"
	"time"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrMismatchedHashAndPassword = errors.New("mismatched hash and password")
	ErrEmailAlreadyExists        = errors.New("email already exists")
)

type Service interface {
	EmailExists(ctx context.Context, email string) error
	Login(ctx context.Context, email, password string) (*models.UserInfo, error)
	UserInfo(ctx context.Context, userID int32) (*models.UserInfo, error)
	MyPage(ctx context.Context, userID int32) (*models.MyPageInfo, error)
	SignUp(ctx context.Context, email, password string) error
	Withdraw(ctx context.Context, userID int32) error
}

type service struct {
	repo plohub.Repository
}

func NewService(repo plohub.Repository) Service {
	svc := &service{
		repo: repo,
	}

	return svc
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
		if !user.LatestLoginDate.Valid || !checkUserLoggedInToday(user.LatestLoginDate.Time) {
			// TODO: request reward
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
		myPageInfo.Posts = models.ToPostInfos(posts)
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

		// TODO: request to create wallet with user id
		_ = struct{ id int32 }{id: id}

		return nil
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

func checkUserLoggedInToday(t time.Time) bool {
	return time.Now().Day()-t.Day() == 0
}
