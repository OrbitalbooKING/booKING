package models

import (
	"fmt"
	"time"

	"github.com/OrbitalbooKING/booKING/server/config"
	"github.com/matcornic/hermes/v2"
)

type PendingApprovalInfo struct {
	Name      string
	NUSNET_ID string
	Bookings  []BookingRequests
}

type ResetInfo struct {
	Name      string
	NUSNET_ID string
	TempPass  string
}

type StaffCreationInfo struct {
	Name     string
	StaffID  string
	TempPass string
}

type RejectInfo struct {
	Name      string
	NUSNET_ID string
	BookingID string
	Booking   BookingRequests
	Reason    string
}

func MakePendingApprovalHTML(info PendingApprovalInfo) hermes.Email {
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
						Text: "Go to booKING",
						Link: config.HEROKU_HOST,
					},
				},
			},
		},
	}
}

func MakePasswordResetHTML(info ResetInfo) hermes.Email {
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

func MakeStaffCreationHTML(info StaffCreationInfo) hermes.Email {
	return hermes.Email{
		Body: hermes.Body{
			Name: info.Name,
			Intros: []string{
				"Welcome to booKING! We're very excited to have you on board.",
				fmt.Sprintf("We have received your registration for a staff account with ID %s.", info.StaffID),
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
						Text: "booKING",
						Link: config.HEROKU_HOST,
					},
				},
			},
			Outros: []string{
				"Need help, or have questions? Just reply to this email, we'd love to help.",
			},
		},
	}
}

func MakeRejectHTML(info RejectInfo) hermes.Email {
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
					Instructions: "Log in to make another booking, or check the status of all your booking(s):",
					Button: hermes.Button{
						Text: "booKING",
						Link: config.HEROKU_HOST,
					},
				},
			},
			Outros: []string{
				"Need help, or have questions? Just reply to this email, we'd love to help.",
			},
		},
	}
}
