package models

import "time"

type PostInfo struct {
	ID           int32     `json:"id"`
	UserID       int32     `json:"user_id"`
	Title        string    `json:"title"`
	Content      string    `json:"content"`
	Category     int16     `json:"category"`
	RewardAmount int32     `json:"reward_amount"`
	Nftnized     bool      `json:"nftnized"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type CommentInfo struct {
	ID           int32     `json:"id"`
	PostID       int32     `json:"post_id"`
	UserID       int32     `json:"user_id"`
	Content      string    `json:"content"`
	RewardAmount int32     `json:"reward_amount"`
	CreatedAt    time.Time `json:"created_at"`
}

type MediumInfo struct {
	ID     int32  `json:"id"`
	PostID int32  `json:"post_id"`
	Type   int16  `json:"type"`
	Url    string `json:"url"`
}
