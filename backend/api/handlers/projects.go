package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/rasha-2k/devtask/db"
	"github.com/rasha-2k/devtask/models"
)

// CreateProject - POST /api/projects
func CreateProject(c *gin.Context) {
	var input models.Project
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get owner from JWT claims
	ownerID := c.GetUint("userID")
	input.OwnerID = ownerID

	if err := db.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.DB.Preload("Owner").First(&input, input.ID)
	c.JSON(http.StatusCreated, toProjectResponse(input))
}

// GetAllProjects - GET /api/projects
func GetProject(c *gin.Context) {
	id := c.Param("id")
	var project models.Project
	if err := db.DB.Preload("Owner").First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	c.JSON(http.StatusOK, toProjectResponse(project))
}

func ListProjects(c *gin.Context) {
	var projects []models.Project
	if err := db.DB.Preload("Owner").Find(&projects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []models.ProjectResponse
	for _, p := range projects {
		response = append(response, toProjectResponse(p))
	}

	c.JSON(http.StatusOK, response)
}

// GetProjectByID - GET /api/projects/:id
func GetProjectByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	var project models.Project
	if err := db.DB.Preload("Tasks").Preload("Owner").First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	c.JSON(http.StatusOK, project)
}

// UpdateProject - PUT /api/projects/:id
func UpdateProject(c *gin.Context) {
	id := c.Param("id")
	var project models.Project
	if err := db.DB.First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	var input models.Project
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project.Title = input.Title
	project.Description = input.Description
	project.Deadline = input.Deadline
	project.Archived = input.Archived

	if err := db.DB.Save(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.DB.Preload("Owner").First(&project, project.ID)
	c.JSON(http.StatusOK, toProjectResponse(project))
}

// DeleteProject - DELETE /api/projects/:id
func DeleteProject(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.Project{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}

// ArchiveProject - POST /api/projects/:id/archive
func ArchiveProject(c *gin.Context) {
	id := c.Param("id")
	var project models.Project
	if err := db.DB.First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	project.Archived = true
	if err := db.DB.Save(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.DB.Preload("Owner").First(&project, project.ID)
	c.JSON(http.StatusOK, toProjectResponse(project))
}

func toProjectResponse(project models.Project) models.ProjectResponse {
	return models.ProjectResponse{
		ID:          project.ID,
		Title:       project.Title,
		Description: project.Description,
		Deadline:    project.Deadline,
		Archived:    project.Archived,
		OwnerID:     project.OwnerID,
		Owner:       project.Owner.Username,
		CreatedAt:   project.CreatedAt,
		UpdatedAt:   project.UpdatedAt,
	}
}
