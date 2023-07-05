package utils

import "regexp"

const (
	EmailRegex    = `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`
	PasswordRegex = `/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/`
)

func ValidateEmail(email string) bool {
	return regexp.MustCompile(EmailRegex).MatchString(email)
}

func ValidatePassword(password string) bool {
	return regexp.MustCompile(PasswordRegex).MatchString(password)
}
