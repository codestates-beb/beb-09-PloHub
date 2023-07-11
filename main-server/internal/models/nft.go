package models

import "time"

type NFT struct {
	UserID       int32     `json:"user_id"`
	OwnerAddress string    `json:"owner_address"`
	TokenID      int32     `json:"token_id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	Image        string    `json:"image"`
	Price        string    `json:"price"`
	CreatedAt    time.Time `json:"created_at"`
}

type MintNFTRequest struct {
	UserID      int32  `json:"user_id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Image       string `json:"image"`
}

type NFTMinted struct {
	TokenID     int32  `json:"token_id"`
	EthAmount   string `json:"eth_amount"`
	TokenAmount string `json:"token_amount"`
}

type GetNFTDetailsRequest struct {
	TokenID int32 `json:"token_id"`
}

type GetNFTDetailsResponse struct {
	UserID       int32     `json:"user_id"`
	OwnerAddress string    `json:"owner_address"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	Image        string    `json:"image"`
	Price        string    `json:"price"`
	CreatedAt    time.Time `json:"created_at"`
}
