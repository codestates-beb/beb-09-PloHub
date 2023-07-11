-- name: CreateUser :one
INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING id;

-- name: EmailExists :one
SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: UpdateUser :exec
UPDATE users SET nickname = $1, level = $2, address = $3, eth_amount = $4, token_amount = $5, latest_login_date = $6, daily_token = $7, updated_at = now() WHERE id = $8;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;

-- name: CreatePost :one
INSERT INTO posts (user_id, title, content, category, reward_amount) VALUES ($1, $2, $3, $4, $5) RETURNING id;

-- name: GetPostByID :one
SELECT * FROM posts WHERE id = $1;

-- name: GetPosts :many
SELECT * FROM posts limit $1 offset $2;

-- name: GetPostsByUserID :many
SELECT * FROM posts WHERE user_id = $1;

-- name: GetPostsByCategory :many
SELECT * FROM posts WHERE category = $1 limit $2 offset $3;

-- name: UpdatePost :exec
UPDATE posts SET title = $1, content = $2, category = $3, nftnized = $4, reward_amount = $5, updated_at = now() WHERE id = $6;

-- name: DeletePost :exec
DELETE FROM posts WHERE id = $1;

-- name: CreateMedia :exec
INSERT INTO media (post_id, type, url) VALUES ($1, $2, $3);

-- name: GetMediaByPostID :many
SELECT * FROM media WHERE post_id = $1;

-- name: DeleteMedia :exec
DELETE FROM media WHERE id = $1;

-- name: DeleteMediaByPostID :exec
DELETE FROM media WHERE post_id = $1;

-- name: CreateComment :exec
INSERT INTO comments (post_id, user_id, content, reward_amount) VALUES ($1, $2, $3, $4);

-- name: GetCommentByID :one
SELECT * FROM comments WHERE id = $1;

-- name: GetCommentsByPostID :many
SELECT * FROM comments WHERE post_id = $1;

-- name: GetCommentsByUserID :many
SELECT * FROM comments WHERE user_id = $1;

-- name: UpdateComment :exec
UPDATE comments SET content = $1 WHERE id = $2;

-- name: DeleteComment :exec
DELETE FROM comments WHERE id = $1;

-- name: DeleteCommentsByPostID :exec
DELETE FROM comments WHERE post_id = $1;