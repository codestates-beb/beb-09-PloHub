package controllers

import (
	"main-server/internal/middlewares"
	"main-server/internal/models"
	"main-server/internal/services/auth"
	"main-server/internal/services/user"
	"main-server/internal/utils"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

type tokenController struct {
	authSvc auth.Service
	userSvc user.Service
}

func NewTokenController(authSvc auth.Service, userSvc user.Service) Controller {
	return &tokenController{
		authSvc: authSvc,
		userSvc: userSvc,
	}
}

func (tc *tokenController) Pattern() string {
	return "/token"
}

// Route returns a http.Handler that handles token related requests
func (tc *tokenController) Handler() http.Handler {
	mux := chi.NewRouter()

	mux.Use(middlewares.AccessTokenRequired(tc.authSvc))
	mux.Post("/swap", tc.swapTokens)

	return mux
}

func (tc *tokenController) swapTokens(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middlewares.UserIDKey).(int32)

	tokenAmount := r.FormValue("token_amount")

	tokenAmountInt, err := strconv.ParseInt(tokenAmount, 10, 32)
	if err != nil {
		zap.L().Error("failed to parse token amount", zap.Error(err))
		utils.ErrorJSON(w, err)
		return
	}

	balance, err := tc.userSvc.SwapTokens(r.Context(), userID, int32(tokenAmountInt))
	if err != nil {
		zap.L().Error("failed to swap tokens", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	var resp struct {
		Balance models.Balance `json:"balance"`
	}

	resp.Balance = *balance

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}
