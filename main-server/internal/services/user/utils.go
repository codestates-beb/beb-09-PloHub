package user

import (
	"errors"
	"main-server/db/plohub"
	"main-server/internal/models"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func matchPassword(hashedPassword, password string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return false, nil
		}
		return false, err
	}

	return true, nil
}

func extractUserInfo(user plohub.User) *models.UserInfo {
	userInfo := &models.UserInfo{}
	userInfo.ID = user.ID
	userInfo.Email = user.Email
	userInfo.Nickname = user.Nickname
	userInfo.Level = user.Level
	userInfo.Address = user.Address
	userInfo.EthAmount = user.EthAmount
	userInfo.TokenAmount = user.TokenAmount
	userInfo.DailyToken = user.DailyToken
	return userInfo
}

func extractPostInfo(posts []plohub.Post) []models.PostInfo {
	return nil
}

func checkUserLoggedInToday(t time.Time) bool {
	return time.Now().Day()-t.Day() == 0
}
