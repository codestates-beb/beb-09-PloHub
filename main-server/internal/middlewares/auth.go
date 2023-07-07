package middlewares

import (
	"context"
	"errors"
	"main-server/internal/models"
	"main-server/internal/services/auth"
	"main-server/internal/utils"
	"net/http"
	"strings"
)

type authContextKey string

const UserIDKey authContextKey = "UserID"

func AccessTokenRequired(authSrv auth.Service) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Add("Vary", "Authorization")

			authorization := r.Header.Get("Authorization")

			if authorization == "" {
				utils.ErrorJSON(w, errors.New("authorization header is missing"), http.StatusUnauthorized)
				return
			}

			authParts := strings.Split(authorization, " ")
			if len(authParts) != 2 {
				utils.ErrorJSON(w, errors.New("authorization header is invalid"), http.StatusUnauthorized)
				return
			}

			if authParts[0] != "Bearer" {
				utils.ErrorJSON(w, errors.New("authorization header is invalid"), http.StatusUnauthorized)
				return
			}

			token := authParts[1]

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
