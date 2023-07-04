package plohub

import (
	"database/sql"
	"time"
)

type Comment struct {
	ID          int32
	PostID      int32
	UserID      int32
	Content     string
	RewardToken int32
	CreatedAt   time.Time
}

type CommentInfo struct {
	ID          int32  `json:"id"`
	PostID      int32  `json:"post_id"`
	UserID      int32  `json:"user_id"`
	Content     string `json:"content"`
	RewardToken int32  `json:"reward_token"`
}

type Medium struct {
	ID     int32  `json:"id"`
	PostID int32  `json:"post_id"`
	Type   int16  `json:"type"`
	Url    string `json:"url"`
}

type Post struct {
	ID          int32
	UserID      int32
	Title       string
	Content     string
	Category    int16
	RewardToken int32
	Nftnized    bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type PostInfo struct {
	ID          int32  `json:"id"`
	UserID      int32  `json:"user_id"`
	Title       string `json:"title"`
	Content     string `json:"content"`
	Category    int16  `json:"category"`
	RewardToken int32  `json:"reward_token"`
	Nftnized    bool   `json:"nftnized"`
}

type User struct {
	ID              int32
	Email           string
	HashedPassword  string
	Nickname        string
	Level           int16
	Address         string
	EthAmount       int64
	TokenAmount     int64
	LatestLoginDate sql.NullTime
	DailyToken      int32
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

type UserInfo struct {
	ID          int32  `json:"id"`
	Email       string `json:"email"`
	Nickname    string `json:"nickname"`
	Level       int16  `json:"level"`
	Address     string `json:"address"`
	EthAmount   int64  `json:"eth_amount"`
	TokenAmount int64  `json:"token_amount"`
	DailyToken  int32  `json:"daily_token"`
}
