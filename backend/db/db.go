package db

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() *gorm.DB {
	if DB != nil {
		return DB
	}

	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")
	sslmode := getenvDefault("DB_SSLMODE", "disable")
	tz := getenvDefault("DB_TIMEZONE", "UTC")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		host, user, pass, name, port, sslmode, tz,
	)

	var db *gorm.DB
	var err error

	maxAttempts := 10
	for i := 1; i <= maxAttempts; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			log.Println("Connected to Postgres")
			DB = db
			return DB
		}
		wait := time.Duration(i*2) * time.Second
		log.Printf("DB not ready yet (attempt %d/%d): %v. Retrying in %s...\n", i, maxAttempts, err, wait)
		time.Sleep(wait)
	}

	log.Fatalf("Failed to connect to database after %d attempts: %v", maxAttempts, err)
	return nil

}

func getenvDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
