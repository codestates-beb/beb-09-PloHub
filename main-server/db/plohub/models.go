// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.18.0

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

type Medium struct {
	ID     int32
	PostID int32
	Type   int16
	Url    string
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
