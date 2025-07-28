package middleware

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
)

// AuthorizeRoles returns middleware that allows only users with specified roles.
func AuthorizeRoles(allowedRoles ...string) gin.HandlerFunc {
    return func(c *gin.Context) {
        roleVal, exists := c.Get("role")
        if !exists {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Role not found in context"})
            c.Abort()
            return
        }

        userRole, ok := roleVal.(string)
        if !ok {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid role value"})
            c.Abort()
            return
        }

        for _, allowed := range allowedRoles {
            if strings.EqualFold(userRole, allowed) {
                c.Next()
                return
            }
        }

        // Role not allowed
        c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to access this resource"})
        c.Abort()
    }
}
