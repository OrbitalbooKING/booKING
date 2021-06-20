package controllers

import (
	"server/config"
	"server/middleware"
	"server/services"

	"github.com/gin-gonic/gin"
)

func StartAll(r *gin.Engine) {
	r.Use(middleware.CORSMiddleware())

	r.POST("/register", services.Register)
	r.GET("/get_faculty", services.GetFaculty)
	r.POST("/login", services.Login)
	r.PATCH("/reset", services.ResetPassword)
	r.GET("/home", services.GetVenues)
	r.GET("/search", services.SearchVenues)

	r.GET("/get_profile", services.GetProfile)
	r.GET("get_bookings", services.GetBookings)

	r.GET("/timings", services.GetTimings)
	r.PUT("/make_booking", services.MakeBooking)
	r.GET("/get_pending_booking", services.GetPendingBooking)
	r.POST("/make_pending_booking", services.MakePendingBooking)
	r.DELETE("/delete_pending_booking", services.DeletePendingBooking)
	r.DELETE("/delete_booking", services.DeleteBooking) // not done

	r.GET("/accounts", services.GetAccounts)
	r.DELETE("/accounts/:nusnet_id", services.DeleteAccount)
	// PUT for updating account

	r.Run(config.LOCAL_HOST)
}
