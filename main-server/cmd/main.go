package main

import (
	"context"
	"log"
	"main-server/internal/configs"
	"main-server/internal/loaders"
	"time"

	"go.uber.org/zap"
)

func init() {
	logger := loaders.MustInitLogger()
	zap.ReplaceGlobals(logger)
}

func main() {
	// Load config
	cfg, err := configs.New("./config/config.json")
	if err != nil {
		zap.L().Panic("Failed to load config", zap.Error(err))
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// init app
	app := loaders.NewApp(ctx, cfg)

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
