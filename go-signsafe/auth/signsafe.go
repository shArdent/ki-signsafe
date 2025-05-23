package auth

import (
	"crypto"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"log"
	"time"
)

func VerifySignature(message string, signatureBase64 string, pubKey *rsa.PublicKey) error {
	hashed := sha256.Sum256([]byte(message))
	signature, err := base64.StdEncoding.DecodeString(signatureBase64)
	if err != nil {
		return err
	}

	err = rsa.VerifyPKCS1v15(pubKey, crypto.SHA256, hashed[:], signature)
	if err != nil {
		return errors.New("invalid iignature")
	}

	return nil
}

func ValidateTimestamp(ts string) error {
	log.Println(ts)
	clientTime, err := time.Parse(time.RFC3339, ts)
	if err != nil {
		return errors.New(("invalid timestamp format"))
	}

	diff := time.Since(clientTime)
	log.Printf("diff: %s", diff)
	if diff > 5*time.Minute || diff < -5*time.Minute {
		return errors.New("timestamp expired or invalid")
	}

	return nil
}
