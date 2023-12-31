const Web3 = require("web3");
const abiSource = require("../abi/NFTLootBox.json");
const abiSourceERC20 = require("../abi/ICToken.json");
const models = require("../models");
const varEnv = require("../config/var");
const pinataSDK = require("@pinata/sdk");
const updateTransaction = require('./UpdateTransaction');

//nftCreate
exports.createNFT = async (req, res) => {
  try {
    //pinata 객체 생성
    const pinata = new pinataSDK(varEnv.pinataAPI, varEnv.pinataSecret);
    const { name, description, image, user_id } = req.body;

    //name image user_id는 필수!
    if (!name || !image || !user_id){
      res.status(400).json({message: 'Invalid request'});
    }

    const abi = abiSource.abi;
    const abiERC20 = abiSourceERC20.abi;

    // Ethereum 네트워크에 연결
    const web3 = new Web3(varEnv.rpcURL); // Ganache URL

    // 컨트랙트 객체 생성
    const contract = new web3.eth.Contract(abi, varEnv.erc721ContractAddress);
    const contractERC20 = new web3.eth.Contract(
      abiERC20,
      varEnv.contractAddress
    );

    //사용자 정보 찾기
    const findWallets = await models.Wallets.findOne({
      where: { user_id: user_id },
    });

    //사용자 정보
    const data = findWallets.dataValues;

    //만약 보유 토큰이 20보다 작다면 사용자는 토큰을 구매(민팅할 수가 없다.)
    if (data.token_amount < 20) {
      return res.status(400).json({ message: "Insufficient token balance" });
    } else {
      //만약 많다면 NFT 발행 가능

      //createButton을 누르면 메타 마스크처럼 뭔가 창이 하나 떠서 확인버튼을 누를 수 있게끔하면 좋을거 같음
      const tokenSet = await contract.methods
        .setToken(varEnv.contractAddress)
        .send({ from: varEnv.senderAddress });

      //만약 토큰이 등록 되었다면
      if (tokenSet) {
        updateTransaction("token");
        console.log("토큰 등록 완료!");
      } else {
        console.log("토큰 등록 실패");
        return res.status(400).json({ message: "setToken is failed.." });
      }

      //토큰 인출량 허용
      const tokenApprove = await contractERC20.methods
        .approve(data.address, 20)
        .send({ from: varEnv.senderAddress });

      updateTransaction("token");

      // 이미지 파일 pinata에 업로드
      const photoResult = await pinata.pinJSONToIPFS({ image_url: image });
      console.log(
        "Photo uploaded successfully. IPFS Hash:",
        photoResult.IpfsHash
      );

      // NFT 메타 데이터 생성 및 Pinata에 업로드
      const nftMetadata = {
        name: name,
        description: description,
        token_metadata: `ipfs://${photoResult.IpfsHash}`,
        image_url: image,
      };

      const metadataResult = await pinata.pinJSONToIPFS(nftMetadata); //pinata에 업로드. -> 완료시 아래 코드에서 반환된 IpfsHash 출력.
      console.log(
        "Metadata uploaded successfully. IPFS Hash:",
        metadataResult.IpfsHash
      );

      const tokenURI = `ifps://${metadataResult.IpfsHash}`;

      // 사용자 지갑과 컨트랙트 객체 연결
      const userWallet = web3.eth.accounts.privateKeyToAccount(
        data.private_key
      );
      const connectedContract = contract.clone();
      connectedContract.setProvider(web3.currentProvider);
      connectedContract.options.address = varEnv.erc721ContractAddress;
      connectedContract.options.from = userWallet.address;

      // 트랜잭션 서명을 위한 지갑 설정
      web3.eth.accounts.wallet.add(userWallet);

      const mintResult = await contract.methods
        .mintNFT(data.address, tokenURI, varEnv.senderAddress)
        .send({ from: userWallet.address, gas: 3000000 }); //유저가 가스비 부담 및  트랜잭션 서명

      //status: pending

      //지갑 연결 해제
      web3.eth.accounts.wallet.remove(userWallet);

      if (mintResult) {
        //민팅에 성공한다면
        //일단 데이터 베이스에 nft정보들 업로드
        console.log('NFT minting success!');
        const createNFTData = await models.nfts.create({
          user_id: user_id,
          owner_address: data.address,
          token_id: mintResult.events.Transfer.returnValues.tokenId,
          token_uri: tokenURI,
          price: 20,
          name: name,
          description: description,
          image: image
        });
        //가스비 및 토큰 사용했기 때문에 데이터 베이스에 업로드 후 메인 서버로 변동 사항 반환
        if (createNFTData) {
          const token_amount = await contractERC20.methods
            .balanceOf(data.address)
            .call();
          const eth_amount = web3.utils.fromWei(
            await web3.eth.getBalance(data.address),
            "wei"
          );
          const updateWalletData = await models.Wallets.update(
            { token_amount: token_amount, eth_amount: eth_amount },
            {
              where: {
                user_id: data.user_id,
              },
            }
          );
          console.log('Data update success!');
          updateTransaction("nft");
          res.status(200).json({
            message: "OK",
            token_id: Number(mintResult.events.Transfer.returnValues.tokenId),
            eth_amount: eth_amount,
            token_amount: token_amount,
          });
        } else {
          console.log("data upload is failed..");
          return res.status(400).json({ message: "data upload is failed.." });
        }
      }else{
        return res.status(400).json({message: 'NFT minting is failed..'})
      }
    }
  } catch (error) {
    // NFT mint 실패
    console.log(error);
    res.status(500).json({ error: error });
  }
};
