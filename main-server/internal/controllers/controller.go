package controllers

import "net/http"

type Controller interface {
	Pattern() string
	Handler() http.Handler
}
