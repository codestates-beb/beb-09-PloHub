package loaders

import (
	"context"
	"database/sql"

	_ "github.com/lib/pq"
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

				connCh <- conn
				return
			}
		}
	}()

	return connCh
}
