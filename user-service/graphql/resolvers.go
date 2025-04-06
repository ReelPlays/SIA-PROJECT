package graphql

import (
	"errors"

	"github.com/graphql-go/graphql"
	"github.com/yourusername/user-service/auth"
	"github.com/yourusername/user-service/database"
	"golang.org/x/crypto/bcrypt"
)

func RegisterResolver(p graphql.ResolveParams) (interface{}, error) {
	// 1. Extract input
	input, ok := p.Args["input"].(map[string]interface{})
	if !ok {
		return nil, errors.New("invalid input")
	}

	// 2. Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(input["password"].(string)),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return nil, err
	}

	// 3. Create user in database
	var userID int
	err = database.DB.QueryRow(
		`INSERT INTO users (username, email, password) 
		 VALUES ($1, $2, $3) RETURNING id`,
		input["username"].(string),
		input["email"].(string),
		hashedPassword,
	).Scan(&userID)
	if err != nil {
		return nil, err
	}

	// 4. Generate JWT token
	token, err := auth.GenerateToken(userID)
	if err != nil {
		return nil, err
	}

	// 5. Return AuthPayload
	return map[string]interface{}{
		"token": token,
		"user": map[string]interface{}{
			"id":       userID,
			"username": input["username"].(string),
			"email":    input["email"].(string),
		},
	}, nil
}

func LoginResolver(p graphql.ResolveParams) (interface{}, error) {
	// 1. Extract input
	input, ok := p.Args["input"].(map[string]interface{})
	if !ok {
		return nil, errors.New("invalid input")
	}

	// 2. Find user in database
	var user struct {
		ID       int
		Username string
		Email    string
		Password string
	}
	err := database.DB.QueryRow(
		`SELECT id, username, email, password FROM users 
		 WHERE email = $1`,
		input["email"].(string),
	).Scan(&user.ID, &user.Username, &user.Email, &user.Password)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// 3. Verify password
	err = bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(input["password"].(string)),
	)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	// 4. Generate JWT token
	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	// 5. Return AuthPayload
	return map[string]interface{}{
		"token": token,
		"user": map[string]interface{}{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	}, nil
}
