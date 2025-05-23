package model

import "time"

type UserData struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Balance   float64   `json:"balance"`
	PublicKey string    `json:"public_key"`
	CreatedAt time.Time `json:"created_at"`
}
