package models

import "time"

type NFT struct {
	ID           int32     `json:"id"`
	OwnerAddress string    `json:"owner_address"`
	TokenID      int32     `json:"token_id"`
	TokenURI     string    `json:"token_uri"`
	Price        int32     `json:"price"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
