package routers

import (
	"main-server/internal/middlewares"
	"main-server/internal/services/auth"
	"main-server/internal/services/user"
	"net/http"

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
			sr.Get("/mypage", ur.myPage)
		})
	})

	return mux
}

func (ur *userRouter) signUp(w http.ResponseWriter, r *http.Request) {

}

func (ur *userRouter) login(w http.ResponseWriter, r *http.Request) {

}

func (ur *userRouter) refresh(w http.ResponseWriter, r *http.Request) {
}

func (ur *userRouter) logout(w http.ResponseWriter, r *http.Request) {
}

func (ur *userRouter) myInfo(w http.ResponseWriter, r *http.Request) {
}

func (ur *userRouter) myPage(w http.ResponseWriter, r *http.Request) {
}

func (ur *userRouter) checkEmail(w http.ResponseWriter, r *http.Request) {
}
