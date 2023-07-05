package auth

import "time"

var (
	defaultIssuer             = "main-server"
	defaultAudience           = "localhost"
	defaultAccessTokenExpiry  = time.Minute * 15
	defaultRefreshTokenExpiry = time.Hour * 24
)

type Option func(*service)

// WithDefaultOptions sets the default options for the auth service
func WithDefaultOptions() Option {
	return func(s *service) {
		s.issuer = defaultIssuer
		s.audience = defaultAudience
		s.accessTokenExpiry = defaultAccessTokenExpiry
		s.refreshTokenExpiry = defaultRefreshTokenExpiry
	}
}

// WithIssuer sets the issuer for the auth service
func WithIssuer(issuer string) Option {
	return func(s *service) {
		s.issuer = issuer
	}
}

// WithAudience sets the audience for the auth service
func WithAudience(audience string) Option {
	return func(s *service) {
		s.audience = audience
	}
}

// WithAccessTokenExpiry sets the access token expiry for the auth service
func WithAccessTokenExpiry(expiry time.Duration) Option {
	return func(s *service) {
		s.accessTokenExpiry = expiry
	}
}

// WithRefreshTokenExpiry sets the refresh token expiry for the auth service
func WithRefreshTokenExpiry(expiry time.Duration) Option {
	return func(s *service) {
		s.refreshTokenExpiry = expiry
	}
}
