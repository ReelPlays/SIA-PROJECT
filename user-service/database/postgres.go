package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var DB *sql.DB

func InitDB() error {
	// First connect to default postgres database
	initialConnStr := "user=postgres dbname=postgres password=Loser123321 port=5433 sslmode=disable"
	initialDb, err := sql.Open("postgres", initialConnStr)
	if err != nil {
		return err
	}
	defer initialDb.Close()

	// Create database if not exists
	// Proper existence check
	var exists bool
	err = initialDb.QueryRow("SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1)", "social_media").Scan(&exists)
	if err != nil {
		return fmt.Errorf("failed to check database existence: %v", err)
	}
	if !exists {
		_, err = initialDb.Exec("CREATE DATABASE social_media")
		if err != nil {
			return fmt.Errorf("failed to create database: %v", err)
		}
	}

	// Connect to our target database
	connStr := "user=postgres dbname=social_media password=Loser123321 port=5433 sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return err
	}

	if err = db.Ping(); err != nil {
		return err
	}

	DB = db
	log.Println("Connected to PostgreSQL database")

	// Create tables
	_, err = DB.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			username TEXT UNIQUE NOT NULL,
			email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT NOW()
		)
	`)
	if err != nil {
		return err
	}

	// Create default user if not exists
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("defaultpass123"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = DB.Exec(`
		INSERT INTO users (username, email, password)
		VALUES ($1, $2, $3)
		ON CONFLICT (email) DO NOTHING
	`, "default_user", "default@example.com", hashedPassword)

	return err
}
