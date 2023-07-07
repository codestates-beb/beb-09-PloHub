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
	"go.uber.org/zap"
)

type userRouter struct {
	domain  string
	userSvc user.Service
	authSvc auth.Service
}

func NewUserRouter(domain string, userSvc user.Service, authSvc auth.Service) Router {
	return &userRouter{
		domain:  domain,
		userSvc: userSvc,
		authSvc: authSvc,
	}
}

// Route returns a http.Handler that handles user related requests
func (ur *userRouter) Route() http.Handler {
	mux := chi.NewRouter()

	mux.Route("/users", func(r chi.Router) {
		r.Post("/signup", ur.signUp)
		r.Post("/login", ur.login)
		r.Post("/refresh", ur.refresh)
		r.Post("/logout", ur.logout)
		r.Post("/check-email", ur.checkEmail)

		r.Group(func(sr chi.Router) {
			sr.Use(middlewares.AccessTokenRequired(ur.authSvc))
			sr.Get("/myinfo", ur.myInfo)
			sr.Get("/mypage", ur.myPage) // TODO: implement this
			sr.Post("/change-nickname", ur.changeNickname)
		})
	})

	return mux
}

// signUp handles POST /users/signup
func (ur *userRouter) signUp(w http.ResponseWriter, r *http.Request) {
	// get email and password from form data
	email, password := r.FormValue("email"), r.FormValue("password")

	// validate email and password
	if err := utils.ValidateEmail(email); err != nil {
		zap.L().Error("failed to validate email", zap.Error(err))
		if !errors.Is(err, utils.ErrInvalidEmail) {
			err = errors.New("unable to validate email")
		}
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	if err := utils.ValidatePassword(password); err != nil {
		zap.L().Error("failed to validate password", zap.Error(err))
		if !errors.Is(err, utils.ErrInvalidPassword) {
			err = errors.New("unable to validate password")
		}
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	// create user
	err := ur.userSvc.SignUp(r.Context(), email, password)
	if err != nil {
		zap.L().Error("failed to sign up", zap.Error(err))
		if err != user.ErrEmailAlreadyExists {
			err = errors.New("unable to sign up, please try again")
		}
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	// send response
	var resp models.CommonResponse
	resp.Status = http.StatusOK
	resp.Message = "Successfully signed up"

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

// login handles POST /users/login
func (ur *userRouter) login(w http.ResponseWriter, r *http.Request) {
	// get email and password from form data
	email, password := r.FormValue("email"), r.FormValue("password")

	// try to login
	userInfo, err := ur.userSvc.Login(r.Context(), email, password)
	if err != nil {
		zap.L().Error("failed to login", zap.Error(err), zap.String("email", email))
		utils.ErrorJSON(w, errors.New("unable to login, please check your email and password"), http.StatusBadRequest)
		return
	}

	// generate jwt user
	jwtUser := models.JWTUser{
		ID:    userInfo.ID,
		Email: userInfo.Email,
	}

	// generate token pair
	tokenPair, err := ur.authSvc.GenerateTokenPair(jwtUser)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// set refresh token to cookie
	refreshCookie := ur.newRefreshCookie(tokenPair.RefreshToken, tokenPair.RefreshTokenExpiry)
	http.SetCookie(w, refreshCookie)

	// send response
	var resp models.LoginResponse
	resp.UserInfo = *userInfo
	resp.AccessToken = tokenPair.AccessToken

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

func (ur *userRouter) refresh(w http.ResponseWriter, r *http.Request) {
	// get refresh token from cookie
	var refreshCookie *http.Cookie

	// find refresh token cookie
	for _, cookie := range r.Cookies() {
		if cookie.Name == "refresh_token" {
			refreshCookie = cookie
			break
		}
	}

	// check if refresh token cookie exists
	if refreshCookie == nil {
		utils.ErrorJSON(w, errors.New("refresh token not found"), http.StatusUnauthorized)
		return
	}

	// verify refresh token
	refreshToken := refreshCookie.Value

	jwtUser, err := ur.authSvc.VerifyToken(refreshToken, models.TokenRoleRefresh)
	if err != nil {
		zap.L().Error("failed to verify refresh token", zap.Error(err), zap.String("refresh_token", refreshToken))
		utils.ErrorJSON(w, errors.New("invalid refresh token"), http.StatusUnauthorized)
		return
	}

	// get user info
	userInfo, err := ur.userSvc.UserInfo(r.Context(), jwtUser.ID)
	if err != nil {
		zap.L().Error("failed to get user info", zap.Error(err), zap.Int32("user_id", jwtUser.ID))
		utils.ErrorJSON(w, errors.New("unable to get user info"), http.StatusInternalServerError)
		return
	}

	// generate new jwt user
	newJwtUser := models.JWTUser{
		ID:    userInfo.ID,
		Email: userInfo.Email,
	}

	// generate new token pair
	tokenPair, err := ur.authSvc.GenerateTokenPair(newJwtUser)
	if err != nil {
		zap.L().Error("failed to generate token pair", zap.Error(err), zap.Int32("user_id", jwtUser.ID))
		utils.ErrorJSON(w, errors.New("unable to generate token pair"), http.StatusInternalServerError)
		return
	}

	// set refresh token to cookie
	refreshCookie = ur.newRefreshCookie(tokenPair.RefreshToken, tokenPair.RefreshTokenExpiry)
	http.SetCookie(w, refreshCookie)

	// send response
	var resp models.AccessTokenResponse
	resp.AccessToken = tokenPair.AccessToken

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

// logout handles POST /users/logout
func (ur *userRouter) logout(w http.ResponseWriter, r *http.Request) {
	// delete refresh token from cookie
	http.SetCookie(w, ur.newExpiredRefreshCookie())

	// send response
	var resp models.CommonResponse
	resp.Status = http.StatusOK
	resp.Message = "Successfully logged out"

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

// myInfo handles GET /users/myinfo
func (ur *userRouter) myInfo(w http.ResponseWriter, r *http.Request) {
	// get user id from context (set by AccessTokenRequired middleware)
	userID := r.Context().Value(middlewares.UserIDKey).(int32)

	// get user info
	userInfo, err := ur.userSvc.UserInfo(r.Context(), userID)
	if err != nil {
		zap.L().Error("failed to get user info", zap.Error(err), zap.Int32("user_id", userID))
		utils.ErrorJSON(w, errors.New("unable to get user info"), http.StatusInternalServerError)
		return
	}

	// send response
	var resp models.UserInfoResponse
	resp.UserInfo = *userInfo

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

// myPage handles GET /users/mypage
func (ur *userRouter) myPage(w http.ResponseWriter, r *http.Request) {
	// TODO: implement this
	w.WriteHeader(http.StatusOK)
}

// checkEmail handles POST /users/check-email
func (ur *userRouter) checkEmail(w http.ResponseWriter, r *http.Request) {
	var req models.CheckEmailRequest

	// read request body
	err := utils.ReadJSON(w, r, &req)
	if err != nil {
		zap.L().Error("failed to read request body", zap.Error(err))
		utils.ErrorJSON(w, errors.New("unable to read request body"), http.StatusBadRequest)
		return
	}

	// validate email
	if err := utils.ValidateEmail(req.Email); err != nil {
		zap.L().Error("failed to validate email", zap.Error(err))
		if !errors.Is(err, utils.ErrInvalidEmail) {
			err = errors.New("unable to validate email")
		}
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	// check if email exists
	err = ur.userSvc.EmailExists(r.Context(), req.Email)
	if err != nil {
		zap.L().Error("failed to check if email exists", zap.Error(err))
		statusCode := http.StatusBadRequest
		if err != user.ErrEmailAlreadyExists {
			err = errors.New("unable to check if email exists")
			statusCode = http.StatusInternalServerError
		}
		utils.ErrorJSON(w, err, statusCode)
		return
	}

	// send response
	var resp models.CommonResponse
	resp.Status = http.StatusOK
	resp.Message = "Email is available"

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

// changeNickname handles POST /users/change-nickname
func (ur *userRouter) changeNickname(w http.ResponseWriter, r *http.Request) {
	// get user id from context (set by AccessTokenRequired middleware)
	userID := r.Context().Value(middlewares.UserIDKey).(int32)

	// get nickname from form data
	nickname := r.FormValue("nickname")

	// TODO: validate nickname

	// change nickname
	err := ur.userSvc.ChangeNickname(r.Context(), userID, nickname)
	if err != nil {
		zap.L().Error("failed to change nickname", zap.Error(err), zap.Int32("user_id", userID))
		if err != user.ErrSameNickname {
			err = errors.New("unable to change nickname")
		}
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}

	// send response
	var resp models.ChangeNicknameResponse
	resp.Status = http.StatusOK
	resp.Message = "Successfully changed nickname"
	resp.Nickname = nickname

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

// newRefreshCookie returns a new refresh token cookie
func (ur *userRouter) newRefreshCookie(token string, expiry time.Duration) *http.Cookie {
	return &http.Cookie{
		Name:     "refresh_token",
		Value:    token,
		Domain:   ur.domain,
		Path:     "/",
		Expires:  time.Now().Add(expiry),
		MaxAge:   int(expiry.Seconds()),
		SameSite: http.SameSiteStrictMode,
		HttpOnly: true,
		Secure:   true,
	}
}

// newExpiredRefreshCookie returns an expired refresh token cookie
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
