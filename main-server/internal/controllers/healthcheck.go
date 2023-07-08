package controllers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

type healthcheckController struct{}

func NewHealthcheckController() Controller {
	return &healthcheckController{}
}

// Route returns a http.Handler that handles healthcheck related requests
func (hc *healthcheckController) Route() http.Handler {
	mux := chi.NewRouter()

	mux.Get("/healthcheck", hc.healthcheck)

	return mux
}

// healthcheck handles GET /healthcheck
func (hc *healthcheckController) healthcheck(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("OK"))
}
