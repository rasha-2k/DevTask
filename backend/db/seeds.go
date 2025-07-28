package db

import (
	"log"

	"github.com/rasha-2k/devtask/models"
)

func SeedDatabase() {
	if err := DB.AutoMigrate(
		&models.User{},
		&models.Project{},
		&models.Task{},
	); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Seed dummy admin if not exists
	var count int64
	DB.Model(&models.User{}).Count(&count)
	if count == 0 {
		admin := models.User{
			Username: "admin",
			Email:    "admin@example.com",
			Password: "hashed-password", 
			Role:     "admin",
		}
		DB.Create(&admin)

		project := models.Project{
			Title:       "Initial Project",
			Description: "This is a seeded project",
			OwnerID:     admin.ID,
		}
		DB.Create(&project)

		DB.Create(&models.Task{
			Title:     "Seeded Task 1",
			Status:    "To Do",
			Priority:  "High",
			ProjectID: project.ID,
			AssigneeID: &admin.ID,
			DueDate:   nil,
		})

		DB.Create(&models.Task{
			Title:     "Seeded Task 2",
			Status:    "In Progress",
			Priority:  "Medium",
			ProjectID: project.ID,
			AssigneeID: &admin.ID,
			DueDate:   nil,
		})
	}

	log.Println("Database migration & seeding completed successfully")
}
