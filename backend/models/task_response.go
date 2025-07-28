package models

import "time"

type TaskResponse struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	Priority    string    `json:"priority"`
	DueDate     *time.Time `json:"due_date,omitempty"`
	ProjectID   uint      `json:"project_id"`
	Project     string    `json:"project"`
	AssigneeID  *uint     `json:"assignee_id,omitempty"`
	Assignee    string    `json:"assignee,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
