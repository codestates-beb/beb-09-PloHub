package user

import (
	"context"
	"main-server/db/plohub"
	"main-server/internal/models"
)

type Service interface {
	Login(ctx context.Context, email, password string) (*models.UserInfo, error)
	MyPageInfo(ctx context.Context, userID int32) (*models.MyPageInfo, error)
	SignUp(ctx context.Context, email, password string) error
	Withdraw(ctx context.Context, userID int32) error
}

type service struct {
	repo plohub.Repository
}

func NewService(repo plohub.Repository) Service {
	return &service{
		repo: repo,
	}
}

func (s *service) Login(ctx context.Context, email string, password string) (*models.UserInfo, error) {
	fn := func(q plohub.Querier) error {
		return nil
	}

	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return nil, err
	}

	return nil, nil
}

func (s *service) MyPageInfo(ctx context.Context, userID int32) (*models.MyPageInfo, error) {
	fn := func(q plohub.Querier) error {
		return nil
	}

	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return nil, err
	}

	return nil, nil
}

func (s *service) SignUp(ctx context.Context, email string, password string) error {
	fn := func(q plohub.Querier) error {
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
		return nil
	}

	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return err
	}

	return nil
}
