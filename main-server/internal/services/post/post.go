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
	CreatePost(ctx context.Context, params models.CreatePostParams) error
	EditPost(ctx context.Context, params models.EditPostParams) error
	DeletePost(ctx context.Context, userID, postID int32) error
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

		// convert posts to postInfos
		postInfos = models.ToPostInfos(posts)

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
		postInfos = models.ToPostInfos(posts)

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

// CreatePost creates a new post and returns post id
func (s *service) CreatePost(ctx context.Context, params models.CreatePostParams) error {
	fn := func(q plohub.Querier) error {
		// check if user exists
		user, err := q.GetUserByID(ctx, params.UserID)
		if err != nil {
			return err
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
func (s *service) DeletePost(ctx context.Context, userID, postID int32) error {
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

		// TODO: delete comments

		// TODO: delete media

		// delete post
		return q.DeletePost(ctx, postID)
	}

	return s.repo.ExecTx(ctx, fn)
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
		err = q.CreateComment(ctx, plohub.CreateCommentParams{
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
