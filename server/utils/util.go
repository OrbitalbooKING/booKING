package utils

import (
	"errors"
	"fmt"
	"server/models"

	_ "github.com/jinzhu/gorm/dialects/postgres"
	"golang.org/x/crypto/bcrypt"
)

// HashPassword hashes user password
func HashPassword(user *models.User) error {
	hashError := errors.New("unable to hash user password")
	bytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		fmt.Printf("Unable to hash password " + err.Error())
		return hashError
	}
	user.Password = string(bytes)
	return nil
}

func CreateHashedPassword(password string) (string, error) {
	createError := errors.New("unable to create hashed password")
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		fmt.Printf("Unable to create hashed password " + err.Error())
		return "", createError
	}
	return string(bytes), nil
}

//CheckPasswordHash compares hash with password
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
