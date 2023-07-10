package controllers

import (
	"main-server/internal/middlewares"
	"main-server/internal/services/auth"
	"main-server/internal/services/post"
	"main-server/internal/services/storage"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type postController struct {
	authSvc  auth.Service
	postSvc  post.Service
	storeSvc storage.Service
}

func NewPostController(authSvc auth.Service, postSvc post.Service, storeSvc storage.Service) Controller {
	return &postController{
		authSvc:  authSvc,
		postSvc:  postSvc,
		storeSvc: storeSvc,
	}
}

func (pc *postController) Pattern() string {
	return "/posts"
}

// Route returns a http.Handler that handles post related requests
func (pc *postController) Handler() http.Handler {
	mux := chi.NewRouter()

	mux.Get("/list", pc.getPosts)
	mux.Get("/detail/{id}", pc.getPostDetail)

	mux.Group(func(r chi.Router) {
		r.Use(middlewares.AccessTokenRequired(pc.authSvc))
		r.Post("/create", pc.createPost)
		r.Post("/edit", pc.editPost)
		r.Post("/delete", pc.deletePost)
	})
	return mux
}

// getPosts handles GET /posts/list
func (pc *postController) getPosts(w http.ResponseWriter, r *http.Request) {}

// getPostDetail handles GET /posts/detail/{id}
func (pc *postController) getPostDetail(w http.ResponseWriter, r *http.Request) {}

// createPost handles POST /posts/create
func (pc *postController) createPost(w http.ResponseWriter, r *http.Request) {}

// editPost handles POST /posts/edit
func (pc *postController) editPost(w http.ResponseWriter, r *http.Request) {}

// deletePost handles POST /posts/delete
func (pc *postController) deletePost(w http.ResponseWriter, r *http.Request) {}
