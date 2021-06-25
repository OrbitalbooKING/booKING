package utils

import (
	"server/models"
	"testing"
)

func TestHashPassword_ValidInput(t *testing.T) {
	testUser := models.User{
		Nusnetid: "e123",
		Password: "123",
	}
	unHashedUser := testUser
	err := HashPassword(&testUser)
	if err != nil {
		t.Errorf("Expected no errors. Got this error: %s", err.Error())
	}
	if !CheckPasswordHash(unHashedUser, testUser.Password) {
		t.Errorf("Password hashing did not work.")
	}

}

func TestCheckPasswordHash_ValidInput(t *testing.T) {
	testUser := models.User{
		Nusnetid: "test",
		Password: "123",
	}

	unHashedUser := testUser
	if err := HashPassword(&testUser); err != nil {
		t.Fatalf("unexpected error: %s", err.Error())
	}

	result := CheckPasswordHash(unHashedUser, testUser.Password)
	if !result {
		t.Errorf("Correct input evaluated to be wrong.")
	}
}

func TestCheckPasswordHash_WrongInput(t *testing.T) {
	testUser := models.User{
		Nusnetid: "test",
		Password: "123",
	}
	testOtherUser := models.User{
		Nusnetid: "test",
		Password: "456",
	}

	if err := HashPassword(&testUser); err != nil {
		t.Fatalf("unexpected error: %s", err.Error())
	}
	if err := HashPassword(&testOtherUser); err != nil {
		t.Fatalf("unexpected error: %s", err.Error())
	}

	result := CheckPasswordHash(testUser, testOtherUser.Password)
	if result {
		t.Errorf("Wrong input evaluated to be correct.")
	}
}
