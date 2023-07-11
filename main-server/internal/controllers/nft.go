package controllers

import (
	"main-server/internal/middlewares"
	"main-server/internal/models"
	"main-server/internal/services/auth"
	"main-server/internal/services/storage"
	"main-server/internal/services/user"
	"main-server/internal/utils"
	"net/http"

	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

type nftController struct {
	authSvc  auth.Service
	storeSvc storage.Service
	userSvc  user.Service
}

func NewNFTController(authSvc auth.Service, storeSvc storage.Service, userSvc user.Service) Controller {
	return &nftController{
		authSvc:  authSvc,
		storeSvc: storeSvc,
		userSvc:  userSvc,
	}
}

func (c *nftController) Pattern() string {
	return "/nft"
}

func (c *nftController) Handler() http.Handler {
	mux := chi.NewRouter()

	mux.Group(func(r chi.Router) {
		r.Use(middlewares.AccessTokenRequired(c.authSvc))
		r.Post("/mint", c.mintNFT)
	})

	return mux
}

// mintNFT handles POST /nft/mint
func (c *nftController) mintNFT(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(middlewares.UserIDKey).(int32)
	name := r.FormValue("name")
	description := r.FormValue("description")
	image, header, err := r.FormFile("image")
	if err != nil {
		zap.L().Error("failed to get image file", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusBadRequest)
		return
	}
	defer image.Close()

	imageURL, err := c.storeSvc.UploadFile(r.Context(), header.Filename, image)
	if err != nil {
		zap.L().Error("failed to upload image", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	nftID, err := c.userSvc.MintNFT(r.Context(), userID, name, description, imageURL)
	if err != nil {
		zap.L().Error("failed to mint nft", zap.Error(err))
		utils.ErrorJSON(w, err, http.StatusInternalServerError)
		return
	}

	var resp models.MintNFTResponse
	resp.CommonResponse = models.CommonResponse{
		Status:  http.StatusOK,
		Message: "NFT minted successfully",
	}
	resp.TokenID = nftID

	_ = utils.WriteJSON(w, http.StatusOK, resp)
}
