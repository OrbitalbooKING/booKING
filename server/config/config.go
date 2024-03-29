package config

const (
	DB_HOST     = "localhost"
	DB_PORT     = 5433
	DB_USER     = "postgres"
	DB_PASSWORD = "root"
	DB_NAME     = "goauth"

	ADMIN_ID   = ""
	ADMIN_PASS = ""

	LOCAL_HOST             = "localhost:3002"
	HEROKU_HOST            = "https://orbitalbooking.herokuapp.com"
	HEROKU_HOST_RESET_PAGE = "https://bookingdevelopment.herokuapp.com/reset-password"
	APP_LOGO               = "https://orbital-booking.s3.ap-southeast-1.amazonaws.com/logo.png"

	ORBITAL_BOOKING_BUCKET_NAME   = ""
	ORBITAL_BOOKING_BUCKET_ID     = ""
	ORBITAL_BOOKING_BUCKET_KEY    = ""
	ORBITAL_BOOKING_BUCKET_REGION = "ap-southeast-1"
	PROFILE_PIC_FOLDER            = "profile_pictures/"
	DEFAULT_PICTURE_NAME          = "default.png"

	POINTS_DISCOUNT = 0.2
	MAX_POINTS      = 100.0
	WEEKLY_POINTS   = 50.0

	NUS_EMAIL_DOMAIN      = "@u.nus.edu"
	SENDER_EMAIL_ADDRESS  = ""
	SENDER_EMAIL_PASSWORD = ""

	CSV_MAIN_DIRECTORY    = "https://raw.githubusercontent.com/OrbitalbooKING/booKING/main/server"
	ACCOUNTTYPES_CSV      = CSV_MAIN_DIRECTORY + "/services/DummyCSV/accountTypes.csv"
	ACCOUNTSTATUSES_CSV   = CSV_MAIN_DIRECTORY + "/services/DummyCSV/accountStatuses.csv"
	BOOKINGSTATUSES_CSV   = CSV_MAIN_DIRECTORY + "/services/DummyCSV/bookingStatuses.csv"
	NOTIFICATIONTYPES_CSV = CSV_MAIN_DIRECTORY + "/services/DummyCSV/notificationTypes.csv"

	VENUEFACILITIES_CSV = CSV_MAIN_DIRECTORY + "/services/DummyCSV/venueFacility.csv"
	FACILITIES_CSV      = CSV_MAIN_DIRECTORY + "/services/DummyCSV/facility.csv"
	FACULTIES_CSV       = CSV_MAIN_DIRECTORY + "/services/DummyCSV/faculties.csv"
	VENUESTATUSES_CSV   = CSV_MAIN_DIRECTORY + "/services/DummyCSV/venueStatuses.csv"
	SOCVENUES_CSV       = CSV_MAIN_DIRECTORY + "/utils/socvenues.csv"
	VENUETIMINGS_CSV    = CSV_MAIN_DIRECTORY + "/services/DummyCSV/venueTimings.csv"
)
