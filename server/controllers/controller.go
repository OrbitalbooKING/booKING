package controllers

import (
	"os"

	"github.com/OrbitalbooKING/booKING/server/config"
	"github.com/OrbitalbooKING/booKING/server/middleware"
	"github.com/OrbitalbooKING/booKING/server/services"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func StartAll(r *gin.Engine) {
	r.Use(middleware.CORSMiddleware())
	r.Use(static.Serve("/", static.LocalFile("./web", true)))
	r.NoRoute(func(c *gin.Context) { c.File("./web") })

	api := r.Group("/api")

	api.POST("/register", services.Register)
	api.GET("/get_faculty", services.GetFaculties)
	api.POST("/login", services.Login)
	api.PATCH("/reset_password", services.ResetPassword)
	api.GET("/home", services.GetVenues)
	api.GET("/search", services.SearchVenues)
	api.POST("/transfer_points", services.TransferPoints)
	api.PUT("/edit_profile", services.EditProfile)

	api.GET("/get_profile", services.GetProfile)
	api.GET("/get_bookings", services.GetBookings)
	api.GET("/check_booking", services.CheckBooking)

	api.GET("/get_booking_requests", services.GetBookingRequests)
	api.PUT("/approve_bookings", services.ApproveBookings)

	api.GET("/timings", services.GetTimings)
	api.PUT("/make_booking", services.MakeBooking)
	api.GET("/get_pending_booking", services.GetPendingBooking)
	api.POST("/make_pending_booking", services.MakePendingBooking)
	api.DELETE("/delete_pending_bookings", services.DeletePendingBookings)
	api.DELETE("/delete_confirmed_bookings", services.DeleteConfirmedBookings)
	api.GET("/get_user_with_temp_points", services.GetUserWithTempPoints)

	// PUT for updating account

	if port := os.Getenv("PORT"); port != "" {
		r.Run(":" + port)
	} else {
		r.Run(config.LOCAL_HOST)
	}
}
