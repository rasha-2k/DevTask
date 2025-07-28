package services

import (
	"github.com/rasha-2k/devtask/db"
	"github.com/rasha-2k/devtask/models"
)

func CreateTask(input models.Task) (*models.Task, error) {
	if err := db.DB.Create(&input).Error; err != nil {
		return nil, err
	}
	return &input, nil
}

func GetTask(id uint) (*models.Task, error) {
	var task models.Task
	if err := db.DB.First(&task, id).Error; err != nil {
		return nil, err
	}
	return &task, nil
}

func UpdateTask(id uint, input models.Task) (*models.Task, error) {
	var task models.Task
	if err := db.DB.First(&task, id).Error; err != nil {
		return nil, err
	}
	if err := db.DB.Model(&task).Updates(input).Error; err != nil {
		return nil, err
	}
	return &task, nil
}

func DeleteTask(id uint) error {
	return db.DB.Delete(&models.Task{}, id).Error
}

func ListTasks() ([]models.Task, error) {
	var tasks []models.Task
	if err := db.DB.Find(&tasks).Error; err != nil {
		return nil, err
	}
	return tasks, nil
}
