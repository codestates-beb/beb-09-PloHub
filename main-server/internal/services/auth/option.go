package auth

import "time"

type Option func(*service)

func WithDefaultOptions() Option {
	return func(s *service) {
		s.issuer = "main-server"
		s.audience = "localhost"
		s.accessTokenExpiry = time.Minute * 15
		s.refreshTokenExpiry = time.Hour * 12
	}
}

func WithIssuer(issuer string) Option {
	return func(s *service) {
		s.issuer = issuer
	}
}

func WithAudience(audience string) Option {
	return func(s *service) {
		s.audience = audience
	}
}

func WithAccessTokenExpiry(expiry time.Duration) Option {
	return func(s *service) {
		s.accessTokenExpiry = expiry
	}
}

func WithRefreshTokenExpiry(expiry time.Duration) Option {
	return func(s *service) {
		s.refreshTokenExpiry = expiry
	}
}
