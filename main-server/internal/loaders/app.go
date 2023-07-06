package loaders

import (
	"context"
	"fmt"
	"main-server/db/plohub"
	"main-server/internal/app"
	"main-server/internal/configs"
	"main-server/internal/routers"
	"main-server/internal/services/auth"
	"main-server/internal/services/user"
	"main-server/internal/services/wallet"
	"net/http"

	"go.uber.org/zap"
)

func NewApp(ctx context.Context, cfg *configs.Config) *app.App {
	db := <-MustConnectPostgresWithRetry(ctx, cfg.GetPostgresDSN())
	if db == nil {
		zap.L().Panic("Failed to connect to postgres")
	}

	repo := plohub.NewRepository(db)

	walletSvc := wallet.NewService(cfg.Server.ContractServerBaseURL)
	userSvc := user.NewService(walletSvc, repo)
	authSvc, err := auth.NewService(cfg.JWT.AccessTokenSecret, cfg.JWT.RefreshTokenSecret)
	if err != nil {
		zap.L().Panic("Failed to create auth service", zap.Error(err))
	}

	users := routers.NewUserRouter(cfg.Server.Domain, userSvc, authSvc)

	router := NewRouter(users)

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", cfg.Server.Port),
		Handler: router,
	}

	return app.New().SetServer(srv)
}
