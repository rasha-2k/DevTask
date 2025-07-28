package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string    `gorm:"uniqueIndex;size:100;not null" json:"username"`
	Email    string    `gorm:"uniqueIndex;size:100;not null" json:"email"`
	Password string    `gorm:"size:255;not null" json:"-"`
	Role     string    `gorm:"type:varchar(20);default:'member'" json:"role"`
	Projects []Project `gorm:"foreignKey:OwnerID;constraint:OnDelete:CASCADE;" json:"projects,omitempty"`
	Tasks    []Task    `gorm:"foreignKey:AssigneeID;constraint:OnDelete:CASCADE;" json:"tasks,omitempty"`
}
