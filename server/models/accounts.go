package models

type Accounts struct {
	ID        uint   `json:"id" gorm:"primary key"`
	Nusnet_id string `json:"nusnet_id"`
	Password  string `json:"password"`
}

type User struct {
	Nusnet_id string `json:"nusnet_id"`
	Password  string `json:"password"`
}

type CreateAccountInput struct {
	Nusnet_id string `json:"nusnet_id" binding:"required"`
	Password  string `json:"password" binding:"required"`
}

// only has password as nusnet_id doesnt change
type Reset struct {
	Password string `json:"password"`
}
