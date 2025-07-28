package db

import (
	"log"
	"github.com/rasha-2k/devtask/models"
)

func RunMigrations() {
	if err := DB.AutoMigrate(
		&models.User{},
		&models.Project{},
		&models.Task{},
	);
    err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}
	log.Println("Database migration completed successfully")
}
