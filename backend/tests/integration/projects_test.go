package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rasha-2k/devtask/api/handlers"
	"github.com/rasha-2k/devtask/db"
	"github.com/rasha-2k/devtask/models"
)

func init() {
	err := godotenv.Load("../../../.env")
	if err != nil {
		log.Fatalf("Failed to load .env file: %v", err)
	}
}

func setupRouter() *gin.Engine {
	r := gin.Default()
	var testUser models.User // Declare testUser here
	r.Use(func(c *gin.Context) {
		c.Set("userID", testUser.ID)
		c.Next()
	})
	r.POST("/projects", handlers.CreateProject)

	r.GET("/projects/:id", handlers.GetProjectByID)
	r.PUT("/projects/:id", handlers.UpdateProject)
	r.DELETE("/projects/:id", handlers.DeleteProject)
	return r
}

func setupRouterWithUserID(userID uint) *gin.Engine {
	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Set("userID", userID)
		c.Next()
	})
	r.POST("/projects", handlers.CreateProject)
	return r
}

func TestCreateProject(t *testing.T) {
	db.InitDB()

	// Create user first
	db := db.DB
	testUser := models.User{
		Username: "projectuser3",
		Password: "hashedpassword",
		Role:     "member",
	}
	db.Create(&testUser)

	router := setupRouterWithUserID(testUser.ID)

	payload := map[string]interface{}{
		"title":       "Test Project",
		"description": "Just a test",
		"deadline":    time.Now().AddDate(0, 0, 7).Format(time.RFC3339),
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("POST", "/projects", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("Expected 201 Created but got %d: %s", rec.Code, rec.Body.String())
	}
}

func TestCreateProject_MissingTitle(t *testing.T) {

	payload := map[string]interface{}{
		"description": "No title here",
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("POST", "/projects", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	rec := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(rec)
	c.Request = req
	c.Set("userID", uint(1))

	handlers.CreateProject(c)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("Expected 400 BadRequest but got %d", rec.Code)
	}
}
