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
	Points          float64
	Createdat       time.Time
	Lastupdated     time.Time
	Accountstatusid int
}

type AccountDetailed struct {
	ID              int    `json:"id"`
	Nusnetid        string `json:"NUSNET_ID"`
	Passwordhash    string `json:"password"`
	Name            string
	Facultyid       int
	Facultyname     string
	Gradyear        int
	Profilepic      string
	Accounttypeid   int
	Points          float64
	Createdat       time.Time
	Lastupdated     time.Time
	Accountstatusid int
}

type User struct {
	Nusnetid string `json:"NUSNET_ID" form:"NUSNET_ID"`
	Password string `json:"password" form:"password"`
}

type LoginOutput struct {
	Nusnetid        string
	Name            string
	Accounttypename string
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

type PointsTarget struct {
	User   string  `json:"user"`
	Target string  `json:"target"`
	Points float64 `json:"points"`
}
