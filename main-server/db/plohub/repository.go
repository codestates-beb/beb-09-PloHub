package plohub

import (
	"context"
	"database/sql"
	"errors"
)

type Repository interface {
	Querier
	ExecTx(ctx context.Context, fn func(Querier) error, opts ...*sql.TxOptions) error
}

type repository struct {
	db *sql.DB
	*Queries
}

func NewRepository(db *sql.DB) Repository {
	return &repository{
		db:      db,
		Queries: New(db),
	}
}

func (r *repository) ExecTx(ctx context.Context, fn func(Querier) error, opts ...*sql.TxOptions) error {
	var tx *sql.Tx
	var err error

	if len(opts) > 0 {
		tx, err = r.db.BeginTx(ctx, opts[0])
	} else {
		tx, err = r.db.BeginTx(ctx, nil)
	}
	if err != nil {
		return err
	}

	q := New(tx)

	err = fn(q)
	if err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return errors.Join(err, rbErr)
		}
		return err
	}

	return tx.Commit()
}
