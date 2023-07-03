package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
)

func main() {
	port := flag.String("p", "8080", "port to listen on")
	flag.Parse()

	mustValidatePort(*port)

	mux := http.NewServeMux()
	mux.HandleFunc("/healthcheck", func(w http.ResponseWriter, r *http.Request) {
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
			log.Fatal("Failed to listen and serve: ", err)
		}
	}()

	log.Printf("Server listening on port %s", *port)

	go func() {
		defer func() {
			close(shutdown)
			close(stop)
		}()
		<-shutdown
	}()

	<-stop

	log.Println("Shutting down server...")
	if err := srv.Shutdown(context.Background()); err != nil {
		log.Fatal("Failed to shutdown server: ", err)
	}

	log.Println("Server gracefully stopped")
}

func mustValidatePort(port string) {
	if port == "" {
		log.Fatal("Port is required")
	}

	n, err := strconv.Atoi(port)
	if err != nil {
		log.Fatal("Port must be a number")
	}

	if n < 1 || n > 65535 {
		log.Fatal("Port must be between 1 and 65535")
	}
}
