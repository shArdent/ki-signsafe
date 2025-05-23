package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"ewallet-backend-jwt/auth"
	"ewallet-backend-jwt/db"
	"ewallet-backend-jwt/model"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds model.LoginJWT
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	db := db.DB

	if creds.Username == "" || creds.Password == "" {
		http.Error(w, "Missing user ID", http.StatusBadRequest)
		return
	}

	var userData struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}

	err := db.QueryRow(`SELECT id, name FROM users WHERE name = $1`, creds.Username).Scan(&userData.Id, &userData.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	log.Printf("%+v", userData)

	token, err := auth.GenerateJWT(userData.Id)
	if err != nil {
		http.Error(w, "Could not generate token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})
}
