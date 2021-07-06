package controllers

import (
	"os"
	"server/config"
	"server/middleware"
	"server/services"

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
	api.PATCH("/reset", services.ResetPassword)
	api.GET("/home", services.GetVenues)
	api.GET("/search", services.SearchVenues)

	api.GET("/get_profile", services.GetProfile)
	api.GET("/get_bookings", services.GetBookings)

	api.GET("/get_booking_requests", services.GetBookingRequests)
	api.PUT("/approve_bookings", services.ApproveBookings)

	api.GET("/timings", services.GetTimings)
	api.PUT("/make_booking", services.MakeBooking)
	api.GET("/get_pending_booking", services.GetPendingBooking)
	api.POST("/make_pending_booking", services.MakePendingBooking)
	api.DELETE("/delete_bookings", services.DeleteBookings)

	// PUT for updating account

	if port := os.Getenv("PORT"); port != "" {
		r.Run(":" + port)
	} else {
		r.Run(config.LOCAL_HOST)
	}
}
