package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/OrbitalbooKING/bookING/server/controllers"

	"github.com/OrbitalbooKING/bookING/server/services"
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
	controllers.StartAll(r)
}
