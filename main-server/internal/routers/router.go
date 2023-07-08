package routers

import (
	"main-server/internal/middlewares"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Router interface {
	Register(h http.Handler)
	Handler() http.Handler
}

type router struct {
	mux     *chi.Mux
	pattern string
}

func NewRouter(pattern string) Router {
	r := &router{
		mux:     nil,
		pattern: pattern,
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
	return r
}

func (r *router) Register(h http.Handler) {
	r.mux.Mount(r.pattern, h)
}

func (r *router) Handler() http.Handler {
	return r.mux
}
