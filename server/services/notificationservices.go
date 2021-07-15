package services

import (
	"fmt"
	"net/smtp"
	"os"

	"github.com/OrbitalbooKING/booKING/server/config"
)

func SendPendingApprovalEmail(user string) error {
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
		user + config.NUS_EMAIL_DOMAIN,
	}

	// smtp server configuration.
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// Message.
	message := []byte("This is a test email message.")

	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Sending email.
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
	if err != nil {
		return err
	}
	fmt.Println("Email sent successfully!")
	return nil
}
