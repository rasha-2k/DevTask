package models

import (
	"time"

	"gorm.io/gorm"
)

type Project struct {
    gorm.Model
    Title       string `gorm:"not null"`
    Description string `gorm:"type:text"`
    Deadline    *time.Time
    Archived    bool `gorm:"default:false"`
    OwnerID     uint `gorm:"not null"`
    Owner       User `gorm:"foreignKey:OwnerID;constraint:OnDelete:CASCADE;"`
    Tasks       []Task `gorm:"constraint:OnDelete:CASCADE;" json:"tasks,omitempty"`
}

