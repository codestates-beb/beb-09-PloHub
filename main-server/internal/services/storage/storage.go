package storage

import (
	"context"
	"errors"
	"fmt"
	"io"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type Error struct {
	message string
}

func (e Error) Error() string {
	return e.message
}

func NewError(message string) Error {
	return Error{message: message}
}

var (
	ErrNilContext     Error = NewError("context is nil")
	ErrFilenameMissed       = NewError("filename is missed")
	ErrFileMissed           = NewError("file is missed")
)

type Service interface {
	UploadFile(ctx context.Context, filename string, file io.Reader) (string, error)
	DeleteFile(ctx context.Context, filename string) error
}

type service struct {
	region string
	bucket string
	client *s3.Client
}

func NewService(region, bucket string, client *s3.Client) Service {
	return &service{
		region: region,
		bucket: bucket,
		client: client,
	}
}

// UploadFile uploads file to S3 bucket and returns URL of uploaded file
func (s *service) UploadFile(ctx context.Context, filename string, file io.Reader) (string, error) {
	if ctx == nil {
		return "", ErrNilContext
	}

	if filename == "" {
		return "", ErrFilenameMissed
	}

	if file == nil {
		return "", ErrFileMissed
	}

	params := &s3.PutObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(filename),
		Body:   file,
	}

	_, err := s.client.PutObject(ctx, params)
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", s.bucket, s.region, filename), nil
}

// DeleteFile deletes file from S3 bucket
func (s *service) DeleteFile(ctx context.Context, filename string) error {
	if ctx == nil {
		return ErrNilContext
	}

	if filename == "" {
		return ErrFilenameMissed
	}

	errors.As(ErrFileMissed, &Error{})

	params := &s3.DeleteObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(filename),
	}

	_, err := s.client.DeleteObject(ctx, params)
	if err != nil {
		return err
	}

	return nil
}
