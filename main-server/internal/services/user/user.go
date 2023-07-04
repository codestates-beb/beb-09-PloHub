package user

import (
	"context"
	"main-server/internal/models"
)

type Service interface {
	Login(ctx context.Context, email, password string) (*models.UserInfo, *models.TokenPair, error)
	MyPageInfo(ctx context.Context, userID int32) (*models.MyPageInfo, error)
	Refresh(ctx context.Context, refreshToken string) (*models.TokenPair, error)
	SignUp(ctx context.Context, email, password string) error
	Verify(ctx context.Context, accessToken string) error
	Withdraw(ctx context.Context, userID int32) error
}

type service struct {
}

func NewService() Service {
	return &service{}
}

// Login implements Service.
func (*service) Login(ctx context.Context, email string, password string) (*models.UserInfo, *models.TokenPair, error) {
	panic("unimplemented")
}

// MyPageInfo implements Service.
func (*service) MyPageInfo(ctx context.Context, userID int32) (*models.MyPageInfo, error) {
	panic("unimplemented")
}

// Refresh implements Service.
func (*service) Refresh(ctx context.Context, refreshToken string) (*models.TokenPair, error) {
	panic("unimplemented")
}

// SignUp implements Service.
func (*service) SignUp(ctx context.Context, email string, password string) error {
	panic("unimplemented")
}

// Verify implements Service.
func (*service) Verify(ctx context.Context, accessToken string) error {
	panic("unimplemented")
}

// Withdraw implements Service.
func (*service) Withdraw(ctx context.Context, userID int32) error {
	panic("unimplemented")
}
