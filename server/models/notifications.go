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
						Color: "#0000FF",
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
