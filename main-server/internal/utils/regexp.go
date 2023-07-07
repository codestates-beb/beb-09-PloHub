package utils

import (
	"errors"
	"regexp"
	"unicode/utf8"
)

var (
	ErrInvalidEmail    = errors.New("invalid email")
	ErrInvalidPassword = errors.New("invalid password")
)

const EmailRegex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"

func ValidateEmail(email string) error {
	valid, err := regexp.MatchString(EmailRegex, email)
	if err != nil {
		return err
	}

	if !valid {
		return ErrInvalidEmail
	}

	return nil
}

func ValidatePassword(password string) error {
	if len(password) < 8 {
		return errors.New("password must be at least 8 characters long")
	}

	valid, err := regexp.MatchString(`([a-z])+`, password)
	if err != nil {
		return err
	}

	if !valid {
		return errors.Join(ErrInvalidPassword, errors.New("password must contain at least one lowercase letter"))
	}

	valid, err = regexp.MatchString(`([A-Z])+`, password)
	if err != nil {
		return err
	}

	if !valid {
		return errors.Join(ErrInvalidPassword, errors.New("password must contain at least one uppercase letter"))
	}

	valid, err = regexp.MatchString("([!@#$%^&*.?-])+", password)
	if err != nil {
		return err
	}

	if !valid {
		return errors.Join(ErrInvalidPassword, errors.New("password must contain at least one special character"))
	}

	return nil
}

func ValidateNickname(nickname string) error {
	length := utf8.RuneCountInString(nickname)
	if length < 2 || length > 8 {
		return errors.New("nickname must be between 2 and 8 characters long")
	}
	return nil
}
