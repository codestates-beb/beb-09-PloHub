package wallet

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"main-server/internal/models"
	"net/http"
)

type Service interface {
	CreateWallet(ctx context.Context, userID int32) (*models.Wallet, error)
	CreateNFT(ctx context.Context, userID int32, name, description, imageUrl string) (*models.NFTCreated, error)
	GetAllNFTs(ctx context.Context) ([]*models.NFT, error)
	GetNFTDetails(ctx context.Context, tokenID int32) (*models.NFT, error)
	GetUserNFTs(ctx context.Context, userID int32) ([]*models.NFT, error)
	IssueReward(ctx context.Context, userID int32, rewardType models.RewardType) (*models.Reward, error)
}

type service struct {
	client  *http.Client
	baseURL string
}

func NewService(baseURL string) Service {
	return &service{
		client:  http.DefaultClient,
		baseURL: baseURL,
	}
}

func (s *service) CreateWallet(ctx context.Context, userID int32) (*models.Wallet, error) {
	body := models.CreateWalletRequest{
		UserID: userID,
	}

	jsonBody, err := json.MarshalIndent(body, "", "\t")
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/api/v1/wallets/create", s.baseURL)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error creating wallet: %s", resp.Status)
	}

	var walletResp models.CreateWalletResponse

	err = json.NewDecoder(resp.Body).Decode(&walletResp)
	if err != nil {
		return nil, err
	}

	var wallet models.Wallet

	wallet.Address = walletResp.Address
	wallet.UserID = userID
	wallet.TokenAmount = walletResp.TokenAmount
	wallet.EthAmount = walletResp.EthAmount

	return &wallet, nil
}

func (s *service) CreateNFT(ctx context.Context, userID int32, name, description, imageUrl string) (*models.NFTCreated, error) {
	body := models.CreateNFTRequest{
		UserID:      userID,
		Name:        name,
		Description: description,
		Image:       imageUrl,
	}

	jsonBody, err := json.MarshalIndent(body, "", "\t")
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/api/v1/nft/mint", s.baseURL)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error creating nft: %s", resp.Status)
	}

	var nftResp models.NFTCreated

	err = json.NewDecoder(resp.Body).Decode(&nftResp)
	if err != nil {
		return nil, err
	}

	return &nftResp, nil
}

// GetAllNFTs implements Service.
func (*service) GetAllNFTs(ctx context.Context) ([]*models.NFT, error) {
	panic("unimplemented")
}

func (s *service) GetNFTDetails(ctx context.Context, tokenID int32) (*models.NFT, error) {
	body := models.GetNFTDetailsRequest{
		TokenID: tokenID,
	}

	jsonBody, err := json.MarshalIndent(body, "", "\t")
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/api/v1/nft/nftDetail", s.baseURL)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error getting nft details: %s", resp.Status)
	}

	var nftResp models.GetNFTDetailsResponse

	err = json.NewDecoder(resp.Body).Decode(&nftResp)
	if err != nil {
		return nil, err
	}

	var nft models.NFT

	nft.UserID = nftResp.UserID
	nft.OwnerAddress = nftResp.OwnerAddress
	nft.TokenID = tokenID
	nft.Name = nftResp.Name
	nft.Description = nftResp.Description
	nft.Image = nftResp.Image
	nft.Price = nftResp.Price
	nft.CreatedAt = nftResp.CreatedAt

	return &nft, nil
}

// GetUserNFTs implements Service.
func (*service) GetUserNFTs(ctx context.Context, userID int32) ([]*models.NFT, error) {
	panic("unimplemented")
}

func (s *service) IssueReward(ctx context.Context, userID int32, rewardType models.RewardType) (*models.Reward, error) {
	body := models.IssueRewardRequest{
		UserID:     userID,
		RewardType: rewardType,
	}

	jsonBody, err := json.MarshalIndent(body, "", "\t")
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/api/v1/wallets/reward", s.baseURL)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error issuing reward: %s", resp.Status)
	}

	var rewardResp models.IssueRewardResponse

	err = json.NewDecoder(resp.Body).Decode(&rewardResp)
	if err != nil {
		return nil, err
	}

	var reward models.Reward

	reward.UserID = userID
	reward.RewardType = rewardType
	reward.RewardAmount = rewardResp.RewardAmount
	reward.TokenAmount = rewardResp.TokenAmount

	return &reward, nil
}
