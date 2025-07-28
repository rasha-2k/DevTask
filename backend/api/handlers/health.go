package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func SetupTestRouter() *gin.Engine {
    r := gin.Default()
    r.GET("/api/health", HealthCheck)
    return r
}

func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "DevTask's API is all good",
	})
}

func TestHealthCheck(t *testing.T) {
    router := SetupTestRouter()

    req, _ := http.NewRequest("GET", "/api/health", nil)
    w := httptest.NewRecorder()

    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusOK, w.Code)
    assert.JSONEq(t, `{"status":"ok"}`, w.Body.String())
}