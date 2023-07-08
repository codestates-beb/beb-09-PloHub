package main

import (
	"main-server/internal/loaders"

	"go.uber.org/zap"
)

func init() {
	zap.ReplaceGlobals(loaders.MustInitLogger())
}

func main() {
	defer zap.L().Sync()
	defer func() {
		if r := recover(); r != nil {
			zap.L().Fatal("Recovered in main", zap.Any("reason", r))
		}
	}()

	loaders.Run()
}
