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
	mux.Post("/transfer", tc.transferTokens)

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

func (tc *tokenController) transferTokens(w http.ResponseWriter, r *http.Request) {
	toAddress := r.FormValue("to_address")
	tokenAmount := r.FormValue("token_amount")

	tokenAmountInt, err := strconv.ParseInt(tokenAmount, 10, 32)
	if err != nil {
		zap.L().Error("failed to parse token amount", zap.Error(err))
		utils.ErrorJSON(w, err)
		return
	}

	senderID := r.Context().Value(middlewares.UserIDKey).(int32)

	tokenTransferred, err := tc.userSvc.TransferTokens(r.Context(), senderID, int32(tokenAmountInt), toAddress)
	if err != nil {
		zap.L().Error("failed to transfer tokens", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	var resp struct {
		SenderTokenAmount   string `json:"sender_token_amount"`
		SenderEthAmount     string `json:"sender_eth_amount"`
		ReceiverTokenAmount string `json:"receiver_token_amount"`
	}

	resp.SenderTokenAmount = tokenTransferred.SenderBalance
	resp.SenderEthAmount = tokenTransferred.SenderEthBalance
	resp.ReceiverTokenAmount = tokenTransferred.ReceiverBalance

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}
