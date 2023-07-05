const Web3 = require('web3');
const abiSource = require('../../contract/build/contracts/NFTLootBox.json');
const models = require('../models.js');
const varEnv = require('../config/var.js');
const pinataSDK = require('@pinata/sdk');

//nftCreate
exports.createNFT = async(req,res) => {
    try{
        // 1. main server로 부터 nft를 민팅하려는 유저 정보(user_id)와 client에 입력된
        //    nft 정보(image, name, description)를 받는다
        // 2. 데이터 베이스에서 해당 유저의 지갑 정보(address, privateKey)를 가져온다
        //      setToken함수로 사용할 토큰 타입 지정
        // 3. 정보를 pinata에 업로드 후 tokenURI 반환 받는다.
        //    (1. 사진 먼저 업로드, 사진 CID 반환 2. metadata객체에 사진 CID와 나머지 정보를 담아 업로드, 
        //     최종 tokenURI 반환) 
        // 4. 컨트랙트 객체와 지갑비밀키 연결(트랜잭션 서명자 지정) XXXX(send: from만 지정해주면 됨)
        // 5. contract.methods.mintNFT(발행자, tokenURI).send() 실행(구매하는게 아니기 때문에 아직 setToken필요 X)
        // 6. 트랜잭션이 성공적으로 실행되면 데이터 베이스에 nft 정보들 저장
        // 7. 서명자는 가스비를 썼기 때문에 eth_amount도 최신화
        // 8. NFT price는 일단 고정 (100e18)
        // 9. client에 바로 성공 메세지 전송??? 아니면 main 서버 거쳐서(굳이??)

        //pinata 객체 생성
        const pinata = new pinataSDK(varEnv.pinataAPI, varEnv.pinataSecret); 
        const {name, description, image, user_id} = req.body; 

        const abi = abiSource.abi;

         // Ethereum 네트워크에 연결
        const web3 = new Web3('http://127.0.0.1:7545'); // Ganache URL

        // 컨트랙트 객체 생성
        const contract = new web3.eth.Contract(abi, varEnv.erc721ContractAddress);

        // 구매(민팅)에 사용할 토큰 지정
        const setToken = await contract.methods.setToken(varEnv.contractAddress);

        //사용자 정보 찾기
        const findWallets = await models.Wallets.findOne({
            where : {user_id : user_id}
        });

        //사용자 정보
        const data = findWallets.dataValues;

        //만약 보유 토큰이 20보다 작다면 사용자는 토큰을 구매(민팅할 수가 없다.)
        if (data.token_amount<20){
            res.status(400).json({message: 'Insufficient token balance'});
        }else{
            //만약 많다면 NFT 발행 가능!
            //일단 토큰 URI를 얻어야함
            //구매자는 토큰만 지불! 가스비는 서버 계정이 지불 === 서버 계정이 트랜잭션 서명???
            //createButton을 누르면 메타 마스크처럼 뭔가 창이 하나 떠서 확인버튼을 누를 수 있게끔하면 좋을거 같음
            const tokenSet = await contract.methods.tokenSet(varEnv.contractAddress).send({from: varEnv.senderAddress});
            if (tokenSet){
                console.log('토큰 등록 완료!');
            }else{
                console.log('토큰 등록 실패');
                res.status(400).json({message: 'tokenSet is failed..'})
            }
            // 이미지 파일 pinata에 업로드
            const photoResult = await pinata.pinJSONToIPFS({ image_url: image});
            console.log('Photo uploaded successfully. IPFS Hash:', photoResult.IpfsHash)  ; 

            // NFT 메타 데이터 생성 및 Pinata에 업로드
            // TODO : 이 객체 형식은 opensea에서만 유효한가??
            const nftMetadata = {
                name: name,
                description: description,
                token_metadata: `ipfs://${photoResult.IpfsHash}`,
                image_url: image,
              };

            const metadataResult = await pinata.pinJSONToIPFS(nftMetadata); //pinata에 업로드. -> 완료시 아래 코드에서 반환된 IpfsHash 출력. 
            console.log('Metadata uploaded successfully. IPFS Hash:', metadataResult.IpfsHash);

            const tokenURI = `ifps://${metadataResult.IpfsHash}`;

            const mintResult = await contract.methods.mintNFT(data.address, tokenURI).send({from: varEnv.senderAddress});
            if (mintResult){ //민팅에 성공한다면
                //일단 데이터 베이스에 nft정보들 업로드
                const createNFTData = await models.nfts.create({
                    user_id: user_id,
                    owner_address: data.address,
                    token_id: mintResult, //TODO : 이 값이 토큰 id를 반환하는지 확인 해야함!
                    token_uri: tokenURI,
                    price: 20,
                })
                if (createNFTData){
                    console.log(createNFTData);
                    res.status(200).json({message: 'OK', token_id: mintResult})
                }else{
                    console.log('data upload is failed..');
                    res.status(400).json({message: 'data upload is failed..'});
                }
            //TODO : 토큰을 썻기 떄문에 사용자의 토큰 수량 wallet에 업데이트, main-server 데이터 베이스에도 업로드
            //해줘야 하기 때문에 response에 업데이트 후 사용자 토큰 수량 전송!! 이 부분 만들어야함
            }
        }

    }catch(error){
        // NFT mint 실패
        console.log(error);
        res.status(500).json({ error : 'NFT 민팅에 실패했습니다.'});
    }
}

