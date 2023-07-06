package app

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"go.uber.org/zap"
)

type App struct {
	*http.Server
}

func New() *App {
	return &App{}
}

func (a *App) SetServer(s *http.Server) *App {
	a.Server = s
	return a
}

func (a *App) Start() (<-chan bool, error) {
	stop := make(chan bool)
	sigChan := make(chan os.Signal, 1)

	signal.Notify(sigChan,
		syscall.SIGHUP,
		syscall.SIGINT,
		syscall.SIGTERM,
		syscall.SIGQUIT,
	)

	go func() {
		if err := a.Server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			zap.L().Panic("Failed to listen and serve", zap.Error(err))
		}
	}()

	go func() {
		defer func() {
			close(sigChan)
			close(stop)
		}()
		<-sigChan
	}()

	return stop, nil
}

func (a *App) Shutdown(ctx context.Context) error {
	if err := a.Server.Shutdown(ctx); err != nil {
		return err
	}
	return nil
}
