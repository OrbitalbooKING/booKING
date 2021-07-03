package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"server/controllers"

	"server/services"
	
	"path"
        "strings"
	"os"
)

const FSPATH = "./build/"

func main() {
	r := gin.Default()
// 	http.Handle("/", http.FileServer(http.Dir("./build")))
	
	fs := http.FileServer(http.Dir(FSPATH))

	    http.HandleFunc("/api", func(w http.ResponseWriter, _ *http.Request) { w.Write([]byte("API CALL")) })
	    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// If the requested file exists then return if; otherwise return index.html (fileserver default page)
		if r.URL.Path != "/" {
		    fullPath := FSPATH + strings.TrimPrefix(path.Clean(r.URL.Path), "/")
		    _, err := os.Stat(fullPath)
		    if err != nil {
			if !os.IsNotExist(err) {
			    panic(err)
			}
			// Requested file does not exist so we return the default (resolves to index.html)
			r.URL.Path = "/"
		    }
		}
		fs.ServeHTTP(w, r)
	    })
// 	    http.ListenAndServe(":8090", nil)
	
	if err := services.ConnectDataBase(); err != nil {
		fmt.Println("Database not connected successfully. " + err.Error())
		panic(err)
	} else {
		fmt.Println("Database connected successfully.")
	}
	services.LoadAllCSV()
	controllers.StartAll(r)
}
