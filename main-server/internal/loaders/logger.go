package loaders

import (
	"go.uber.org/zap"
)

func MustInitLogger() *zap.Logger {
	logger, err := zap.NewProduction(zap.Fields(zap.String("service", "main-server")))
	if err != nil {
		panic("Failed to initialize logger: " + err.Error())
	}
	return logger
}
