package main

import (
	"fmt"
	"net/http"

	"github.com/OrbitalbooKING/booKING/server/controllers"
	"github.com/gin-gonic/gin"

	"github.com/OrbitalbooKING/booKING/server/services"
)

func main() {
	r := gin.Default()
	http.Handle("/", http.FileServer(http.Dir("./build")))
	if err := services.ConnectDataBase(); err != nil {
		fmt.Println("Database not connected successfully. " + err.Error())
		panic(err)
	} else {
		fmt.Println("Database connected successfully.")
	}
	services.LoadAllCSV()
	services.CreateAdminAccount()
	controllers.StartAll(r)
}
