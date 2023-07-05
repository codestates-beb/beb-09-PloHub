package loaders

import (
	"database/sql"
	"main-server/db/plohub"
	"main-server/internal/routers"
	"main-server/internal/services/auth"
	"main-server/internal/services/user"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func NewMainRouter(db *sql.DB) http.Handler {
	mux := chi.NewRouter()

	repo := plohub.NewRepository(db)
	userSrv := user.NewService(repo)
	authSrv, err := auth.NewService("access", "refresh")
	if err != nil {
		panic(err)
	}

	userRouter := routers.NewUserRouter(userSrv, authSrv)

	mux.Use(middleware.Logger)
	mux.Use(middleware.Recoverer)

	mux.Get("/api/v1/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	mux.Mount("/api/v1", userRouter.Route())

	return mux
}
