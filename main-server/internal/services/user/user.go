package user

import (
	"context"
	"errors"
	"main-server/db/plohub"
	"main-server/internal/models"
	"net/http"
)

var (
	ErrMismatchedHashAndPassword = errors.New("mismatched hash and password")
)

type Service interface {
	EmailExists(ctx context.Context, email string) (bool, error)
	Login(ctx context.Context, email, password string) (*models.UserInfo, error)
	MyPage(ctx context.Context, userID int32) (*models.MyPageInfo, error)
	SignUp(ctx context.Context, email, password string) error
	Withdraw(ctx context.Context, userID int32) error
}

type service struct {
	client *http.Client
	repo   plohub.Repository
}

func NewService(repo plohub.Repository, clients ...*http.Client) Service {
	svc := &service{
		client: http.DefaultClient,
		repo:   repo,
	}

	if len(clients) > 0 && clients[0] != nil {
		svc.client = clients[0]
	}

	return svc
}

func (s *service) EmailExists(ctx context.Context, email string) (bool, error) {
	var exists bool

	fn := func(q plohub.Querier) error {
		res, err := q.EmailExists(ctx, email)
		if err != nil {
			return err
		}

		exists = res

		return nil
	}

	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func (s *service) Login(ctx context.Context, email string, password string) (*models.UserInfo, error) {
	userInfo := &models.UserInfo{}

	fn := func(q plohub.Querier) error {
		user, err := q.GetUserByEmail(ctx, email)
		if err != nil {
			return err
		}

		match, err := matchPassword(user.HashedPassword, password)
		if err != nil {
			return err
		}

		if !match {
			return ErrMismatchedHashAndPassword
		}

		userInfo = extractUserInfo(user)

		// if user never logged in before or user logged in before but not today
		if !user.LatestLoginDate.Valid || !checkUserLoggedInToday(user.LatestLoginDate.Time) {
			// TODO: request reward
		}

		return nil
	}

	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return nil, err
	}

	return userInfo, nil
}

func (s *service) MyPage(ctx context.Context, userID int32) (*models.MyPageInfo, error) {
	myPageInfo := &models.MyPageInfo{}

	fn := func(q plohub.Querier) error {
		user, err := q.GetUserByID(ctx, userID)
		if err != nil {
			return err
		}

		posts, err := q.GetPostsByUserID(ctx, userID)
		if err != nil {
			return err
		}

		// TODO: request NFTs by user id

		myPageInfo.UserInfo = *extractUserInfo(user)
		myPageInfo.Posts = extractPostInfo(posts)
		myPageInfo.NFTs = nil

		return nil
	}

	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return nil, err
	}

	return myPageInfo, nil
}

func (s *service) SignUp(ctx context.Context, email string, password string) error {
	fn := func(q plohub.Querier) error {
		id, err := q.CreateUser(ctx, plohub.CreateUserParams{
			Email:          email,
			HashedPassword: password,
		})
		if err != nil {
			return err
		}

		// TODO: request to create wallet with user id
		_ = struct{ id int32 }{id: id}

		return nil
	}

	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) Withdraw(ctx context.Context, userID int32) error {
	fn := func(q plohub.Querier) error {
		return q.DeleteUser(ctx, userID)
	}

	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return err
	}

	return nil
}
