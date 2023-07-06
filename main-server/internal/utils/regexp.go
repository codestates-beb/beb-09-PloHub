package utils

import "regexp"

const (
	EmailRegex    = `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`
	PasswordRegex = `/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/`
)

func ValidateEmail(email string) (bool, error) {
	return regexp.MatchString(EmailRegex, email)
}

func ValidatePassword(password string) (bool, error) {
	return regexp.MatchString(PasswordRegex, password)
}
