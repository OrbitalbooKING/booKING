package models

import (
	"fmt"
	"time"

	"github.com/matcornic/hermes"
)

type EmailInfo struct {
	Name      string
	NUSNET_ID string
	Bookings  []BookingRequests
}

type PendingApprovalEmail struct {
}

func (email *PendingApprovalEmail) Name() string {
	return "PendingApprovalEmail"
}

func MakePendingApprovalHTML(info EmailInfo) hermes.Email {
	// write bookings
	var data [][]hermes.Entry
	for _, s := range info.Bookings {
		tempData := []hermes.Entry{
			{Key: "BookingID", Value: s.ID.String()},
			{Key: "Venue", Value: s.Venuename},
			{Key: "Unit", Value: s.Buildingname + " " + s.Unit},
			{Key: "Start", Value: s.Eventstart.Format(time.RFC1123Z)},
			{Key: "End", Value: (s.Eventstart.Add(time.Hour).Format(time.RFC1123Z))},
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
						Link: "https://orbitalbooKING.herokuapp.com",
					},
				},
			},
		},
	}
}
