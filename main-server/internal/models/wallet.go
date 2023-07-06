package models

type RewardType int8

const (
	_ RewardType = iota
	Login
	CreatePost
	LeaveComment
)

type Wallet struct {
	UserID      int32  `json:"user_id"`
	Address     string `json:"address"`
	TokenAmount string `json:"token_amount"`
	EthAmount   string `json:"eth_amount"`
}

type CreateWalletRequest struct {
	UserID int32 `json:"user_id"`
}

type CreateWalletResponse struct {
	Address     string `json:"address"`
	TokenAmount string `json:"token_amount"`
	EthAmount   string `json:"eth_amount"`
	Message     string `json:"message"`
}

type Reward struct {
	UserID       int32      `json:"user_id"`
	RewardAmount int32      `json:"reward_amount"`
	RewardType   RewardType `json:"reward_type"`
	TokenAmount  string     `json:"token_amount"`
}

type RewardRequest struct {
	UserID     int32      `json:"user_id"`
	RewardType RewardType `json:"reward_type"`
}

type RewardResponse struct {
	RewardAmount int32  `json:"reward_amount"`
	TokenAmount  string `json:"token_amount"`
	EthAmount    string `json:"eth_amount"`
}
