package models

type PendingApprovalInfo struct {
	Name      string
	NUSNET_ID string
	Bookings  []BookingRequests
}

type ResetInfo struct {
	Name      string
	NUSNET_ID string
	TempPass  string
}

type StaffCreationInfo struct {
	Name      string
	NUSNET_ID string
	TempPass  string
}

type RejectInfo struct {
	Name      string
	NUSNET_ID string
	BookingID string
	Booking   BookingRequests
	Reason    string
}

type ApproveInfo struct {
	Name      string
	NUSNET_ID string
	BookingID string
	Booking   BookingRequests
}

type AccountCreationInfo struct {
	Name      string
	NUSNET_ID string
}
