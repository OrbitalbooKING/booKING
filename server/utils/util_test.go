package utils

import (
	"server/models"
	"testing"
)

func TestHashPassword_ValidInput(t *testing.T) {
	testPass := "123"
	testUser := models.User{
		Nusnetid: "e123",
		Password: testPass,
	}
	err := HashPassword(&testUser)
	if !CheckPasswordHash(testPass, testUser.Password) {
		t.Errorf("Password hashing did not work.")
	}
	if err != nil {
		t.Errorf("Expected no errors. Got this error: %s", err.Error())
	}
}

func TestCreateHashedPassword_ValidInput(t *testing.T) {
	testPass := "123"

	result, err := CreateHashedPassword(testPass)
	if !CheckPasswordHash(testPass, result) {
		t.Errorf("Password hashing did not work.")
	}
	if err != nil {
		t.Errorf("Expected no errors. Got this error: %s", err.Error())
	}
}

func TestCheckPasswordHash_ValidInput(t *testing.T) {
	testPass := "123"
	testPassHashed, _ := CreateHashedPassword(testPass)

	result := CheckPasswordHash(testPass, testPassHashed)
	if !result {
		t.Errorf("Correct input evaluated to be wrong.")
	}
}

func TestCheckPasswordHash_WrongInput(t *testing.T) {
	testPass := "123"
	testPassHashed, _ := CreateHashedPassword("456")

	result := CheckPasswordHash(testPass, testPassHashed)
	if result {
		t.Errorf("Wrong input evaluated to be correct.")
	}
}
