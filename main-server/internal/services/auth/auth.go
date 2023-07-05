package auth

import (
	"errors"
	"fmt"
	"main-server/internal/models"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrInvalidToken            = errors.New("invalid token")
	ErrInvalidTokenRole        = errors.New("invalid token role")
	ErrInvalidSigningMethod    = errors.New("invalid token signing method")
	ErrAccessTokenKeyRequired  = errors.New("access token key is required")
	ErrRefreshTokenKeyRequired = errors.New("refresh token key is required")
)

type Service interface {
	GenerateTokenPair(u models.JWTUser) (*models.TokenPair, error)
	VerifyToken(token string, role models.TokenRole) (*models.JWTUser, error)
}

type service struct {
	issuer             string
	audience           string
	accessTokenKey     string
	refreshTokenKey    string
	accessTokenExpiry  time.Duration
	refreshTokenExpiry time.Duration
}

func NewService(accessTokenKey, refreshTokenKey string, opts ...Option) (Service, error) {
	svc := &service{
		accessTokenKey:  accessTokenKey,
		refreshTokenKey: refreshTokenKey,
	}

	for _, opt := range opts {
		opt(svc)
	}

	return svc.validate()
}

func (s *service) GenerateTokenPair(u models.JWTUser) (*models.TokenPair, error) {
	accessToken, err := s.generateToken(s.getAccessTokenClaims(u), s.accessTokenKey)
	if err != nil {
		return nil, err
	}

	refreshToken, err := s.generateToken(s.getRefreshTokenClaims(u), s.refreshTokenKey)
	if err != nil {
		return nil, err
	}

	return &models.TokenPair{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *service) VerifyToken(tokenString string, role models.TokenRole) (*models.JWTUser, error) {
	fn, err := s.getKeyfunc(role)
	if err != nil {
		return nil, err
	}

	token, err := jwt.Parse(tokenString, fn)
	if err != nil {
		return nil, err
	}

	var u models.JWTUser

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if iss, ok := claims["iss"].(string); !ok || iss != s.issuer {
			return nil, ErrInvalidToken
		}

		if aud, ok := claims["aud"].(string); !ok || aud != s.audience {
			return nil, ErrInvalidToken
		}

		if sub, ok := claims["sub"].(string); ok {
			id, err := strconv.Atoi(sub)
			if err != nil {
				return nil, err
			}
			if id < 1 {
				return nil, ErrInvalidToken
			}
			u.ID = int32(id)
		}

		if email, ok := claims["email"].(string); ok {
			u.Email = email
		}

		return &u, nil
	}

	return nil, ErrInvalidToken
}

func (s *service) generateToken(claims jwt.MapClaims, key string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(key))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func (s *service) getKeyfunc(role models.TokenRole) (jwt.Keyfunc, error) {
	var key string

	switch role {
	case models.TokenRoleAccess:
		key = s.accessTokenKey
	case models.TokenRoleRefresh:
		key = s.refreshTokenKey
	default:
		return nil, ErrInvalidTokenRole
	}

	return func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrInvalidSigningMethod
		}

		return []byte(key), nil
	}, nil
}

func (s *service) getAccessTokenClaims(u models.JWTUser) jwt.MapClaims {
	return jwt.MapClaims{
		"email": u.Email,
		"iss":   s.issuer,
		"aud":   s.audience,
		"sub":   fmt.Sprint(u.ID),
		"exp":   time.Now().Add(s.accessTokenExpiry).UTC().Unix(),
		"iat":   time.Now().UTC().Unix(),
		"typ":   "JWT",
	}
}

func (s *service) getRefreshTokenClaims(u models.JWTUser) jwt.MapClaims {
	return jwt.MapClaims{
		"iss": s.issuer,
		"aud": s.audience,
		"sub": fmt.Sprint(u.ID),
		"exp": time.Now().Add(s.refreshTokenExpiry).UTC().Unix(),
		"iat": time.Now().UTC().Unix(),
	}
}

func (s *service) validate() (Service, error) {
	if s.accessTokenKey == "" {
		return nil, ErrAccessTokenKeyRequired
	}

	if s.refreshTokenKey == "" {
		return nil, ErrRefreshTokenKeyRequired
	}

	if s.issuer == "" {
		s.issuer = "main-server"
	}

	if s.audience == "" {
		s.audience = "localhost"
	}

	if s.accessTokenExpiry == 0 {
		s.accessTokenExpiry = time.Minute * 15
	}

	if s.refreshTokenExpiry == 0 {
		s.refreshTokenExpiry = time.Hour * 12
	}

	return s, nil
}
