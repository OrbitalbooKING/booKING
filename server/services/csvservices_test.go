package services

import (
	"reflect"
	"testing"
)

func TestReadCSVFromUrl_ValidURL(t *testing.T) {
	// test valid
	testValidURL := "https://raw.githubusercontent.com/OrbitalbooKING/booKING/main/server/services/DummyCSV/accountStatuses.csv"
	data, err := ReadCSVFromUrl(testValidURL)
	want := [][]string{{"accountStatusID","statusName","statusDescription"},
	{"1","Online","Currently logged in."},
	{"2","Offline","Currently not logged in."}}
	if !reflect.DeepEqual(data, want) {
		t.Errorf("Expected:\n%v\n Got: \n%v\n", data, want)
	}
	if err != nil {
		t.Errorf("Expected no error but got: %v", err)
	}
}

func TestReadCSVFromUrl_InvalidURL(t *testing.T) {
	// test invalid URL (one that has a URL that does not work)
	testInvalidURL := "https://github.com/OrbitalbooKING/booKING/doesnotexist"
	data, err := ReadCSVFromUrl(testInvalidURL)
	wantErr := "unable to reach website with status code 404"
	if err.Error() != wantErr {
		t.Errorf("got:\n %v \n wanted: %v", err.Error(), wantErr)
	}
	if data != nil {
		t.Errorf("Expected no data but got: %v", data)
	}
}

func TestReadCSVFromUrl_NOCSV(t *testing.T) {
	// test invalid URL (one that leads to nothing like a csv file)
	testInvalidURL := "https://github.com/OrbitalbooKING/booKING"
	data, err := ReadCSVFromUrl(testInvalidURL)
	wantErr := "nothing to read at this URL"
	if err.Error() != wantErr {
		t.Errorf("got:\n %v \n wanted: %v", err.Error(), wantErr)
	}
	if data != nil {
		t.Errorf("Expected no data but got: %v", data)
	}
}

//func TestLoadAccountTypesCSV(t *testing.T) {
//	//accountType := models.Accounttypes{
//	//	ID:                     1,
//	//	Accounttypename:        "Student",
//	//	Accounttypedescription: "For students, basic rights",
//	//}
//	//
//	//db, mock, err := sqlmock.New()
//	//if err != nil {
//	//	t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
//	//}
//	//defer db.Close()
//	//
//	//sqlmock.
//	//	NewRows([]string{"id", "accounttypename", "accounttypedescription"})
//	//mock.ExpectBegin()
//	//query := "INSERT INTO accountTypes(id, accounttypename, accounttypedescription) VALUES (?, ?, ?)" +
//	//		" RETURNING id"
//	//mock.ExpectExec(query).WithArgs(accountType.ID,
//	//	accountType.Accounttypename, accountType.Accounttypedescription).WillReturnResult(accountType.ID)
//}

