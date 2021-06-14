package models

type Accounts struct {
	ID        int    `json:"id" gorm:"primary key"`
	Nusnet_id string `json:"NUSNET_ID"`
	Password  string `json:"password"`
}

type User struct {
	Nusnet_id string `json:"NUSNET_ID"`
	Password  string `json:"password"`
}

type CreateAccountInput struct {
	Nusnet_id string `json:"NUSNET_ID" binding:"required"`
	Password  string `json:"password" binding:"required"`
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
