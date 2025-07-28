package tests

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rasha-2k/devtask/api/handlers"
	"github.com/rasha-2k/devtask/db"
)

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)

	err := godotenv.Load("../../../.env")
	if err != nil {
		log.Fatalf("Failed to load .env file: %v", err)
	}

	// Init DB for tests
	db.InitDB()

	// Run tests
	code := m.Run()

	os.Exit(code)
}

func performRequest(r http.Handler, method, path string, body []byte) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestRegisterAndLogin(t *testing.T) {
	router := gin.Default()

	// Setup routes
	router.POST("/register", handlers.Register)
	router.POST("/login", handlers.Login)

	// Test register
	registerPayload := map[string]string{
		"username": "testuser",
		"password": "testpassword123",
	}
	body, _ := json.Marshal(registerPayload)

	resp := performRequest(router, "POST", "/register", body)
	if resp.Code != http.StatusCreated {
		t.Fatalf("Expected status %d, got %d, body: %s", http.StatusCreated, resp.Code, resp.Body.String())
	}

	// Test login
	resp = performRequest(router, "POST", "/login", body)
	if resp.Code != http.StatusOK {
		t.Fatalf("Expected status %d, got %d, body: %s", http.StatusOK, resp.Code, resp.Body.String())
	}

	var respJSON map[string]interface{}
	json.Unmarshal(resp.Body.Bytes(), &respJSON)

	token, exists := respJSON["token"]
	if !exists || token == "" {
		t.Fatalf("Expected token in response, got: %v", respJSON)
	}
}
