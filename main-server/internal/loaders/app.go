package loaders

import (
	"context"
	"fmt"
	"log"
	"main-server/db/plohub"
	"main-server/internal/app"
	"main-server/internal/configs"
	"main-server/internal/controllers"
	"main-server/internal/routers"
	"main-server/internal/services/auth"
	"main-server/internal/services/user"
	"main-server/internal/services/wallet"
	"net/http"
	"time"

	"go.uber.org/zap"
)

func Run() {
	// Load config
	cfg, err := configs.New("./config/config.json")
	if err != nil {
		zap.L().Panic("Failed to load config", zap.Error(err))
	}

	// init app
	app := newApp(cfg)

	// start app
	stop, err := app.Start()
	if err != nil {
		zap.L().Panic("Failed to start server", zap.Error(err))
	}

	zap.L().Info("Server started", zap.String("port", cfg.Server.Port))

	// block until stop signal
	<-stop

	zap.L().Info("Shutting down server...")

	// shutdown app
	if err := app.Shutdown(context.Background()); err != nil {
		log.Fatal("Failed to shutdown server: ", err)
	}

	zap.L().Info("Server gracefully stopped")
}

func newApp(cfg *configs.Config) *app.App {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	repo := newRepo(ctx, cfg.GetPostgresDSN())
	users := newUserController(repo, cfg)
	router := routers.NewRouter("/api/v1")

	router.Register(users.Route())

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", cfg.Server.Port),
		Handler: router.Handler(),
	}

	return app.New().SetServer(srv)
}

func newRepo(ctx context.Context, dsn string) plohub.Repository {
	db := <-MustConnectPostgresWithRetry(ctx, dsn)
	if db == nil {
		zap.L().Panic("Failed to connect to postgres")
	}
	return plohub.NewRepository(db)
}

func newUserController(repo plohub.Repository, cfg *configs.Config) controllers.Controller {
	walletSvc := wallet.NewService(cfg.Server.ContractServerBaseURL)
	userSvc := user.NewService(walletSvc, repo)
	authSvc, err := auth.NewService(cfg.JWT.AccessTokenSecret, cfg.JWT.RefreshTokenSecret)
	if err != nil {
		zap.L().Panic("Failed to create auth service", zap.Error(err))
	}

	return controllers.NewUserController(cfg.Server.Domain, userSvc, authSvc)
}
