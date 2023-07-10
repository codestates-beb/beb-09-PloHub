package plohub

import "context"

type Querier interface {
	CreateComment(ctx context.Context, arg CreateCommentParams) error
	CreateMedia(ctx context.Context, arg CreateMediaParams) error
	CreatePost(ctx context.Context, arg CreatePostParams) (int32, error)
	CreateUser(ctx context.Context, arg CreateUserParams) (int32, error)
	DeleteComment(ctx context.Context, id int32) error
	DeleteMedia(ctx context.Context, id int32) error
	DeletePost(ctx context.Context, id int32) error
	DeleteUser(ctx context.Context, id int32) error
	GetCommentByID(ctx context.Context, id int32) (Comment, error)
	GetCommentsByPostID(ctx context.Context, postID int32) ([]Comment, error)
	GetCommentsByUserID(ctx context.Context, userID int32) ([]Comment, error)
	GetMediaByPostID(ctx context.Context, postID int32) ([]Medium, error)
	GetPostByID(ctx context.Context, id int32) (Post, error)
	GetPosts(ctx context.Context, arg GetPostsParams) ([]Post, error)
	GetPostsByCategory(ctx context.Context, arg GetPostsByCategoryParams) ([]Post, error)
	GetPostsByUserID(ctx context.Context, userID int32) ([]Post, error)
	GetUserByEmail(ctx context.Context, email string) (User, error)
	GetUserByID(ctx context.Context, id int32) (User, error)
	UpdateComment(ctx context.Context, arg UpdateCommentParams) error
	UpdatePost(ctx context.Context, arg UpdatePostParams) error
	UpdateUser(ctx context.Context, arg UpdateUserParams) error
	EmailExists(ctx context.Context, email string) (bool, error)
}

var _ Querier = (*Queries)(nil)
