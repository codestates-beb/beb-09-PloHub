package wallet

import (
	"main-server/internal/models"
	"net/http"
)

type Service interface {
	CreateWallet(userID int32) (*models.Wallet, error)
	GetUserNFTs(userID int32) ([]*models.NFT, error)
	IssueReward(userID int32, rewardType models.RewardType) (*models.Reward, error)
}

type service struct {
	client  *http.Client
	baseURL string
}

func NewService(baseURL string, clients ...*http.Client) Service {
	client := http.DefaultClient
	if len(clients) > 0 || clients[0] != nil {
		client = clients[0]
	}
	return &service{
		client:  client,
		baseURL: baseURL,
	}
}

// CreateWallet implements Service.
func (*service) CreateWallet(userID int32) (*models.Wallet, error) {
	panic("unimplemented")
}

// GetUserNFTs implements Service.
func (*service) GetUserNFTs(userID int32) ([]*models.NFT, error) {
	panic("unimplemented")
}

// Reward implements Service.
func (*service) IssueReward(userID int32, rewardType models.RewardType) (*models.Reward, error) {
	panic("unimplemented")
}
