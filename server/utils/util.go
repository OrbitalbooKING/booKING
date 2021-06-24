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
	hashError := errors.New(fmt.Sprintf("unable to hash password for user %s", user.Nusnetid))
	bytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		fmt.Printf("Unable to hash password " + err.Error())
		return hashError
	}
	user.Password = string(bytes)
	return nil
}

//CheckPasswordHash compares hash with password
func CheckPasswordHash(input models.User, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(input.Password))
	return err == nil
}
