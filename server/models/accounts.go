package models

import "time"

type Accounts struct {
	ID              int    `json:"id"`
	Nusnetid        string `json:"NUSNET_ID"`
	Passwordhash    string `json:"password"`
	Name            string
	Facultyid       int
	Gradyear        int
	Profilepic      string
	Accounttypeid   int
	Points          int
	Createdat       time.Time
	Lastupdated     time.Time
	Accountstatusid int
}

type User struct {
	Nusnetid string `json:"NUSNET_ID" form:"NUSNET_ID"`
	Password string `json:"password" form:"password"`
}

type CreateAccountInput struct {
	Nusnetid   string `json:"NUSNET_ID" binding:"required"`
	Password   string `json:"password" binding:"required"`
	Name       string `json:"name"`
	Facultyid  int    `json:"faculty"`
	Gradyear   int    `json:"gradYear"`
	Profilepic string `json:"profilePic"`
}

type Accounttypes struct {
	ID                     int    `csv:"accountTypeID"`
	Accounttypename        string `csv:"typeName"`
	Accounttypedescription string `csv:"typeDescription"`
}

type Accountstatuses struct {
	ID                       int    `csv:"accountStatusid"`
	Accountstatusname        string `csv:"statusName"`
	Accountstatusdescription string `csv:"statusDescription"`
}
