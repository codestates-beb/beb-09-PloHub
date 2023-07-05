package models

type MyPageInfo struct {
	UserInfo UserInfo `json:"user_info"`
	Posts    []Post   `json:"posts"`
	NFTs     []NFT    `json:"nfts"`
}

type UserInfo struct {
	ID          int32  `json:"id"`
	Email       string `json:"email"`
	Nickname    string `json:"nickname"`
	Level       int16  `json:"level"`
	Address     string `json:"address"`
	EthAmount   int64  `json:"eth_amount"`
	TokenAmount int64  `json:"token_amount"`
	DailyToken  int32  `json:"daily_token"`
}
