package main

import (
	"server/controllers"
	"server/services"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	services.ConnectDataBase()
	services.LoadAllCSV()

	controllers.StartAll(r)
}
