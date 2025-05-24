package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"ewallet-backend-jwt/auth"
	"ewallet-backend-jwt/db"
	"ewallet-backend-jwt/handlers"
	"ewallet-backend-jwt/utils"

	"github.com/gorilla/mux"
)

func main() {
	db.InitRedis()
	db.InitPostgres()

	r := mux.NewRouter()

	mainLogger := log.New(os.Stdout, "[MAIN] ", log.LstdFlags)

	r.Use(auth.CorsMiddleware)

	r.Handle("/api/auth/register", http.HandlerFunc(handlers.RegisterHandler)).Methods("POST", "OPTIONS")
	r.Handle("/api/auth/login", http.HandlerFunc(handlers.LoginHandler)).Methods("POST", "OPTIONS")

	secured := r.PathPrefix("/api").Subrouter()
	secured.Use(auth.JWTMiddleware)

	secured.Handle("/me", http.HandlerFunc(handlers.MeHandler)).Methods("GET", "OPTIONS")
	secured.Handle("/transfer", http.HandlerFunc(handlers.TransferHandler)).Methods("POST", "OPTIONS")
	secured.Handle("/history", http.HandlerFunc(handlers.HistoryHandler)).Methods("GET", "OPTIONS")
	secured.Handle("/topup", http.HandlerFunc(handlers.TopupHandler)).Methods("POST", "OPTIONS")
	secured.Handle("/users", http.HandlerFunc(handlers.UserHandler)).Methods("GET", "OPTIONS")
	secured.Handle("/users/{id}", http.HandlerFunc(handlers.SingleUserHandler)).Methods("GET", "OPTIONS")

	PORT := utils.GetEnv("PORT", "8000")

    

	mainLogger.Printf("Server running on port %s...", PORT)
    if err := http.ListenAndServe(fmt.Sprintf("0.0.0.0:%s", PORT), r); err != nil {
		mainLogger.Fatal("Server failed to start: ", err)
	}
}
