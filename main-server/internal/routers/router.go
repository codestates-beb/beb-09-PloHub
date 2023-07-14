package routers

import (
	"fmt"
	"main-server/internal/controllers"
	"main-server/internal/middlewares"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Router interface {
	Register(c controllers.Controller) Router
	Route() http.Handler
}

type router struct {
	mux     *chi.Mux
	version string
}

func NewRouter(version string) Router {
	r := &router{
		mux:     nil,
		version: version,
	}
	return r.setup()
}

func (r *router) setup() Router {
	mux := chi.NewRouter()
	mux.Use(middleware.RequestID)
	mux.Use(middleware.RealIP)
	mux.Use(middleware.Logger)
	mux.Use(middleware.Recoverer)
	mux.Use(middlewares.CORS())
	r.mux = mux
	return r
}

func (r *router) Register(c controllers.Controller) Router {
	r.mux.Mount(fmt.Sprintf("/api/%s%s", r.version, c.Pattern()), c.Handler())
	return r
}

func (r *router) Route() http.Handler {
	return r.mux
}
