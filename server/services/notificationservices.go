package services

import (
	"fmt"
	"net/smtp"
	"os"
	"time"

	"github.com/OrbitalbooKING/booKING/server/config"
	"github.com/OrbitalbooKING/booKING/server/models"
	"github.com/matcornic/hermes/v2"
)

func MakePendingApprovalHTML(info models.PendingApprovalInfo) hermes.Email {
	// write bookings
	var data [][]hermes.Entry
	for _, s := range info.Bookings {
		tempData := []hermes.Entry{
			{Key: "BookingID", Value: s.ID.String()},
			{Key: "Venue", Value: s.Venuename},
			{Key: "Unit", Value: s.Buildingname + " " + s.Unit},
			{Key: "Start", Value: s.Eventstart.Format(time.ANSIC)},
			{Key: "End", Value: s.Eventstart.Add(time.Hour).Format(time.ANSIC)},
			{Key: "Pax", Value: fmt.Sprintf("%d", s.Pax)},
			{Key: "Cost", Value: fmt.Sprintf("%.1f", s.Cost)},
		}
		data = append(data, tempData)
	}

	return hermes.Email{
		Body: hermes.Body{
			Name: info.Name,
			Intros: []string{
				"Your bookings have been processed successfully.",
			},
			Table: hermes.Table{
				Data: data,
				Columns: hermes.Columns{
					CustomWidth: map[string]string{
						"BookingID":         "20%",
						"Venue":             "10%",
						"Unit":              "10%",
						"Reservation start": "25%",
						"Reservation end":   "25%",
						"Pax":               "5%",
						"Cost":              "5%",
					},
					CustomAlignment: map[string]string{
						"Cost": "right",
					},
				},
			},
			Actions: []hermes.Action{
				{
					Instructions: "You can check the status of your booking and more in your dashboard. Log in to the app now to check:",
					Button: hermes.Button{
						Color: "#5aafff",
						Text:  "Go to booKING",
						Link:  config.HEROKU_HOST,
					},
				},
			},
		},
	}
}

func MakePasswordResetHTML(info models.ResetInfo) hermes.Email {
	return hermes.Email{
		Body: hermes.Body{
			Name: info.Name,
			Intros: []string{
				fmt.Sprintf("You have received this email because a password reset request for your booKING account tied to the NUSNET ID %s was received.", info.NUSNET_ID),
				"Use the temporary password we have generated for you to log in.",
				"You are highly encouraged to reset your password once you have logged in.",
			},
			Dictionary: []hermes.Entry{
				{Key: "Temporary password", Value: info.TempPass},
			},
			Actions: []hermes.Action{
				{
					Instructions: "Login now.",
					Button: hermes.Button{
						Color: "#5aafff",
						Text:  "Go to booKING",
						Link:  config.HEROKU_HOST,
					},
				},
			},
			Outros: []string{
				"If you did not request a password reset, no further action is required on your part.",
			},
			Signature: "Thanks",
		},
	}
}

func MakeStaffCreationHTML(info models.StaffCreationInfo) hermes.Email {
	return hermes.Email{
		Body: hermes.Body{
			Name: info.Name,
			Intros: []string{
				"Welcome to booKING! We're very excited to have you on board.",
				fmt.Sprintf("We have received your registration for a staff account with ID %s.", info.NUSNET_ID),
				"A temporary password has been generated for you to log in for the first time.",
				"Please change this password as soon as you log in.",
			},
			Dictionary: []hermes.Entry{
				{Key: "Temporary password", Value: info.TempPass},
			},
			Actions: []hermes.Action{
				{
					Instructions: "Log in now:",
					Button: hermes.Button{
						Color: "#5aafff",
						Text:  "booKING",
						Link:  config.HEROKU_HOST,
					},
				},
			},
			Outros: []string{
				"Need help, or have questions? Just reply to this email, we'd love to help.",
			},
		},
	}
}

func MakeRejectHTML(info models.RejectInfo) hermes.Email {
	return hermes.Email{
		Body: hermes.Body{
			Name: info.Name,
			Intros: []string{
				"We are sorry to inform that your booking has been rejected.",
				"The cost of the booking will be refunded into your account.",
				"Details of the rejected booking are as follows:",
			},
			Dictionary: []hermes.Entry{
				{Key: "BookingID", Value: info.Booking.ID.String()},
				{Key: "Venue", Value: info.Booking.Venuename},
				{Key: "Unit", Value: info.Booking.Buildingname + " " + info.Booking.Unit},
				{Key: "Start", Value: info.Booking.Eventstart.Format(time.ANSIC)},
				{Key: "End", Value: info.Booking.Eventstart.Add(time.Hour).Format(time.ANSIC)},
				{Key: "Pax", Value: fmt.Sprintf("%d", info.Booking.Pax)},
				{Key: "Cost", Value: fmt.Sprintf("%.1f", info.Booking.Cost)},
				{Key: "Reason provided by staff", Value: info.Reason},
			},
			Actions: []hermes.Action{
				{
					Instructions: "Log in to make another booking, or check the status of your booking(s):",
					Button: hermes.Button{
						Color: "#5aafff",
						Text:  "booKING",
						Link:  config.HEROKU_HOST,
					},
				},
			},
			Outros: []string{
				"Need help, or have questions? Just reply to this email, we'd love to help.",
			},
		},
	}
}

func MakeApproveHTML(info models.ApproveInfo) hermes.Email {
	return hermes.Email{
		Body: hermes.Body{
			Name: info.Name,
			Intros: []string{
				"We are pleased to inform that your booking has been approved.",
				"Details of the approved booking are as follows:",
			},
			Dictionary: []hermes.Entry{
				{Key: "BookingID", Value: info.Booking.ID.String()},
				{Key: "Venue", Value: info.Booking.Venuename},
				{Key: "Unit", Value: info.Booking.Buildingname + " " + info.Booking.Unit},
				{Key: "Start", Value: info.Booking.Eventstart.Format(time.ANSIC)},
				{Key: "End", Value: info.Booking.Eventstart.Add(time.Hour).Format(time.ANSIC)},
				{Key: "Pax", Value: fmt.Sprintf("%d", info.Booking.Pax)},
				{Key: "Cost", Value: fmt.Sprintf("%.1f", info.Booking.Cost)},
			},
			Actions: []hermes.Action{
				{
					Instructions: "Log in to make another booking, or check the status of your booking(s):",
					Button: hermes.Button{
						Color: "#5aafff",
						Text:  "booKING",
						Link:  config.HEROKU_HOST,
					},
				},
			},
			Outros: []string{
				"Need help, or have questions? Just reply to this email, we'd love to help.",
			},
		},
	}
}

func MakeAccountCreationHTML(info models.AccountCreationInfo) hermes.Email {
	return hermes.Email{
		Body: hermes.Body{
			Name: info.Name,
			Intros: []string{
				"Welcome to booKING! We're very excited to have you on board.",
				fmt.Sprintf("We have received your registration for a user account with NUSNET ID %s.", info.NUSNET_ID),
				"",
				"With the limited venues and resources available in School of Computing, students struggle to find a proper venue to study or to work on group projects.",
				"We hope this platform is able to solve the mentioned problem and let you focus on what's more important; studying!",
			},
			Actions: []hermes.Action{
				{
					Instructions: "Log in to make your first booking now!",
					Button: hermes.Button{
						Color: "#5aafff",
						Text:  "booKING",
						Link:  config.HEROKU_HOST,
					},
				},
			},
			Outros: []string{
				"Didn't signup for an account?",
				fmt.Sprintf("Reset your password now at %s to prevent unauthorised access.", config.HEROKU_HOST_RESET_PAGE),
			},
		},
	}
}

func SendPendingApprovalEmail(emailInfo models.PendingApprovalInfo) error {
	// Configure hermes by setting a theme and your product info
	h := hermes.Hermes{
		// Optional Theme
		// Theme: new(Default)
		Product: hermes.Product{
			// Appears in header & footer of e-mails
			Name: "OrbitalbooKING",
			Link: config.HEROKU_HOST,
			// Optional product logo
			Logo: config.APP_LOGO,
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
	message, err := h.GenerateHTML(MakePendingApprovalHTML(emailInfo))
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

func PopulatePendingEmailInfo(booking []models.BookingRequests) (models.PendingApprovalInfo, error) {
	account, exists, err := GetAccount(DB, models.User{Nusnetid: booking[0].Nusnetid})
	if !exists {
		return models.PendingApprovalInfo{}, fmt.Errorf("unable to retrieve account with NUSNET ID %s", booking[0].Nusnetid)
	}
	if err != nil {
		return models.PendingApprovalInfo{}, fmt.Errorf("error encountered when retrieving account with NUSNET ID %s. "+err.Error(), booking[0].Nusnetid)
	}

	return models.PendingApprovalInfo{
		Name:      account.Name,
		NUSNET_ID: account.Nusnetid,
		Bookings:  booking,
	}, nil
}

func SendPasswordResetEmail(emailInfo models.ResetInfo) error {
	// Configure hermes by setting a theme and your product info
	h := hermes.Hermes{
		// Optional Theme
		// Theme: new(Default)
		Product: hermes.Product{
			// Appears in header & footer of e-mails
			Name: "OrbitalbooKING",
			Link: config.HEROKU_HOST,
			// Optional product logo
			Logo: config.APP_LOGO,
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
	message, err := h.GenerateHTML(MakePasswordResetHTML(emailInfo))
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

func SendStaffCreationEmail(emailInfo models.StaffCreationInfo) error {
	// Configure hermes by setting a theme and your product info
	h := hermes.Hermes{
		// Optional Theme
		// Theme: new(Default)
		Product: hermes.Product{
			// Appears in header & footer of e-mails
			Name: "OrbitalbooKING",
			Link: config.HEROKU_HOST,
			// Optional product logo
			Logo: config.APP_LOGO,
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
	message, err := h.GenerateHTML(MakeStaffCreationHTML(emailInfo))
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

func SendRejectBookingEmail(emailInfo models.RejectInfo) error {
	// Configure hermes by setting a theme and your product info
	h := hermes.Hermes{
		// Optional Theme
		// Theme: new(Default)
		Product: hermes.Product{
			// Appears in header & footer of e-mails
			Name: "OrbitalbooKING",
			Link: config.HEROKU_HOST,
			// Optional product logo
			Logo: config.APP_LOGO,
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
	message, err := h.GenerateHTML(MakeRejectHTML(emailInfo))
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

func PopulateRejectEmailInfo(bookingID string, rejectReason string) (models.RejectInfo, error) {
	booking, exists, err := RetrieveBooking(DB, models.URLBooking{BookingID: bookingID})
	if !exists {
		return models.RejectInfo{}, fmt.Errorf("booking with ID %s does not exist", bookingID)
	}
	if err != nil {
		return models.RejectInfo{}, err
	}

	account, exists, err := GetAccount(DB, models.User{Nusnetid: booking.Nusnetid})
	if !exists {
		return models.RejectInfo{}, fmt.Errorf("user with NUSNET ID %s does not exist", bookingID)
	}
	if err != nil {
		return models.RejectInfo{}, err
	}

	rejectInfo := models.RejectInfo{
		Name:      account.Name,
		NUSNET_ID: account.Nusnetid,
		BookingID: booking.ID.String(),
		Booking:   booking,
		Reason:    rejectReason,
	}
	return rejectInfo, nil
}

func SendApproveBookingEmail(emailInfo models.ApproveInfo) error {
	// Configure hermes by setting a theme and your product info
	h := hermes.Hermes{
		// Optional Theme
		// Theme: new(Default)
		Product: hermes.Product{
			// Appears in header & footer of e-mails
			Name: "OrbitalbooKING",
			Link: config.HEROKU_HOST,
			// Optional product logo
			Logo: config.APP_LOGO,
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
	message, err := h.GenerateHTML(MakeApproveHTML(emailInfo))
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

func SendAccountCreationEmail(emailInfo models.AccountCreationInfo) error {
	// Configure hermes by setting a theme and your product info
	h := hermes.Hermes{
		// Optional Theme
		// Theme: new(Default)
		Product: hermes.Product{
			// Appears in header & footer of e-mails
			Name: "OrbitalbooKING",
			Link: config.HEROKU_HOST,
			// Optional product logo
			Logo: config.APP_LOGO,
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
	message, err := h.GenerateHTML(MakeAccountCreationHTML(emailInfo))
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
