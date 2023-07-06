package middlewares

import (
	"context"
	"main-server/internal/models"
	"main-server/internal/services/auth"
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
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			authParts := strings.Split(authorization, " ")
			if len(authParts) != 2 {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			if authParts[0] != "Bearer" {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			token := authParts[1]

			user, err := authSrv.VerifyToken(token, models.TokenRoleAccess)
			if err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			ctx := r.Context()
			ctx = context.WithValue(ctx, UserIDKey, user.ID)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
