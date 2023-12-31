package plohub

import "context"

type Querier interface {
	CreateComment(ctx context.Context, arg CreateCommentParams) (int32, error)
	CreateMedia(ctx context.Context, arg CreateMediaParams) error
	CreatePost(ctx context.Context, arg CreatePostParams) (int32, error)
	CreateUser(ctx context.Context, arg CreateUserParams) (int32, error)
	DeleteComment(ctx context.Context, id int32) error
	DeleteCommentsByPostID(ctx context.Context, postID int32) error
	DeleteMedia(ctx context.Context, id int32) error
	DeleteMediaByPostID(ctx context.Context, postID int32) error
	DeletePost(ctx context.Context, id int32) error
	DeleteUser(ctx context.Context, id int32) error
	GetCommentByID(ctx context.Context, id int32) (Comment, error)
	GetCommentsByPostID(ctx context.Context, postID int32) ([]GetCommentsByPostIDRow, error)
	GetCommentsByUserID(ctx context.Context, userID int32) ([]GetCommentsByUserIDRow, error)
	GetMediaByPostID(ctx context.Context, postID int32) ([]Medium, error)
	GetPostByID(ctx context.Context, id int32) (GetPostByIDRow, error)
	GetPosts(ctx context.Context, arg GetPostsParams) ([]GetPostsRow, error)
	GetPostsByCategory(ctx context.Context, arg GetPostsByCategoryParams) ([]GetPostsByCategoryRow, error)
	GetPostsByUserID(ctx context.Context, userID int32) ([]GetPostsByUserIDRow, error)
	GetUserByAddress(ctx context.Context, address string) (User, error)
	GetUserByEmail(ctx context.Context, email string) (User, error)
	GetUserByID(ctx context.Context, id int32) (User, error)
	UpdateComment(ctx context.Context, arg UpdateCommentParams) error
	UpdatePost(ctx context.Context, arg UpdatePostParams) error
	UpdateUser(ctx context.Context, arg UpdateUserParams) error
	EmailExists(ctx context.Context, email string) (bool, error)
}

var _ Querier = (*Queries)(nil)
