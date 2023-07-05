package models

type TokenRole uint8

const (
	TokenRoleAccess TokenRole = iota + 1
	TokenRoleRefresh
)

type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type JWTUser struct {
	ID    int32  `json:"id"`
	Email string `json:"email"`
}
