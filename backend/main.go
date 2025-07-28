package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	routes "github.com/rasha-2k/devtask/api"
	"github.com/rasha-2k/devtask/db"
)

func main() {
	err := godotenv.Load("../.env")
	if err != nil {
		err = godotenv.Load(".env")
		if err != nil {
			log.Println("Warning: No .env file found. Proceeding with system environment variables.")
		}
	}

	db.DB = db.InitDB()

	// CLI arg: migrate
	if len(os.Args) > 1 && os.Args[1] == "migrate" {
		db.RunMigrations()
		db.SeedDatabase()
		log.Println("Migration and seeding completed")
		return
	}

	router := routes.SetupRouter()
	log.Println("Starting DevTasks server on :8080")
	err = router.Run(":8080")
	if err != nil {
		log.Fatal("Failed to run server:", err)
	}
}
