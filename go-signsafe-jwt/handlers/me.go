package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"ewallet-backend-jwt/db"
	"ewallet-backend-jwt/model"
	"ewallet-backend-jwt/utils"
)

func MeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	db := db.DB

	userID, ok := r.Context().Value(utils.UserIDKey).(string)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusInternalServerError)
		return
	}

	var user model.UserData
	err := db.QueryRow(`
		SELECT id, name, balance, public_key, created_at
		FROM users
		WHERE id = $1
	`, userID).Scan(&user.ID, &user.Name, &user.Balance, &user.PublicKey, &user.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching user", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
