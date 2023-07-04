package plohub

import "context"

type Querier interface {
	CreateComment(ctx context.Context, arg CreateCommentParams) error
	CreateMedia(ctx context.Context, arg CreateMediaParams) error
	CreatePost(ctx context.Context, arg CreatePostParams) error
	CreateUser(ctx context.Context, arg CreateUserParams) (int32, error)
	DeleteComment(ctx context.Context, id int32) error
	DeleteMedia(ctx context.Context, id int32) error
	DeletePost(ctx context.Context, id int32) error
	DeleteUser(ctx context.Context, id int32) error
	GetCommentsByPostID(ctx context.Context, postID int32) ([]CommentInfo, error)
	GetCommentsByUserID(ctx context.Context, userID int32) ([]CommentInfo, error)
	GetMediaByPostID(ctx context.Context, postID int32) ([]Medium, error)
	GetPostByID(ctx context.Context, id int32) (PostInfo, error)
	GetPosts(ctx context.Context, arg GetPostsParams) ([]PostInfo, error)
	GetPostsByCategory(ctx context.Context, arg GetPostsByCategoryParams) ([]PostInfo, error)
	GetPostsByUserID(ctx context.Context, userID int32) ([]PostInfo, error)
	GetUserByEmail(ctx context.Context, email string) (UserInfo, error)
	GetUserByID(ctx context.Context, id int32) (UserInfo, error)
	UpdateComment(ctx context.Context, arg UpdateCommentParams) error
	UpdatePost(ctx context.Context, arg UpdatePostParams) error
	UpdateUser(ctx context.Context, arg UpdateUserParams) error
}

var _ Querier = (*Queries)(nil)
