package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func ListUsers(c *gin.Context) {
    // TODO: Implement fetching users from DB
    c.JSON(http.StatusOK, gin.H{"message": "List of users (admin only)"})
}
