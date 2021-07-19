package services

import (
	"fmt"
	"net/smtp"
	"os"

	"github.com/OrbitalbooKING/booKING/server/config"
	"github.com/OrbitalbooKING/booKING/server/models"
	"github.com/matcornic/hermes/v2"
)

func SendPendingApprovalEmail(emailInfo models.EmailInfo) error {
	// Configure hermes by setting a theme and your product info
	h := hermes.Hermes{
		// Optional Theme
		// Theme: new(Default)
		Product: hermes.Product{
			// Appears in header & footer of e-mails
			Name: "OrbitalbooKING",
			Link: "https://orbitalbooking.herokuapp.com",
			// Optional product logo
			Logo: "https://github.com/OrbitalbooKING/booKING/blob/master/assets/logo.png?raw=true",
		},
	}

	// Sender data.
	from := os.Getenv("EMAIL_ADDRESS")
	if from == "" {
		if config.SENDER_EMAIL_ADDRESS == "" {
			return fmt.Errorf("email to send notifications not yet setup, go to server/services/config.go to input SENDER_EMAIL_ADDRESS")
		}
		from = config.SENDER_EMAIL_ADDRESS
	}
	password := os.Getenv("EMAIL_PASSWORD")
	if password == "" {
		if config.SENDER_EMAIL_PASSWORD == "" {
			return fmt.Errorf("email to send notifications not yet setup, go to server/services/config.go to input SENDER_EMAIL_ADDRESS")
		}
		password = config.SENDER_EMAIL_PASSWORD
	}

	// Receiver email address.
	to := []string{
		emailInfo.NUSNET_ID + config.NUS_EMAIL_DOMAIN,
	}

	// smtp server configuration.
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// Message.
	message, err := h.GenerateHTML(models.MakePendingApprovalHTML(emailInfo))
	if err != nil {
		return err
	}

	mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	message = mime + message

	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Sending email.
	err = smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, []byte(message))
	if err != nil {
		return err
	}
	fmt.Println("Email sent successfully!")
	return nil
}

func PopulateEmailInfo(booking []models.BookingRequests) (models.EmailInfo, error) {
	account, exists, err := GetAccount(DB, models.User{Nusnetid: booking[0].Nusnetid})
	if !exists {
		return models.EmailInfo{}, fmt.Errorf("unable to retrieve account with NUSNET ID %s", booking[0].Nusnetid)
	}
	if err != nil {
		return models.EmailInfo{}, fmt.Errorf("error encountered when retrieving account with NUSNET ID %s. "+err.Error(), booking[0].Nusnetid)
	}

	return models.EmailInfo{
		Name:      account.Name,
		NUSNET_ID: account.Nusnetid,
		Bookings:  booking,
	}, nil
}
