package post

import (
	"context"
	"errors"
	"main-server/db/plohub"
	"main-server/internal/models"
	"main-server/internal/services/storage"
	"main-server/internal/services/wallet"
	"strconv"
)

var (
	ErrUnauthorizedAccess = errors.New("unauthorized access")
)

type Service interface {
	GetPosts(ctx context.Context, limit, page int32) ([]models.PostInfo, error)
	GetPostsByCategory(ctx context.Context, category int16, limit, page int32) ([]models.PostInfo, error)
	GetPostDetail(ctx context.Context, id int32) (*models.PostDetail, error)
	GetComments(ctx context.Context, postID int32) ([]models.CommentInfo, error)
	CreatePost(ctx context.Context, params models.CreatePostParams) error
	EditPost(ctx context.Context, params models.EditPostParams) error
	DeletePost(ctx context.Context, userID, postID int32) ([]string, error)
	LeaveComment(ctx context.Context, params models.AddCommentParams) error
	DeleteComment(ctx context.Context, userID, commentID int32) error
}

type service struct {
	repo      plohub.Repository
	storeSvc  storage.Service
	walletSvc wallet.Service
}

func NewService(repo plohub.Repository, storeSvc storage.Service, walletSvc wallet.Service) Service {
	return &service{
		repo:      repo,
		storeSvc:  storeSvc,
		walletSvc: walletSvc,
	}
}

// GetPosts returns list of posts, limit and page are used for pagination
func (s *service) GetPosts(ctx context.Context, limit, page int32) ([]models.PostInfo, error) {
	if ctx == nil {
		ctx = context.Background()
	}

	var postInfos []models.PostInfo

	// transaction function
	fn := func(q plohub.Querier) error {
		// get posts from db with limit and offset
		posts, err := q.GetPosts(ctx, plohub.GetPostsParams{
			Limit:  limit,
			Offset: (page - 1) * limit,
		})
		if err != nil {
			return err
		}

		postInfos = make([]models.PostInfo, 0, len(posts))

		// convert posts to postInfos
		for _, post := range posts {
			postInfo := models.PostInfo{
				ID: post.ID,
				Author: models.Author{
					ID:       post.UserID,
					Nickname: post.Author.String,
					Email:    post.AuthorEmail.String,
					Level:    post.AuthorLevel.Int16,
					Address:  post.AuthorAddress.String,
				},
				Title:        post.Title,
				Content:      post.Content,
				Category:     post.Category,
				RewardAmount: post.RewardAmount,
				Nftnized:     post.Nftnized,
				CreatedAt:    post.CreatedAt,
				UpdatedAt:    post.UpdatedAt,
			}

			postInfos = append(postInfos, postInfo)
		}

		return nil
	}

	// execute transaction
	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return nil, err
	}

	// return postInfos
	return postInfos, nil
}

// GetPostsByCategory returns list of posts by category, limit and page are used for pagination
func (s *service) GetPostsByCategory(ctx context.Context, category int16, limit, page int32) ([]models.PostInfo, error) {
	if ctx == nil {
		ctx = context.Background()
	}

	var postInfos []models.PostInfo

	// transaction function
	fn := func(q plohub.Querier) error {
		// get posts from db with limit and offset
		posts, err := q.GetPostsByCategory(ctx, plohub.GetPostsByCategoryParams{
			Category: category,
			Limit:    limit,
			Offset:   (page - 1) * limit,
		})
		if err != nil {
			return err
		}

		// convert posts to postInfos
		postInfos = make([]models.PostInfo, 0, len(posts))

		for _, post := range posts {
			postInfo := models.PostInfo{
				ID: post.ID,
				Author: models.Author{
					ID:       post.UserID,
					Nickname: post.Author.String,
					Email:    post.AuthorEmail.String,
					Level:    post.AuthorLevel.Int16,
					Address:  post.AuthorAddress.String,
				},
				Title:        post.Title,
				Content:      post.Content,
				Category:     post.Category,
				RewardAmount: post.RewardAmount,
				Nftnized:     post.Nftnized,
				CreatedAt:    post.CreatedAt,
				UpdatedAt:    post.UpdatedAt,
			}

			postInfos = append(postInfos, postInfo)
		}

		return nil
	}

	// execute transaction
	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return nil, err
	}

	// return postInfos
	return postInfos, nil
}

// GetPostDetail returns post detail by post id
func (s *service) GetPostDetail(ctx context.Context, id int32) (*models.PostDetail, error) {
	if ctx == nil {
		ctx = context.Background()
	}

	var postDetail models.PostDetail

	// transaction function
	fn := func(q plohub.Querier) error {
		// get post from db
		post, err := q.GetPostByID(ctx, id)
		if err != nil {
			return err
		}

		// get comments from db
		comments, err := q.GetCommentsByPostID(ctx, id)
		if err != nil {
			return err
		}

		// get media from db
		media, err := q.GetMediaByPostID(ctx, id)
		if err != nil {
			return err
		}

		// convert post to postDetail
		postDetail = models.ToPostDetail(post, comments, media)

		return nil
	}

	// execute transaction
	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return nil, err
	}

	// return postDetail
	return &postDetail, nil
}

// GetComments returns list of comments by post id
func (s *service) GetComments(ctx context.Context, postID int32) ([]models.CommentInfo, error) {
	var commentInfos []models.CommentInfo

	fn := func(q plohub.Querier) error {
		// get comments from db
		comments, err := q.GetCommentsByPostID(ctx, postID)
		if err != nil {
			return err
		}

		// convert comments to commentInfos
		commentInfos = make([]models.CommentInfo, 0, len(comments))

		for _, comment := range comments {
			var commentInfo models.CommentInfo
			commentInfo.ID = comment.ID
			commentInfo.PostID = comment.PostID
			commentInfo.Author.ID = comment.UserID
			commentInfo.Author.Nickname = comment.Nickname.String
			commentInfo.Author.Email = comment.Email.String
			commentInfo.Author.Level = comment.Level.Int16
			commentInfo.Content = comment.Content
			commentInfo.RewardAmount = comment.RewardAmount
			commentInfo.CreatedAt = comment.CreatedAt

			commentInfos = append(commentInfos, commentInfo)
		}

		return nil
	}

	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return nil, err
	}

	return commentInfos, nil
}

// CreatePost creates a new post and returns post id
func (s *service) CreatePost(ctx context.Context, params models.CreatePostParams) error {
	fn := func(q plohub.Querier) error {
		// check if user exists
		user, err := q.GetUserByID(ctx, params.UserID)
		if err != nil {
			return err
		}

		// check if user is level 1 and category is course info
		if user.Level == 1 && params.Category == models.PostCategoryCourseInfo {
			return ErrUnauthorizedAccess
		}

		// create post
		postID, err := q.CreatePost(ctx, plohub.CreatePostParams{
			UserID:       params.UserID,
			Title:        params.Title,
			Content:      params.Content,
			Category:     int16(params.Category),
			RewardAmount: 0,
		})
		if err != nil {
			return err
		}

		// create media
		for _, m := range params.Media {
			err = q.CreateMedia(ctx, plohub.CreateMediaParams{
				PostID: postID,
				Type:   int16(m.Type),
				Url:    m.Url,
			})
			if err != nil {
				return err
			}
		}

		// check if user received reward limit for today
		if user.DailyToken >= 40 {
			return nil
		}

		// issue reward
		reward, err := s.walletSvc.IssueReward(ctx, params.UserID, models.RewardTypeCreatePost)
		if err != nil {
			return err
		}

		// level up user
		level := user.Level

		if level == 1 {
			tokenAmount, err := strconv.ParseInt(reward.TokenAmount, 10, 64)
			if err != nil {
				return err
			}

			if tokenAmount >= 40 {
				level = 2
			}
		}

		// update user with reward
		err = q.UpdateUser(ctx, plohub.UpdateUserParams{
			ID:              params.UserID,
			DailyToken:      user.DailyToken + reward.RewardAmount,
			Nickname:        user.Nickname,
			Level:           user.Level,
			Address:         user.Address,
			EthAmount:       user.EthAmount,
			TokenAmount:     reward.TokenAmount,
			LatestLoginDate: user.LatestLoginDate,
		})
		if err != nil {
			return err
		}

		// update post with reward amount
		return q.UpdatePost(ctx, plohub.UpdatePostParams{
			ID:           postID,
			Title:        params.Title,
			Content:      params.Content,
			Category:     int16(params.Category),
			RewardAmount: reward.RewardAmount,
			Nftnized:     false,
		})
	}

	return s.repo.ExecTx(ctx, fn)
}

// EditPost edits a post by post id
func (s *service) EditPost(ctx context.Context, params models.EditPostParams) error {
	fn := func(q plohub.Querier) error {
		// check if post exists
		post, err := q.GetPostByID(ctx, params.PostID)
		if err != nil {
			return err
		}

		// check if user is the owner of the post
		if params.UserID != post.UserID {
			return ErrUnauthorizedAccess
		}

		// update post
		return q.UpdatePost(ctx, plohub.UpdatePostParams{
			ID:           params.PostID,
			Title:        params.Title,
			Content:      params.Content,
			Category:     int16(params.Category),
			RewardAmount: post.RewardAmount,
			Nftnized:     params.NFTnized,
		})
	}

	return s.repo.ExecTx(ctx, fn)
}

// DeletePost deletes a post by post id
func (s *service) DeletePost(ctx context.Context, userID, postID int32) ([]string, error) {
	var urls []string

	fn := func(q plohub.Querier) error {
		// check if post exists
		post, err := q.GetPostByID(ctx, postID)
		if err != nil {
			return err
		}

		// check if user is the owner of the post
		if userID != post.UserID {
			return ErrUnauthorizedAccess
		}

		// get media
		media, err := q.GetMediaByPostID(ctx, postID)
		if err != nil {
			return err
		}

		for _, m := range media {
			urls = append(urls, m.Url)
		}

		// delete comments
		err = q.DeleteCommentsByPostID(ctx, postID)
		if err != nil {
			return err
		}

		// delete media
		err = q.DeleteMediaByPostID(ctx, postID)
		if err != nil {
			return err
		}

		// delete post
		return q.DeletePost(ctx, postID)
	}

	err := s.repo.ExecTx(ctx, fn)
	if err != nil {
		return nil, err
	}

	return urls, nil
}

// AddComment adds a comment to a post
func (s *service) LeaveComment(ctx context.Context, params models.AddCommentParams) error {
	fn := func(q plohub.Querier) error {
		// check if post exists
		_, err := q.GetPostByID(ctx, params.PostID)
		if err != nil {
			return err
		}

		// check if user exists
		user, err := q.GetUserByID(ctx, params.UserID)
		if err != nil {
			return err
		}

		// create comment
		commentID, err := q.CreateComment(ctx, plohub.CreateCommentParams{
			PostID:  params.PostID,
			UserID:  params.UserID,
			Content: params.Content,
		})
		if err != nil {
			return err
		}

		// check if user received reward limit for today
		if user.DailyToken >= 40 {
			return nil
		}

		// issue reward
		reward, err := s.walletSvc.IssueReward(ctx, params.UserID, models.RewardTypeLeaveComment)
		if err != nil {
			return err
		}

		// level up user
		level := user.Level

		if level == 1 {
			tokenAmount, err := strconv.ParseInt(reward.TokenAmount, 10, 64)
			if err != nil {
				return err
			}

			if tokenAmount >= 40 {
				level = 2
			}
		}

		err = q.UpdateComment(ctx, plohub.UpdateCommentParams{
			ID:           commentID,
			RewardAmount: reward.RewardAmount,
			Content:      params.Content,
		})
		if err != nil {
			return err
		}

		// update user with reward
		return q.UpdateUser(ctx, plohub.UpdateUserParams{
			ID:              params.UserID,
			DailyToken:      user.DailyToken + reward.RewardAmount,
			Nickname:        user.Nickname,
			Level:           level,
			Address:         user.Address,
			EthAmount:       user.EthAmount,
			TokenAmount:     reward.TokenAmount,
			LatestLoginDate: user.LatestLoginDate,
		})
	}

	return s.repo.ExecTx(ctx, fn)
}

// DeleteComment deletes a comment by comment id
func (s *service) DeleteComment(ctx context.Context, userID, commentID int32) error {
	fn := func(q plohub.Querier) error {
		// check if comment exists
		comment, err := q.GetCommentByID(ctx, commentID)
		if err != nil {
			return err
		}

		// check if user is the owner of the comment
		if userID != comment.UserID {
			return ErrUnauthorizedAccess
		}

		// delete comment
		return q.DeleteComment(ctx, commentID)
	}

	return s.repo.ExecTx(ctx, fn)
}
