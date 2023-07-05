package models

type MyPageInfo struct {
	UserInfo UserInfo   `json:"user_info"`
	Posts    []PostInfo `json:"posts"`
	NFTs     []NFT      `json:"nfts"`
}

type UserInfo struct {
	ID          int32  `json:"id"`
	Email       string `json:"email"`
	Nickname    string `json:"nickname"`
	Level       int16  `json:"level"`
	Address     string `json:"address"`
	EthAmount   string `json:"eth_amount"`
	TokenAmount string `json:"token_amount"`
	DailyToken  int32  `json:"daily_token"`
}

type CheckEmailRequest struct {
	Email string `json:"email"`
}

type LoginResponse struct {
	UserInfoResponse
	AccessTokenResponse
}

type UserInfoResponse struct {
	UserInfo UserInfo `json:"user_info"`
}
