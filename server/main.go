package main

import (
	"net/http"
	"server/controllers"
	"server/services"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	http.Handle("/", http.FileServer(http.Dir("./build")))
	services.ConnectDataBase()
	services.LoadAllCSV()

	controllers.StartAll(r)
}
