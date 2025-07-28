package services

import (
	"errors"
	"time"

	"github.com/rasha-2k/devtask/db"
	"github.com/rasha-2k/devtask/models"
	"github.com/rasha-2k/devtask/constants"
)
func ListProjects() ([]models.Project, error) {
	var projects []models.Project
	if err := db.DB.Find(&projects).Error; err != nil {
		return nil, err
	}
	return projects, nil
}

func GetProject(id uint) (*models.Project, error) {
	var project models.Project
	if err := db.DB.First(&project, id).Error; err != nil {
		return nil, err
	}
	return &project, nil
}

func UpdateProject(id uint, updated *models.Project) (*models.Project, error) {
	var project models.Project
	if err := db.DB.First(&project, id).Error; err != nil {
		return nil, err
	}

	project.Title = updated.Title
	project.Description = updated.Description
	project.Deadline = updated.Deadline

	if err := db.DB.Save(&project).Error; err != nil {
		return nil, err
	}
	return &project, nil
}

func DeleteProject(id uint) error {
	return db.DB.Delete(&models.Project{}, id).Error
}

func CreateProject(title, description string, deadline *time.Time, ownerID uint) (*models.Project, error) {
	if title == "" {
		return nil, errors.New("title is required")
	}

	project := &models.Project{
		Title:       title,
		Description: description,
		Deadline:    deadline,
		OwnerID:     ownerID,
	}

	db := db.DB
	if err := db.Create(project).Error; err != nil {
		return nil, err
	}

	return project, nil
}
func ArchiveProject(projectID, userID uint, userRole string) error {
    var project models.Project
    database := db.DB

    if err := database.First(&project, projectID).Error; err != nil {
        return errors.New("project not found")
    }

    if userRole != constants.RoleAdmin && project.OwnerID != userID {
        return errors.New("you do not have permission to archive this project")
    }

    project.Archived = true
    return database.Save(&project).Error
}