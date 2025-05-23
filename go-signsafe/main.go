package main

import (
	"log"
	"net/http"
	"os"

	"ewallet-backend/auth"
	"ewallet-backend/db"
	"ewallet-backend/handlers"

	"github.com/gorilla/mux"
)

func main() {
	db.InitRedis()
	db.InitPostgres()

	r := mux.NewRouter()

	mainLogger := log.New(os.Stdout, "[MAIN] ", log.LstdFlags)

	r.Use(auth.CorsMiddleware)

	r.Handle("/api/auth/register", http.HandlerFunc(handlers.RegisterHandler)).Methods("POST", "OPTIONS")

	r.Handle("/api/transfer", auth.SignSafeMiddleware(http.HandlerFunc(handlers.TransferHandler))).Methods("POST", "OPTIONS")

	r.Handle("/api/history", auth.SignSafeMiddleware(http.HandlerFunc(handlers.HistoryHandler))).Methods("GET", "OPTIONS")

	r.Handle("/api/topup", auth.SignSafeMiddleware(http.HandlerFunc(handlers.TopupHandler))).Methods("POST", "OPTIONS")

	r.Handle("/api/users", auth.SignSafeMiddleware(http.HandlerFunc(handlers.UserHandler))).Methods("GET", "OPTIONS")

	r.Handle("/api/users/{id}", auth.SignSafeMiddleware(http.HandlerFunc(handlers.SingleUserHandler))).Methods("GET", "OPTIONS")

	mainLogger.Println("Router configuration complete.")
	mainLogger.Println("Routes configured:")
	r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		pathTemplate, _ := route.GetPathTemplate()
		methods, _ := route.GetMethods()
		mainLogger.Printf("ROUTE: %s Methods: %v", pathTemplate, methods)
		return nil
	})

	mainLogger.Println("Server running on port 8000...")
	if err := http.ListenAndServe(":8000", r); err != nil {
		mainLogger.Fatal("Server failed to start: ", err)
	}
}
