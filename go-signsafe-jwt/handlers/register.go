package handlers

import (
	"encoding/json"
	"net/http"

	"ewallet-backend-jwt/auth"
)

type RegisterRequest struct {
	UserID   string `json:"user_id"`
	Password string `json:"password"`
	// Tambahkan field lain seperti email jika diperlukan
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if req.UserID == "" || req.Password == "" {
		http.Error(w, "UserID and password are required", http.StatusBadRequest)
		return
	}

	// 👉 Simulasi menyimpan user ke database
	// Di sini Anda bisa tambahkan pengecekan userID sudah terdaftar atau belum

	// ✔️ Registrasi sukses → langsung login (return JWT)
	token, err := auth.GenerateJWT(req.UserID)
	if err != nil {
		http.Error(w, "Could not generate token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})
}

