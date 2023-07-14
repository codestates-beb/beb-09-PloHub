package loaders

import (
	"context"
	"database/sql"

	_ "github.com/lib/pq"
	"go.uber.org/zap"
)

func ConnectPostgres(dsn string) (*sql.DB, error) {
	conn, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	return conn, nil
}

func MustConnectPostgresWithRetry(ctx context.Context, dsn string) <-chan *sql.DB {
	connCh := make(chan *sql.DB, 1)

	go func() {
		defer close(connCh)
		for {
			select {
			case <-ctx.Done():
				return
			default:
				conn, err := ConnectPostgres(dsn)
				if err != nil {
					continue
				}

				if err := conn.Ping(); err != nil {
					continue
				}

				zap.L().Info("Connected to postgres")
				connCh <- conn
				return
			}
		}
	}()

	return connCh
}
