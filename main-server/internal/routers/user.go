package routers

import (
	"errors"
	"main-server/internal/middlewares"
	"main-server/internal/models"
	"main-server/internal/services/auth"
	"main-server/internal/services/user"
	"main-server/internal/utils"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
)

type userRouter struct {
	userSrv user.Service
	authSrv auth.Service
}

func NewUserRouter(userSrv user.Service, authSrv auth.Service) Router {
	return &userRouter{
		userSrv: userSrv,
		authSrv: authSrv,
	}
}

func (ur *userRouter) Route() http.Handler {
	mux := chi.NewRouter()

	mux.Route("/users", func(r chi.Router) {
		r.Post("/signup", ur.signUp)
		r.Post("/login", ur.login)
		r.Post("/refresh", ur.refresh)
		r.Post("/logout", ur.logout)
		r.Post("/check-email", ur.checkEmail)

		r.Group(func(sr chi.Router) {
			sr.Use(middlewares.AccessTokenRequired(ur.authSrv))
			sr.Get("/myinfo", ur.myInfo)
			sr.Get("/mypage", ur.myPage) // TODO: implement this
		})
	})

	return mux
}

func (ur *userRouter) signUp(w http.ResponseWriter, r *http.Request) {
	// get email and password from form data
	email, password := r.FormValue("email"), r.FormValue("password")

	// create user
	err := ur.userSrv.SignUp(r.Context(), email, password)
	if err != nil {
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	// send response
	resp := models.CommonResponse{
		Status:  http.StatusCreated,
		Message: "Successfully signed up",
	}

	utils.WriteJSON(w, http.StatusCreated, resp)
}

func (ur *userRouter) login(w http.ResponseWriter, r *http.Request) {
	email, password := r.FormValue("email"), r.FormValue("password")

	userInfo, err := ur.userSrv.Login(r.Context(), email, password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	jwtUser := models.JWTUser{
		ID:    userInfo.ID,
		Email: userInfo.Email,
	}

	tokenPair, err := ur.authSrv.GenerateTokenPair(jwtUser)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// set refresh token to cookie
	// TODO: set domain
	refreshCookie := ur.newRefreshCookie(tokenPair.RefreshToken, "", tokenPair.RefreshTokenExpiry)
	http.SetCookie(w, refreshCookie)

	// send response
	var resp models.LoginResponse
	resp.UserInfo = *userInfo
	resp.AccessToken = tokenPair.AccessToken

	utils.WriteJSON(w, http.StatusOK, resp)
}

func (ur *userRouter) refresh(w http.ResponseWriter, r *http.Request) {
	// get refresh token from cookie
	var refreshCookie *http.Cookie

	for _, cookie := range r.Cookies() {
		if cookie.Name == "refresh_token" {
			refreshCookie = cookie
			break
		}
	}

	var resp models.CommonResponse

	if refreshCookie == nil {
		resp.Status = http.StatusUnauthorized
		resp.Message = "Refresh token not found"
		utils.WriteJSON(w, http.StatusUnauthorized, resp)
		return
	}

	// validate refresh token
	refreshToken := refreshCookie.Value

	jwtUser, err := ur.authSrv.VerifyToken(refreshToken, models.TokenRoleRefresh)
	if err != nil {
		resp.Status = http.StatusUnauthorized
		resp.Message = "Invalid refresh token"
		utils.WriteJSON(w, http.StatusUnauthorized, resp)
		return
	}

	// get user info
	userInfo, err := ur.userSrv.UserInfo(r.Context(), jwtUser.ID)
	if err != nil {
		resp.Status = http.StatusInternalServerError
		resp.Message = "Failed to get user info"
		utils.WriteJSON(w, http.StatusInternalServerError, resp)
		return
	}

	// generate new token pair
	newJwtUser := models.JWTUser{
		ID:    userInfo.ID,
		Email: userInfo.Email,
	}

	tokenPair, err := ur.authSrv.GenerateTokenPair(newJwtUser)
	if err != nil {
		resp.Status = http.StatusInternalServerError
		resp.Message = "Failed to generate token pair"
		utils.WriteJSON(w, http.StatusInternalServerError, resp)
		return
	}

	// set refresh token to cookie
	// TODO: set domain
	refreshCookie = ur.newRefreshCookie(tokenPair.RefreshToken, "", tokenPair.RefreshTokenExpiry)
	http.SetCookie(w, refreshCookie)

	// send response
	var tokenResp models.AccessTokenResponse
	tokenResp.AccessToken = tokenPair.AccessToken

	utils.WriteJSON(w, http.StatusOK, tokenResp)
}

func (ur *userRouter) logout(w http.ResponseWriter, r *http.Request) {
	// delete refresh token from cookie
	http.SetCookie(w, ur.newExpiredRefreshCookie())

	// send response
	var resp models.CommonResponse
	resp.Status = http.StatusOK
	resp.Message = "Successfully logged out"

	utils.WriteJSON(w, http.StatusOK, resp)
}

func (ur *userRouter) myInfo(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middlewares.UserIDKey).(int32)

	userInfo, err := ur.userSrv.UserInfo(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// send response
	resp := models.UserInfoResponse{}
	resp.UserInfo = *userInfo

	utils.WriteJSON(w, http.StatusOK, resp)
}

func (ur *userRouter) myPage(w http.ResponseWriter, r *http.Request) {
	// TODO: implement this
	w.WriteHeader(http.StatusOK)
}

func (ur *userRouter) checkEmail(w http.ResponseWriter, r *http.Request) {
	var req models.CheckEmailRequest

	err := utils.ReadJSON(w, r, &req)
	if err != nil {
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	exists, err := ur.userSrv.EmailExists(r.Context(), req.Email)
	if err != nil {
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	if exists {
		utils.ErrorJSON(w, errors.New("email already exists"), http.StatusConflict)
		return
	}

	resp := models.CommonResponse{
		Status:  http.StatusOK,
		Message: "Email is available",
	}

	utils.WriteJSON(w, http.StatusOK, resp)
}

func (ur *userRouter) newRefreshCookie(token, domain string, expiry time.Duration) *http.Cookie {
	return &http.Cookie{
		Name:     "refresh_token",
		Value:    token,
		Domain:   domain,
		Path:     "/",
		Expires:  time.Now().Add(expiry),
		MaxAge:   int(expiry.Seconds()),
		SameSite: http.SameSiteStrictMode,
		HttpOnly: true,
		Secure:   true,
	}
}

func (ur *userRouter) newExpiredRefreshCookie() *http.Cookie {
	return &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Domain:   "",
		Path:     "/",
		Expires:  time.Now().Add(-1 * time.Hour),
		MaxAge:   -1,
		SameSite: http.SameSiteStrictMode,
		HttpOnly: true,
		Secure:   true,
	}
}
