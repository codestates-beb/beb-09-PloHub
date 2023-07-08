package controllers

import "net/http"

type Controller interface {
	Route() http.Handler
}
