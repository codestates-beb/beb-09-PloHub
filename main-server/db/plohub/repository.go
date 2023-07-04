package plohub

import (
	"context"
	"database/sql"
)

type Repository interface {
	Querier
	ExecTx(ctx context.Context, fn func(Querier) error, opts ...*sql.TxOptions) error
}

type repository struct {
	db *sql.DB
	*Queries
}
