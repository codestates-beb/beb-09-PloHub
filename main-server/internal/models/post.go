package models

import (
	"main-server/db/plohub"
	"time"
)

type MediumType int16

const (
	MediumTypeImage MediumType = iota + 1
	MediumTypeVideo
)

func (m MediumType) Valid() bool {
	return m == MediumTypeImage || m == MediumTypeVideo
}

type PostCategory int16

const (
	_ PostCategory = iota
	PostCategoryEventInfo
	PostCategoryCourseInfo
	PostCategoryReview
)

func (c PostCategory) Valid() bool {
	return c == PostCategoryEventInfo || c == PostCategoryCourseInfo || c == PostCategoryReview
}

type CreatePostParams struct {
	UserID   int32
	Title    string
	Content  string
	Category PostCategory
	Media    []CreateMediumParams
}

type CreateMediumParams struct {
	Type MediumType
	Url  string
}

type EditPostParams struct {
	PostID   int32
	UserID   int32
	Title    string
	Content  string
	Category PostCategory
	NFTnized bool
}

type AddCommentParams struct {
	PostID  int32
	UserID  int32
	Content string
}

type PostDetail struct {
	PostInfo PostInfo      `json:"post_info"`
	Comments []CommentInfo `json:"comments"`
	Media    []MediumInfo  `json:"media"`
}

type Author struct {
	ID       int32  `json:"id"`
	Nickname string `json:"nickname"`
	Email    string `json:"email"`
	Level    int16  `json:"level"`
	Address  string `json:"address"`
}

type PostInfo struct {
	ID           int32     `json:"id"`
	Author       Author    `json:"author"`
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
	Nickname     string    `json:"nickname"`
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

type GetPostsResponse struct {
	Posts []PostInfo `json:"posts"`
}

func ToPostInfo(post plohub.GetPostByIDRow) PostInfo {
	postInfo := PostInfo{}
	postInfo.ID = post.ID
	postInfo.Author.ID = post.UserID
	postInfo.Author.Nickname = post.Author.String
	postInfo.Author.Email = post.AuthorEmail.String
	postInfo.Author.Level = post.AuthorLevel.Int16
	postInfo.Author.Address = post.AuthorAddress.String
	postInfo.Title = post.Title
	postInfo.Content = post.Content
	postInfo.Category = post.Category
	postInfo.RewardAmount = post.RewardAmount
	postInfo.Nftnized = post.Nftnized
	postInfo.CreatedAt = post.CreatedAt
	postInfo.UpdatedAt = post.UpdatedAt
	return postInfo
}

func ToPostInfos(posts []plohub.GetPostByIDRow) []PostInfo {
	postInfos := make([]PostInfo, len(posts))
	for i, post := range posts {
		postInfos[i] = ToPostInfo(post)
	}
	return postInfos
}

func ToCommentInfo(comment plohub.Comment) CommentInfo {
	commentInfo := CommentInfo{}
	commentInfo.ID = comment.ID
	commentInfo.PostID = comment.PostID
	commentInfo.UserID = comment.UserID
	commentInfo.Content = comment.Content
	commentInfo.RewardAmount = comment.RewardAmount
	commentInfo.CreatedAt = comment.CreatedAt
	return commentInfo
}

func ToCommentInfos(comments []plohub.Comment) []CommentInfo {
	commentInfos := make([]CommentInfo, len(comments))
	for i, comment := range comments {
		commentInfos[i] = ToCommentInfo(comment)
	}
	return commentInfos
}

func ToMediumInfo(medium plohub.Medium) MediumInfo {
	mediumInfo := MediumInfo{}
	mediumInfo.ID = medium.ID
	mediumInfo.PostID = medium.PostID
	mediumInfo.Type = medium.Type
	mediumInfo.Url = medium.Url
	return mediumInfo
}

func ToMediumInfos(media []plohub.Medium) []MediumInfo {
	mediumInfos := make([]MediumInfo, len(media))
	for i, medium := range media {
		mediumInfos[i] = ToMediumInfo(medium)
	}
	return mediumInfos
}

func ToPostDetail(post plohub.GetPostByIDRow, comments []plohub.Comment, media []plohub.Medium) PostDetail {
	postDetail := PostDetail{}
	postDetail.PostInfo = ToPostInfo(post)
	postDetail.Comments = ToCommentInfos(comments)
	postDetail.Media = ToMediumInfos(media)
	return postDetail
}
