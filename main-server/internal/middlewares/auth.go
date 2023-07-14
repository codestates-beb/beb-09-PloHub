package middlewares

import (
	"context"
	"errors"
	"main-server/internal/models"
	"main-server/internal/services/auth"
	"main-server/internal/utils"
	"net/http"
)

type authContextKey string

const UserIDKey authContextKey = "UserID"

func AccessTokenRequired(authSrv auth.Service) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			var accessCookie *http.Cookie

			for _, cookie := range r.Cookies() {
				if cookie.Name == "access_token" {
					accessCookie = cookie
					break
				}
			}

			if accessCookie == nil {
				utils.ErrorJSON(w, errors.New("access token not found"), http.StatusUnauthorized)
				return
			}

			token := accessCookie.Value

			user, err := authSrv.VerifyToken(token, models.TokenRoleAccess)
			if err != nil {
				utils.ErrorJSON(w, err, http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, user.ID)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
