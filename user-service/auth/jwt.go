package auth

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const (
	secretKey = "your-secret-key"
)

type claims struct {
	UserID string `json:"userId"`
	jwt.RegisteredClaims
}

func GenerateToken(userID int) (string, error) {
	claims := &claims{
		UserID: strconv.Itoa(userID), // Convert int to string
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secretKey))
}

func ExtractUserID(ctx context.Context) (int, error) {
	if token, ok := ctx.Value("token").(*jwt.Token); ok {
		if claims, ok := token.Claims.(*claims); ok {
			return strconv.Atoi(claims.UserID) // Convert back to int
		}
	}
	return 0, errors.New("invalid token")
}
