package main

import (
	"context"
	"flag"
	"log"
	"main-server/internal/loaders"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	"go.uber.org/zap"
)

func init() {
	logger := loaders.MustInitLogger()
	zap.ReplaceGlobals(logger)
}

func main() {
	port := flag.String("p", "8080", "port to listen on")
	flag.Parse()

	mustValidatePort(*port)

	/*
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

			db := <-loaders.MustConnectPostgresWithRetry(ctx, "postgres://postgres:postgres@postgres:5432/plohub?sslmode=disable&connect_timeout=10")
			if db == nil {
				log.Fatal("Failed to connect to postgres")
			}
			if err := db.Ping(); err != nil {
				log.Fatal("Failed to ping postgres: ", err)
			}
			log.Println("Connected to postgres")
	*/

	mux := http.NewServeMux()
	mux.HandleFunc("/healthcheck", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	srv := &http.Server{
		Addr:    ":" + *port,
		Handler: mux,
	}

	stop := make(chan struct{})
	shutdown := make(chan os.Signal, 1)

	signal.Notify(shutdown,
		syscall.SIGHUP,
		syscall.SIGINT,
		syscall.SIGTERM,
		syscall.SIGQUIT,
	)

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			zap.L().Panic("Failed to listen and serve", zap.Error(err))
		}
	}()

	zap.L().Info("Server started", zap.String("port", *port))

	go func() {
		defer func() {
			close(shutdown)
			close(stop)
		}()
		<-shutdown
	}()

	<-stop

	zap.L().Info("Shutting down server...")
	if err := srv.Shutdown(context.Background()); err != nil {
		log.Fatal("Failed to shutdown server: ", err)
	}

	zap.L().Info("Server gracefully stopped")
}

func mustValidatePort(port string) {
	if port == "" {
		zap.L().Panic("Port is required")
	}

	n, err := strconv.Atoi(port)
	if err != nil {
		zap.L().Panic("Port must be a number")
	}

	if n < 1 || n > 65535 {
		zap.L().Panic("Port must be between 1 and 65535")
	}
}
