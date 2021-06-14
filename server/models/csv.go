package models

type SOCVenues struct {
	VenueName  string `csv:"Room"`
	Location   string `csv:"Location"`
	MapPhoto   string `csv:"Map / Photo"`
	Floorplans string `csv:"Floor Plans"`
	VenueType  string `csv:"Venue type"`
}
