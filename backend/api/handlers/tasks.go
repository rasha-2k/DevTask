package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rasha-2k/devtask/db"
	"github.com/rasha-2k/devtask/models"
)

// CreateTask - POST /api/tasks
func CreateTask(c *gin.Context) {
	var input models.Task
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if project exists
	var project models.Project
	if err := db.DB.First(&project, input.ProjectID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project not found"})
		return
	}

	if err := db.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Preload
	db.DB.Preload("Project").Preload("Assignee").First(&input, input.ID)
	c.JSON(http.StatusCreated, toTaskResponse(input))
}

// ListTasks - GET /api/tasks
func ListTasks(c *gin.Context) {
	var tasks []models.Task
	if err := db.DB.Preload("Project").Preload("Assignee").Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []models.TaskResponse
	for _, t := range tasks {
		response = append(response, toTaskResponse(t))
	}

	c.JSON(http.StatusOK, response)
}

// GetTask - GET /api/tasks/:id
func GetTask(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	if err := db.DB.Preload("Project").Preload("Assignee").First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, toTaskResponse(task))
}

// UpdateTask - PUT /api/tasks/:id
func UpdateTask(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	if err := db.DB.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	var input models.Task
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task.Title = input.Title
	task.Description = input.Description
	task.Status = input.Status
	task.Priority = input.Priority
	task.DueDate = input.DueDate
	task.ProjectID = input.ProjectID
	task.AssigneeID = input.AssigneeID

	if err := db.DB.Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.DB.Preload("Project").Preload("Assignee").First(&task, task.ID)
	c.JSON(http.StatusOK, toTaskResponse(task))
}

// DeleteTask - DELETE /api/tasks/:id
func DeleteTask(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.Task{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

// defaultIfEmpty returns fallback if value is empty
func defaultIfEmpty(value, fallback string) string {
	if value == "" {
		return fallback
	}
	return value
}

func toTaskResponse(task models.Task) models.TaskResponse {
	var assigneeName string
	if task.Assignee != nil {
		assigneeName = task.Assignee.Username
	}

	return models.TaskResponse{
		ID:          task.ID,
		Title:       task.Title,
		Description: task.Description,
		Status:      task.Status,
		Priority:    task.Priority,
		DueDate:     task.DueDate,
		ProjectID:   task.ProjectID,
		Project:     task.Project.Title,
		AssigneeID:  task.AssigneeID,
		Assignee:    assigneeName,
		CreatedAt:   task.CreatedAt,
		UpdatedAt:   task.UpdatedAt,
	}
}
