package middleware

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtKey []byte

func init() {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Fatal("JWT_SECRET not set")
	}
	jwtKey = []byte(secret)
}

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		log.Println("Authorization Header:", authHeader)

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		log.Println("Token String:", tokenString)

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			log.Println("Token parse error or invalid:", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			log.Println("Failed to parse claims")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		// Extract user info from claims
		userIDFloat, ok := claims["user_id"].(float64)
		if !ok {
			log.Println("user_id claim missing or invalid")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token user_id"})
			c.Abort()
			return
		}

		role, ok := claims["role"].(string)
		if !ok {
			log.Println("role claim missing or invalid")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token role"})
			c.Abort()
			return
		}

		c.Set("userID", uint(userIDFloat))
		c.Set("role", role)

		c.Next()
	}
}
