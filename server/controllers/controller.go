package controllers

import (
	"server/config"
	"server/middleware"
	"server/services"

	"github.com/gin-gonic/gin"
)

func StartAll(r *gin.Engine) {
	r.Use(middleware.CORSMiddleware())

	r.POST("/register", services.Register) // register; check if user id is unique
	r.POST("/login", services.Login)
	r.PATCH("/reset", services.ResetPassword) // entering old password should not work

	r.GET("/accounts", services.GetAccounts) // shows all users, only the ID
	r.GET("/accounts/:nusnet_id", services.FindAccount)
	r.DELETE("/accounts/:nusnet_id", services.DeleteAccount)

	r.Run(config.LOCAL_HOST)
}
