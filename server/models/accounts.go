package models

type Accounts struct {
	ID        uint   `json:"id" gorm:"primary key"`
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
