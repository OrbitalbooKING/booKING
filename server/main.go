package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"server/controllers"

	"server/services"
)

func main() {
	r := gin.Default()
	http.Handle("/", http.FileServer(http.Dir("./build")))
	services.ConnectDataBase()
	services.LoadAllCSV()

	controllers.StartAll(r)
}
