package controllers

import (
	"main-server/internal/middlewares"
	"main-server/internal/models"
	"main-server/internal/services/auth"
	"main-server/internal/services/post"
	"main-server/internal/utils"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

type commentController struct {
	authSvc auth.Service
	postSvc post.Service
}

func NewCommentController(authSvc auth.Service, postSvc post.Service) Controller {
	return &commentController{
		authSvc: authSvc,
		postSvc: postSvc,
	}
}

func (cc *commentController) Pattern() string {
	return "/comments"
}

// Route returns a http.Handler that handles comment related requests
func (cc *commentController) Handler() http.Handler {
	mux := chi.NewRouter()

	mux.Group(func(r chi.Router) {
		r.Use(middlewares.AccessTokenRequired(cc.authSvc))
		r.Post("/create", cc.createComment)
		r.Delete("/{id}", cc.deleteComment)
	})

	return mux
}

// createComment handles POST /comments/create
func (cc *commentController) createComment(w http.ResponseWriter, r *http.Request) {
	postID := r.FormValue("post_id")
	content := r.FormValue("content")

	postIDInt, err := strconv.ParseInt(postID, 10, 32)
	if err != nil {
		zap.L().Error("failed to parse post_id", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	userID := r.Context().Value(middlewares.UserIDKey).(int32)

	err = cc.postSvc.LeaveComment(r.Context(), models.AddCommentParams{
		PostID:  int32(postIDInt),
		UserID:  userID,
		Content: content,
	})
	if err != nil {
		zap.L().Error("failed to leave comment", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	var resp models.CommonResponse
	resp.Status = http.StatusOK
	resp.Message = "comment created"

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

// deleteComment handles DELETE /comments/{id}
func (cc *commentController) deleteComment(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	idInt, err := strconv.ParseInt(id, 10, 32)
	if err != nil {
		zap.L().Error("failed to parse id", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	userID := r.Context().Value(middlewares.UserIDKey).(int32)

	err = cc.postSvc.DeleteComment(r.Context(), userID, int32(idInt))
	if err != nil {
		zap.L().Error("failed to delete comment", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	var resp models.CommonResponse
	resp.Status = http.StatusOK
	resp.Message = "comment deleted"

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}
