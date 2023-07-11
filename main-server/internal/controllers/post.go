package controllers

import (
	"errors"
	"fmt"
	"main-server/internal/middlewares"
	"main-server/internal/models"
	"main-server/internal/services/auth"
	"main-server/internal/services/post"
	"main-server/internal/services/storage"
	"main-server/internal/utils"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"go.uber.org/zap"
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
		r.Post("/delete/{id}", pc.deletePost)
	})
	return mux
}

// getPosts handles GET /posts/list
func (pc *postController) getPosts(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()

	var page, limit int32
	var category int16

	pageStr, limitStr, categoryStr := params.Get("page"), params.Get("limit"), params.Get("category")

	if pageStr != "" {
		pageInt, err := strconv.ParseInt(pageStr, 10, 32)
		if err != nil {
			zap.L().Error("failed to parse page", zap.Error(err))
			utils.ErrorJSON(w, errors.New("invalid page"), http.StatusBadRequest)
			return
		}
		page = int32(pageInt)
	} else {
		page = 1
	}

	if limitStr != "" {
		limitInt, err := strconv.ParseInt(limitStr, 10, 32)
		if err != nil {
			zap.L().Error("failed to parse limit", zap.Error(err))
			utils.ErrorJSON(w, errors.New("invalid limit"), http.StatusBadRequest)
			return
		}
		limit = int32(limitInt)
	} else {
		limit = 10
	}

	if categoryStr != "" {
		categoryInt, err := strconv.ParseInt(categoryStr, 10, 16)
		if err != nil {
			zap.L().Error("failed to parse category", zap.Error(err))
			utils.ErrorJSON(w, errors.New("invalid category"), http.StatusBadRequest)
			return
		}
		category = int16(categoryInt)
	} else {
		category = 0
	}

	var posts []models.PostInfo
	var err error

	if category == 0 {
		posts, err = pc.postSvc.GetPosts(r.Context(), limit, page)
	} else {
		posts, err = pc.postSvc.GetPostsByCategory(r.Context(), category, limit, page)
	}
	if err != nil {
		zap.L().Error("failed to get posts", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	var resp models.GetPostsResponse
	resp.Posts = posts

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

// getPostDetail handles GET /posts/detail/{id}
func (pc *postController) getPostDetail(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	postID, err := strconv.ParseInt(id, 10, 32)
	if err != nil {
		zap.L().Error("failed to parse post id", zap.Error(err))
		utils.ErrorJSON(w, errors.New("invalid post id"), http.StatusBadRequest)
		return
	}

	detail, err := pc.postSvc.GetPostDetail(r.Context(), int32(postID))
	if err != nil {
		zap.L().Error("failed to get post detail", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	_ = utils.WriteJSON(w, http.StatusOK, detail)
}

// createPost handles POST /posts/create
func (pc *postController) createPost(w http.ResponseWriter, r *http.Request) {
	title := r.FormValue("title")
	content := r.FormValue("content")
	category := r.FormValue("category")

	categoryInt, err := strconv.ParseInt(category, 10, 16)
	if err != nil {
		zap.L().Error("failed to parse category", zap.Error(err))
		utils.ErrorJSON(w, errors.New("invalid category"), http.StatusBadRequest)
		return
	}

	var media []models.CreateMediumParams

	uuid := uuid.New().String()

	images, ok := r.MultipartForm.File["images"]
	if ok {
		for i, image := range images {
			file, err := image.Open()
			if err != nil {
				zap.L().Error("failed to open image", zap.Error(err))
				utils.ErrorJSON(w, err, http.StatusInternalServerError)
				return
			}
			defer file.Close()

			filename := fmt.Sprintf("%s_%d_%s", uuid, i, image.Filename)

			url, err := pc.storeSvc.UploadFile(r.Context(), filename, file)
			if err != nil {
				zap.L().Error("failed to upload image", zap.Error(err))
				utils.ErrorJSON(w, err, http.StatusInternalServerError)
				return
			}

			media = append(media, models.CreateMediumParams{
				Type: models.MediumTypeImage,
				Url:  url,
			})
		}
	}

	videos, ok := r.MultipartForm.File["videos"]
	if ok {
		for i, video := range videos {
			file, err := video.Open()
			if err != nil {
				zap.L().Error("failed to open video", zap.Error(err))
				utils.ErrorJSON(w, err, http.StatusInternalServerError)
				return
			}
			defer file.Close()

			filename := fmt.Sprintf("%s_%d_%s", uuid, i, video.Filename)

			url, err := pc.storeSvc.UploadFile(r.Context(), filename, file)
			if err != nil {
				zap.L().Error("failed to upload video", zap.Error(err))
				utils.ErrorJSON(w, err, http.StatusInternalServerError)
				return
			}

			media = append(media, models.CreateMediumParams{
				Type: models.MediumTypeVideo,
				Url:  url,
			})
		}
	}

	err = pc.postSvc.CreatePost(r.Context(), models.CreatePostParams{
		UserID:   r.Context().Value(middlewares.UserIDKey).(int32),
		Title:    title,
		Content:  content,
		Category: models.PostCategory(categoryInt),
		Media:    media,
	})
	if err != nil {
		zap.L().Error("failed to create post", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	var resp models.CommonResponse
	resp.Status = http.StatusOK
	resp.Message = "successfully created post"

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

// editPost handles POST /posts/edit
func (pc *postController) editPost(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotImplemented)
}

// deletePost handles POST /posts/delete
func (pc *postController) deletePost(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	postID, err := strconv.ParseInt(id, 10, 32)
	if err != nil {
		zap.L().Error("failed to parse post id", zap.Error(err))
		utils.ErrorJSON(w, errors.New("invalid post id"), http.StatusBadRequest)
		return
	}

	userID := r.Context().Value(middlewares.UserIDKey).(int32)

	urls, err := pc.postSvc.DeletePost(r.Context(), userID, int32(postID))
	if err != nil {
		zap.L().Error("failed to delete post", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	for _, url := range urls {
		urlParts := strings.Split(url, "_")
		if len(urlParts) != 3 {
			zap.L().Error("invalid url", zap.String("url", url))
			continue
		}

		filename := urlParts[2]

		err = pc.storeSvc.DeleteFile(r.Context(), filename)
		if err != nil {
			zap.L().Error("failed to delete file", zap.Error(err))
		}
	}

	var resp models.CommonResponse
	resp.Status = http.StatusOK
	resp.Message = "successfully deleted post"

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}
