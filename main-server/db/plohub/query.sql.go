// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.19.0
// source: query.sql

package plohub

import (
	"context"
	"database/sql"
)

const createComment = `-- name: CreateComment :exec
INSERT INTO comments (post_id, user_id, content, reward_amount) VALUES ($1, $2, $3, $4)
`

type CreateCommentParams struct {
	PostID       int32
	UserID       int32
	Content      string
	RewardAmount int32
}

func (q *Queries) CreateComment(ctx context.Context, arg CreateCommentParams) error {
	_, err := q.db.ExecContext(ctx, createComment,
		arg.PostID,
		arg.UserID,
		arg.Content,
		arg.RewardAmount,
	)
	return err
}

const createMedia = `-- name: CreateMedia :exec
INSERT INTO media (post_id, type, url) VALUES ($1, $2, $3)
`

type CreateMediaParams struct {
	PostID int32
	Type   int16
	Url    string
}

func (q *Queries) CreateMedia(ctx context.Context, arg CreateMediaParams) error {
	_, err := q.db.ExecContext(ctx, createMedia, arg.PostID, arg.Type, arg.Url)
	return err
}

const createPost = `-- name: CreatePost :one
INSERT INTO posts (user_id, title, content, category, reward_amount) VALUES ($1, $2, $3, $4, $5) RETURNING id
`

type CreatePostParams struct {
	UserID       int32
	Title        string
	Content      string
	Category     int16
	RewardAmount int32
}

func (q *Queries) CreatePost(ctx context.Context, arg CreatePostParams) (int32, error) {
	row := q.db.QueryRowContext(ctx, createPost,
		arg.UserID,
		arg.Title,
		arg.Content,
		arg.Category,
		arg.RewardAmount,
	)
	var id int32
	err := row.Scan(&id)
	return id, err
}

const createUser = `-- name: CreateUser :one
INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING id
`

type CreateUserParams struct {
	Email          string
	HashedPassword string
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (int32, error) {
	row := q.db.QueryRowContext(ctx, createUser, arg.Email, arg.HashedPassword)
	var id int32
	err := row.Scan(&id)
	return id, err
}

const deleteComment = `-- name: DeleteComment :exec
DELETE FROM comments WHERE id = $1
`

func (q *Queries) DeleteComment(ctx context.Context, id int32) error {
	_, err := q.db.ExecContext(ctx, deleteComment, id)
	return err
}

const deleteCommentsByPostID = `-- name: DeleteCommentsByPostID :exec
DELETE FROM comments WHERE post_id = $1
`

func (q *Queries) DeleteCommentsByPostID(ctx context.Context, postID int32) error {
	_, err := q.db.ExecContext(ctx, deleteCommentsByPostID, postID)
	return err
}

const deleteMedia = `-- name: DeleteMedia :exec
DELETE FROM media WHERE id = $1
`

func (q *Queries) DeleteMedia(ctx context.Context, id int32) error {
	_, err := q.db.ExecContext(ctx, deleteMedia, id)
	return err
}

const deleteMediaByPostID = `-- name: DeleteMediaByPostID :exec
DELETE FROM media WHERE post_id = $1
`

func (q *Queries) DeleteMediaByPostID(ctx context.Context, postID int32) error {
	_, err := q.db.ExecContext(ctx, deleteMediaByPostID, postID)
	return err
}

const deletePost = `-- name: DeletePost :exec
DELETE FROM posts WHERE id = $1
`

func (q *Queries) DeletePost(ctx context.Context, id int32) error {
	_, err := q.db.ExecContext(ctx, deletePost, id)
	return err
}

const deleteUser = `-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1
`

func (q *Queries) DeleteUser(ctx context.Context, id int32) error {
	_, err := q.db.ExecContext(ctx, deleteUser, id)
	return err
}

const emailExists = `-- name: EmailExists :one
SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)
`

func (q *Queries) EmailExists(ctx context.Context, email string) (bool, error) {
	row := q.db.QueryRowContext(ctx, emailExists, email)
	var exists bool
	err := row.Scan(&exists)
	return exists, err
}

const getCommentByID = `-- name: GetCommentByID :one
SELECT id, post_id, user_id, content, reward_amount, created_at FROM comments WHERE id = $1
`

func (q *Queries) GetCommentByID(ctx context.Context, id int32) (Comment, error) {
	row := q.db.QueryRowContext(ctx, getCommentByID, id)
	var i Comment
	err := row.Scan(
		&i.ID,
		&i.PostID,
		&i.UserID,
		&i.Content,
		&i.RewardAmount,
		&i.CreatedAt,
	)
	return i, err
}

const getCommentsByPostID = `-- name: GetCommentsByPostID :many
SELECT id, post_id, user_id, content, reward_amount, created_at FROM comments WHERE post_id = $1
`

func (q *Queries) GetCommentsByPostID(ctx context.Context, postID int32) ([]Comment, error) {
	rows, err := q.db.QueryContext(ctx, getCommentsByPostID, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Comment
	for rows.Next() {
		var i Comment
		if err := rows.Scan(
			&i.ID,
			&i.PostID,
			&i.UserID,
			&i.Content,
			&i.RewardAmount,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getCommentsByUserID = `-- name: GetCommentsByUserID :many
SELECT id, post_id, user_id, content, reward_amount, created_at FROM comments WHERE user_id = $1
`

func (q *Queries) GetCommentsByUserID(ctx context.Context, userID int32) ([]Comment, error) {
	rows, err := q.db.QueryContext(ctx, getCommentsByUserID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Comment
	for rows.Next() {
		var i Comment
		if err := rows.Scan(
			&i.ID,
			&i.PostID,
			&i.UserID,
			&i.Content,
			&i.RewardAmount,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getMediaByPostID = `-- name: GetMediaByPostID :many
SELECT id, post_id, type, url FROM media WHERE post_id = $1
`

func (q *Queries) GetMediaByPostID(ctx context.Context, postID int32) ([]Medium, error) {
	rows, err := q.db.QueryContext(ctx, getMediaByPostID, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Medium
	for rows.Next() {
		var i Medium
		if err := rows.Scan(
			&i.ID,
			&i.PostID,
			&i.Type,
			&i.Url,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getPostByID = `-- name: GetPostByID :one
SELECT id, user_id, title, content, category, reward_amount, nftnized, created_at, updated_at FROM posts WHERE id = $1
`

func (q *Queries) GetPostByID(ctx context.Context, id int32) (Post, error) {
	row := q.db.QueryRowContext(ctx, getPostByID, id)
	var i Post
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Title,
		&i.Content,
		&i.Category,
		&i.RewardAmount,
		&i.Nftnized,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getPosts = `-- name: GetPosts :many
SELECT id, user_id, title, content, category, reward_amount, nftnized, created_at, updated_at FROM posts limit $1 offset $2
`

type GetPostsParams struct {
	Limit  int32
	Offset int32
}

func (q *Queries) GetPosts(ctx context.Context, arg GetPostsParams) ([]Post, error) {
	rows, err := q.db.QueryContext(ctx, getPosts, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Post
	for rows.Next() {
		var i Post
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.Title,
			&i.Content,
			&i.Category,
			&i.RewardAmount,
			&i.Nftnized,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getPostsByCategory = `-- name: GetPostsByCategory :many
SELECT id, user_id, title, content, category, reward_amount, nftnized, created_at, updated_at FROM posts WHERE category = $1 limit $2 offset $3
`

type GetPostsByCategoryParams struct {
	Category int16
	Limit    int32
	Offset   int32
}

func (q *Queries) GetPostsByCategory(ctx context.Context, arg GetPostsByCategoryParams) ([]Post, error) {
	rows, err := q.db.QueryContext(ctx, getPostsByCategory, arg.Category, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Post
	for rows.Next() {
		var i Post
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.Title,
			&i.Content,
			&i.Category,
			&i.RewardAmount,
			&i.Nftnized,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getPostsByUserID = `-- name: GetPostsByUserID :many
SELECT id, user_id, title, content, category, reward_amount, nftnized, created_at, updated_at FROM posts WHERE user_id = $1
`

func (q *Queries) GetPostsByUserID(ctx context.Context, userID int32) ([]Post, error) {
	rows, err := q.db.QueryContext(ctx, getPostsByUserID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Post
	for rows.Next() {
		var i Post
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.Title,
			&i.Content,
			&i.Category,
			&i.RewardAmount,
			&i.Nftnized,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, email, hashed_password, nickname, level, is_admin, address, eth_amount, token_amount, latest_login_date, daily_token, created_at, updated_at FROM users WHERE email = $1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.HashedPassword,
		&i.Nickname,
		&i.Level,
		&i.IsAdmin,
		&i.Address,
		&i.EthAmount,
		&i.TokenAmount,
		&i.LatestLoginDate,
		&i.DailyToken,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByID = `-- name: GetUserByID :one
SELECT id, email, hashed_password, nickname, level, is_admin, address, eth_amount, token_amount, latest_login_date, daily_token, created_at, updated_at FROM users WHERE id = $1
`

func (q *Queries) GetUserByID(ctx context.Context, id int32) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByID, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.HashedPassword,
		&i.Nickname,
		&i.Level,
		&i.IsAdmin,
		&i.Address,
		&i.EthAmount,
		&i.TokenAmount,
		&i.LatestLoginDate,
		&i.DailyToken,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateComment = `-- name: UpdateComment :exec
UPDATE comments SET content = $1 WHERE id = $2
`

type UpdateCommentParams struct {
	Content string
	ID      int32
}

func (q *Queries) UpdateComment(ctx context.Context, arg UpdateCommentParams) error {
	_, err := q.db.ExecContext(ctx, updateComment, arg.Content, arg.ID)
	return err
}

const updatePost = `-- name: UpdatePost :exec
UPDATE posts SET title = $1, content = $2, category = $3, nftnized = $4, reward_amount = $5, updated_at = now() WHERE id = $6
`

type UpdatePostParams struct {
	Title        string
	Content      string
	Category     int16
	Nftnized     bool
	RewardAmount int32
	ID           int32
}

func (q *Queries) UpdatePost(ctx context.Context, arg UpdatePostParams) error {
	_, err := q.db.ExecContext(ctx, updatePost,
		arg.Title,
		arg.Content,
		arg.Category,
		arg.Nftnized,
		arg.RewardAmount,
		arg.ID,
	)
	return err
}

const updateUser = `-- name: UpdateUser :exec
UPDATE users SET nickname = $1, level = $2, address = $3, eth_amount = $4, token_amount = $5, latest_login_date = $6, daily_token = $7, updated_at = now() WHERE id = $8
`

type UpdateUserParams struct {
	Nickname        string
	Level           int16
	Address         string
	EthAmount       string
	TokenAmount     string
	LatestLoginDate sql.NullTime
	DailyToken      int32
	ID              int32
}

func (q *Queries) UpdateUser(ctx context.Context, arg UpdateUserParams) error {
	_, err := q.db.ExecContext(ctx, updateUser,
		arg.Nickname,
		arg.Level,
		arg.Address,
		arg.EthAmount,
		arg.TokenAmount,
		arg.LatestLoginDate,
		arg.DailyToken,
		arg.ID,
	)
	return err
}
