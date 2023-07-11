package loaders

import (
	"context"
	"main-server/internal/configs"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"go.uber.org/zap"
)

func MustInitS3Client(ctx context.Context, cfg *configs.Config) *s3.Client {
	s3Client, err := NewS3Client(ctx, cfg)
	if err != nil {
		zap.L().Panic("Failed to init s3 client", zap.Error(err))
	}

	return s3Client
}

func NewS3Client(ctx context.Context, cfg *configs.Config) (*s3.Client, error) {
	creds := credentials.NewStaticCredentialsProvider(cfg.S3.AccessKey, cfg.S3.SecretKey, "")
	s3cfg, err := config.LoadDefaultConfig(ctx, config.WithCredentialsProvider(creds), config.WithDefaultRegion(cfg.S3.Region))
	if err != nil {
		return nil, err
	}

	return s3.NewFromConfig(s3cfg), nil
}
