package models

import (
	"mime/multipart"
	"time"

	"github.com/google/uuid"
)

type Accounts struct {
	ID              int    `json:"id"`
	Nusnetid        string `json:"NUSNET_ID"`
	Passwordhash    string `json:"password"`
	Name            string
	Facultyid       int
	Gradyear        int
	Profilepic      uuid.UUID
	Accounttypeid   int
	Points          float64
	Createdat       time.Time
	Lastupdated     time.Time
	Accountstatusid int
}

type AccountDetailed struct {
	ID                 int    `json:"id"`
	Nusnetid           string `json:"NUSNET_ID"`
	Passwordhash       string `json:"password"`
	Name               string
	Facultyid          int
	Facultydescription string
	Gradyear           int
	Profilepic         uuid.UUID
	ProfilepicURL      string
	Accounttypeid      int
	Points             float64
	Createdat          time.Time
	Lastupdated        time.Time
	Accountstatusid    int
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
	Nusnetid   string                `form:"NUSNET_ID" binding:"required"`
	Password   string                `form:"password" binding:"required"`
	Name       string                `form:"name" binding:"required"`
	Facultyid  int                   `form:"faculty" binding:"required"`
	Gradyear   int                   `form:"gradYear" binding:"required"`
	Profilepic *multipart.FileHeader `form:"profilePic"`
}

type CreateStaffAccountInput struct {
	NUSNET_ID string `json:"NUSNET_ID" binding:"required"`
	Name      string `json:"name" binding:"required"`
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

type EditProfile struct {
	Nusnetid   string                `form:"NUSNET_ID"`
	Name       string                `form:"name"`
	Facultyid  int                   `form:"faculty"`
	Gradyear   int                   `form:"gradYear"`
	Profilepic *multipart.FileHeader `form:"profilePic"`
}

type PasswordReset struct {
	Nusnetid    string `json:"NUSNET_ID"`
	OldPassword string `json:"oldPassword"`
	NewPassword string `json:"newPassword"`
}
