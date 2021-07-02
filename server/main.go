package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"server/controllers"

	"server/services"
)

func main() {
	r := gin.Default()
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/public/", http.StripPrefix("/public/", fs))
	if err := services.ConnectDataBase(); err != nil {
		fmt.Println("Database not connected successfully. " + err.Error())
		panic(err)
	} else {
		fmt.Println("Database connected successfully.")
	}
	services.LoadAllCSV()

	controllers.StartAll(r)
}
