package services

import (
	"errors"
	"fmt"

	"github.com/rasha-2k/devtask/db"
	"github.com/rasha-2k/devtask/models"
	"github.com/rasha-2k/devtask/utils"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(username, email, password, role string) error {
	var existing models.User

	if err := db.DB.Where("LOWER(username) = LOWER(?)", username).First(&existing).Error; err == nil {
		return errors.New("username already exists")
	}

	if err := db.DB.Where("LOWER(email) = LOWER(?)", email).First(&existing).Error; err == nil {
		return errors.New("email already registered")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("could not hash password")
	}

	user := models.User{
		Username: username,
		Email:    email,
		Password: string(hashed),
		Role:     role,
	}

	return db.DB.Create(&user).Error
}

func LoginUser(email, password string) (string, error) {
	var user models.User
	if err := db.DB.Where("LOWER(email) = LOWER(?)", email).First(&user).Error; err != nil {
		return "", errors.New("invalid email or password")
	}

	if !utils.VerifyPassword(password, user.Password) {
		return "", errors.New("invalid email or password")
	}

	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		return "", errors.New("failed to generate token")
	}

	return token, nil
}

func GetUserByEmailAndPassword(email, password string) (*models.User, error) {
	var user models.User
	err := db.DB.Where("LOWER(email) = LOWER(?)", email).First(&user).Error
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	fmt.Println("User found:", user.Email)

	if !utils.VerifyPassword(password, user.Password) {
		fmt.Println("Password verification failed")
		return nil, errors.New("invalid email or password")
	}

	return &user, nil
}
