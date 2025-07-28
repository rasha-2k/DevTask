package models

import "time"

type ProjectResponse struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Deadline    *time.Time `json:"deadline,omitempty"`
	Archived    bool      `json:"archived"`
	OwnerID     uint      `json:"owner_id"`
	Owner       string    `json:"owner"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
