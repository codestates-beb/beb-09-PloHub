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
	MintNFT(ctx context.Context, userID int32, name, description, imageUrl string) (*models.NFTMinted, error)
	GetAllNFTs(ctx context.Context) ([]models.NFT, error)
	GetNFTDetails(ctx context.Context, tokenID int32) (*models.NFT, error)
	GetUserNFTs(ctx context.Context, userID int32) ([]models.NFT, error)
	IssueReward(ctx context.Context, userID int32, rewardType models.RewardType) (*models.Reward, error)
	SwapTokens(ctx context.Context, userID int32, tokenAmount int32) (*models.Balance, error)
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

func (s *service) MintNFT(ctx context.Context, userID int32, name, description, imageUrl string) (*models.NFTMinted, error) {
	body := models.MintNFTRequest{
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

	var nftResp models.NFTMinted

	err = json.NewDecoder(resp.Body).Decode(&nftResp)
	if err != nil {
		return nil, err
	}

	return &nftResp, nil
}

func (s *service) GetAllNFTs(ctx context.Context) ([]models.NFT, error) {
	url := fmt.Sprintf("%s/api/v1/nft/nftList", s.baseURL)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error getting nfts: %s", resp.Status)
	}

	var nftResp models.GetNFTsResponse

	err = json.NewDecoder(resp.Body).Decode(&nftResp)
	if err != nil {
		return nil, err
	}

	var nfts []models.NFT

	for _, rawNFT := range nftResp.Data {
		var nft models.NFT

		nft.UserID = rawNFT.UserID
		nft.OwnerAddress = rawNFT.OwnerAddress
		nft.TokenID = rawNFT.TokenID
		nft.Name = rawNFT.Name
		nft.Description = rawNFT.Description
		nft.Image = rawNFT.Image
		nft.TokenURI = rawNFT.TokenURI
		nft.Price = rawNFT.Price
		nft.CreatedAt = rawNFT.CreatedAt

		nfts = append(nfts, nft)
	}

	return nfts, nil
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

func (s *service) GetUserNFTs(ctx context.Context, userID int32) ([]models.NFT, error) {
	body := models.GetUserNFTsRequest{
		UserID: userID,
	}

	jsonBody, err := json.MarshalIndent(body, "", "\t")
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/api/v1/nft/userNFT", s.baseURL)

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
		return nil, fmt.Errorf("error getting user nfts: %s", resp.Status)
	}

	var nftResp models.GetNFTsResponse

	err = json.NewDecoder(resp.Body).Decode(&nftResp)
	if err != nil {
		return nil, err
	}

	var nfts []models.NFT

	for _, rawNFT := range nftResp.Data {
		var nft models.NFT

		nft.UserID = rawNFT.UserID
		nft.OwnerAddress = rawNFT.OwnerAddress
		nft.TokenID = rawNFT.TokenID
		nft.Name = rawNFT.Name
		nft.Description = rawNFT.Description
		nft.Image = rawNFT.Image
		nft.TokenURI = rawNFT.TokenURI
		nft.Price = rawNFT.Price
		nft.CreatedAt = rawNFT.CreatedAt

		nfts = append(nfts, nft)
	}

	return nfts, nil
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

func (s *service) SwapTokens(ctx context.Context, userID int32, tokenAmount int32) (*models.Balance, error) {
	body := models.SwapTokensRequest{
		UserID:      userID,
		TokenAmount: tokenAmount,
	}

	jsonBody, err := json.MarshalIndent(body, "", "\t")
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/api/v1/wallets/tokenSwap", s.baseURL)

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
		return nil, fmt.Errorf("error swapping tokens: %s", resp.Status)
	}

	var swapResp models.SwapTokensResponse

	err = json.NewDecoder(resp.Body).Decode(&swapResp)
	if err != nil {
		return nil, err
	}

	var balance models.Balance
	balance.TokenAmount = swapResp.TokenAmount
	balance.EthAmount = swapResp.EthAmount

	return &balance, nil
}
