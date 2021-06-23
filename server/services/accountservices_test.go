package services

//func TestRegister(t *testing.T) {
//	var receive struct {
//		Success bool `json:"success"`
//		Message string `json:"message"`
//	}
//	toUseID := "e999"
//	// test correct input
//	testCorrectInput := models.CreateAccountInput{
//		Nusnetid: toUseID, // must be brand new un-used nusnetid
//		Password: "11",
//		Name: "TestStudent",
//		Facultyid: 1,
//		Gradyear: 2022,
//		Profilepic: "testURL",
//	}
//	toSendCorrect, err := json.Marshal(testCorrectInput)
//	if err != nil {
//		fmt.Print(err.Error())
//		return
//	}
//	responseCorrect, err := http.Post(config.HEROKU_HOST + "/api/register", "/sign-up", bytes.NewBuffer(toSendCorrect))
//	if err != nil {
//		t.Fatal(err)
//	}
//	if responseCorrect.StatusCode != 200 {
//		t.Fatalf("expected response status code 200, got %d", responseCorrect.StatusCode)
//	}
//	if err := json.NewDecoder(responseCorrect.Body).Decode(&receive); err != nil {
//		t.Fatal(err)
//	}
//	expectedSuccess := true
//	expectedMessage := "Account successfully created!"
//	if receive.Success != expectedSuccess && receive.Message != expectedMessage {
//		t.Errorf("Expected Success to be %v, got %v\n" +
//			"Expected message to be '%v' but got %s\n",
//			expectedSuccess, receive.Success, expectedMessage, receive.Message)
//	}
//
//	// test when an already existing nus id is input
//	testExistingInput := models.CreateAccountInput{
//		Nusnetid: toUseID, // must be already used nusnetid (using the one above since its created already)
//		Password: "11",
//		Name: "TestStudent",
//		Facultyid: 1,
//		Gradyear: 2022,
//		Profilepic: "testURL",
//	}
//	toSendExisting, err := json.Marshal(testExistingInput)
//	if err != nil {
//		fmt.Print(err.Error())
//		return
//	}
//	response, err := http.Post(config.HEROKU_HOST + "/api/register", "/sign-up", bytes.NewBuffer(toSendExisting))
//	if err != nil {
//		t.Fatal(err)
//	}
//	if response.StatusCode != 400 {
//		t.Fatalf("expected response status code 400, got %d", response.StatusCode)
//	}
//	if err := json.NewDecoder(response.Body).Decode(&receive); err != nil {
//		t.Fatal(err)
//	}
//	expectedSuccess = false
//	expectedMessage = "Account already exists"
//	if receive.Success != expectedSuccess && receive.Message != expectedMessage {
//		t.Errorf("Expected Success to be %v, got %v\n" +
//			"Expected message to be '%v' but got %s\n",
//			expectedSuccess, receive.Success, expectedMessage, receive.Message)
//	}
//}