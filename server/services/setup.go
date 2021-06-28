package services

import (
	"fmt"
	"os"
	"server/config"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func ConnectDataBase() error {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		config.DB_HOST, config.DB_PORT, config.DB_USER, config.DB_PASSWORD, config.DB_NAME)

	if dbPort := os.Getenv("DATABASE_URL"); dbPort != "" {
		database, err := gorm.Open("postgres", dbPort)
		if err != nil {
			return err
		} else {
			DB = database
		}
	} else {
		database, err := gorm.Open("postgres", psqlInfo)
		if err != nil {
			return err
		} else {
			DB = database
		}
	}

	if err := DB.DB().Ping(); err != nil {
		return err
	} else {
		return nil
	}
}
