package models

type Accounts struct {
	ID           int    `json:"id" gorm:"primary key"`
	Nusnetid     string `json:"NUSNET_ID"`
	Passwordhash string `json:"password"`
}

type User struct {
	Nusnetid string `json:"NUSNET_ID"`
	Password string `json:"password"`
}

type CreateAccountInput struct {
	Nusnetid string `json:"NUSNET_ID" binding:"required"`
	Password string `json:"password" binding:"required"`
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
