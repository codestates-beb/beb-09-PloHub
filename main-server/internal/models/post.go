package models

import (
	"main-server/db/plohub"
	"time"
)

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

func ToPostInfo(post plohub.Post) *PostInfo {
	postInfo := &PostInfo{}
	postInfo.ID = post.ID
	postInfo.UserID = post.UserID
	postInfo.Title = post.Title
	postInfo.Content = post.Content
	postInfo.Category = post.Category
	postInfo.RewardAmount = post.RewardAmount
	postInfo.Nftnized = post.Nftnized
	postInfo.CreatedAt = post.CreatedAt
	postInfo.UpdatedAt = post.UpdatedAt
	return postInfo
}

func ToPostInfos(posts []plohub.Post) []PostInfo {
	postInfos := make([]PostInfo, len(posts))
	for i, post := range posts {
		postInfos[i] = *ToPostInfo(post)
	}
	return postInfos
}
