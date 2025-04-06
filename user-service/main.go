package main

import (
	"log"
	"net/http"

	"github.com/yourusername/user-service/database"
	"github.com/yourusername/user-service/graphql"
)

func main() {
	// Initialize DB
	if err := database.InitDB(); err != nil {
		log.Fatal("Database error: ", err)
	}
	defer database.DB.Close()

	// Create GraphQL schema
	schema, err := graphql.NewSchema()
	if err != nil {
		log.Fatal("Schema error: ", err)
	}

	// Start server
	http.Handle("/graphql", graphql.NewHandler(schema))
	log.Println("Server running at http://localhost:8081/graphql")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
