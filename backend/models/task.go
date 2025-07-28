package models

import (
	"time"

	"gorm.io/gorm"
)

type Task struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	Title       string     `gorm:"size:255;not null" json:"title"`
	Description string     `gorm:"type:text" json:"description"`
	Status      string     `gorm:"type:varchar(20);default:'To Do'" json:"status"` // To Do, In Progress, Done
	Priority    string     `gorm:"type:varchar(10);default:'Medium'" json:"priority"` // Low, Medium, High
	DueDate     *time.Time `json:"due_date,omitempty"`
	ProjectID   uint       `gorm:"not null" json:"project_id"`
	Project     Project    `gorm:"foreignKey:ProjectID;constraint:OnDelete:CASCADE;" json:"project"`
	AssigneeID  *uint      `json:"assignee_id,omitempty"`
	Assignee    *User      `gorm:"foreignKey:AssigneeID;constraint:OnDelete:SET NULL;" json:"assignee"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
