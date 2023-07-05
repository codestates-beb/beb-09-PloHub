// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

import "./ERC20.sol";
import "./ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace{
    /*
        1. ERC20, ERC721 컨트랙트 연결
        2. ERC20 보상지급
        3. ERC20 유저간 교환 기능
        4. NFT 발행
    */

    // 상태 변수
    ERC20Token token20;
    ERC721Token token721;
    uint256 public itemCount;
    uint256 public tokenCnt;
    string public token20Name;
    string public token721Name;
    string public token20Symbol;
    string public token721Symbol;
    uint256 private tokenBenefit;
    int fee;


    constructor(){
        fee = 1;
        token20 = new ERC20Token(address(this));
        token721 = new ERC721Token();
        token20Name = token20.name();
        token721Name = token721.name();
        token20Symbol = token20.symbol();
        token721Symbol = token721.symbol();
    }

    /*
     * @ dev : Marketplace에 민팅된 NFTs
     * @ Desc : Marketplace에 민팅된 NFTs
    */
    struct NFT_List{
        int itemId;
        string tokenURI;
        int price;
        address payable seller;
        bool sold;
    }

    mapping(int => NFT_List) items;

    modifier onlyOwner(address _address){
        require(_address == msg.sender);
        _;
    }

    event Token20Set(
        ERC20Token token,
        address tokenAddress,
        bool result
    );

    event Token721Set(
        ERC721Token token,
        address tokenAddress,
        bool result
    );
    
    event TokenBenefitSuccess(
        address actor,
        uint amount,
        bool result
    );

    event NFTOffered(
        int itemId,
        string tokenURI,
        int price,
        address indexed seller,
        bool sold
    );

    event NFTBought(
        int itemId,
        string tokenURI,
        int price,
        address indexed seller,
        address indexed buyer,
        bool sold
    );

    /*
     * @ dev : ERC-20 연결
     * @ Desc : Marketplace 컨트랙트에서 ERC20 토큰을 사용하기 위한 연결작업 
    */
    function setERC20Token(address contractAddress) public returns(bool){
        require(contractAddress != address(0x0));
        token20 = ERC20Token(contractAddress);

        emit Token20Set(token20, contractAddress, true);

        return true;
    }
    
    /*
     * @ dev : ERC-721 연결
     * @ Desc : Marketplace 컨트랙트에서 ERC721 토큰을 사용하기 위한 연결작업 
    */
    function setERC721Token(address contractAddress) public returns(bool){
        require(contractAddress != address(0x0));
        token721 = ERC721Token(contractAddress);

        emit Token721Set(token721, contractAddress, true);
        return true;
    }

    /*
     * @ dev : ERC-20 토큰 교환
     * @ Desc : 유저끼리 ERC20 토큰을 교환할 수 있다. 송신 유저는 자신이 보유하고 있는 토큰 이상의 토큰을 
                전송할 수 없다.
    */
    function ERC20_Transfer_User2User(address _to, uint256 _amount) public payable returns(bool){
        require(_to != address(0x0));
        require(_amount > 0 && token20.balanceOf(msg.sender) >= _amount);

        token20.exchangeERC20(msg.sender, _to, _amount);

        return true;
    }

    /*
     * @ dev : ERC-20 토큰 지급
     * @ Desc : 유저가 글을 발행하거나, NFT를 발행하는 등 토큰 이코노미에 부합하는 action을 취했을 때 
     *           컨트랙트로 부터 토큰이 지급된다. 
     * @ Requirements : 
     *                  1. _benefit == 101 : 글 발행 보상 (10 Token)
     *                  2. _benefit == 201 : 댓글 작성 보상 (3 Token)
     *                  3. _benefit == 301 : 좋아요 클릭 보상 (1 Token)
     *                  4. _benefit == 401 : 최초 지급 코드 (100 Token)
    */

    function ERC20_Provider(int _benefit) public payable returns(bool){
        require(msg.sender != address(0x0));

        if(_benefit == 101){
            tokenBenefit = 10;
        }else if(_benefit == 201){
            tokenBenefit = 3;
        }else if(_benefit == 301){
            tokenBenefit = 1;
        }else if (_benefit == 401){
            tokenBenefit = 100;
            require(token20.balanceOf(msg.sender) == 0, "Initial Provide Required");
        }

        token20.transferERC20(address(this), msg.sender, tokenBenefit);
        
        emit TokenBenefitSuccess(msg.sender, tokenBenefit, true);
        return true;
    }

    /*
     * @ dev : ERC-721 Item Creation
     * @ Desc : 유저는 본인이 가진 ERC20 토큰으로 NFT를 발행할 수 있다.
     * @ Requirements : 
            - Node.js에서 setApproveForAll() 함수를 실행해서, Marketplace 컨트랙트에 위임해야됨
            - NFT 민팅 createERC721Token() 실행하여 Marketplace에서 관리하는 NFT 추가 필요
    */
    function createERC721Token(string memory _tokenURI, int _price) public returns(bool){
        require(_price >= 0, "Price should be greater then zero");

        // item은 1 증가
        itemCount++;

        // ERC721 토큰 발행
        tokenCnt = token721.mintNFT(msg.sender, _tokenURI);

        // NFT 등록
        items[int(itemCount)] = NFT_List(int(itemCount), _tokenURI, _price, payable(msg.sender), true);

        // NFT 등록 완료 이벤트
        emit NFTOffered(int(itemCount), _tokenURI, _price, msg.sender, true);

        return true;
    }

    /*
     * @ dev : ERC-721 컨트랙트에 위탁
     * @ Desc : 유저는 본인이 가진 ERC721 토큰을 컨트랙트에 위탁할 수 있다.
    */

    function setAllNFTsToContract() external{
        token721.setApprovalForNFTs(msg.sender);

        // seller가 팔기를 해야 마켓에서 구매가능.
        for(int i=1; i<=int(itemCount); i++){
            if(items[i].seller == payable(msg.sender)){
                items[i].sold = false;
            }
        }
    }

   
    /*
     * @ dev : ERC-721 구매
     * @ Desc : 유저는 본인이 가진 ERC20 토큰으로 NFT를 구매할 수 있다.
    */

    function buyERC721Token(int _itemId) external payable {
        NFT_List memory item = items[_itemId];

        require(token20.balanceOf(msg.sender) > getTotalPrice(_itemId), "Buyer should have more money than NFT");
        require(msg.sender != item.seller, "Buyer should not be the same to Seller"); 
        require(_itemId > 0 && _itemId <= int(itemCount), "Buyer can perchase NFT that is listed now" );
        require(item.sold == false, "Item should be In-stock state");

        // 1. 구매자는 컨트랙트에 fee를 포함한 금액을 가지고 있어야 함.
        // 2. 구매자가 보유한 ERC20 토큰은 seller에게 전송됨
        token20.exchangeERC20(msg.sender, item.seller, uint256(item.price));
        // 3. Marketplace 컨트랙트에 Fee를 내야함.
        token20.transferERC20(msg.sender, address(this), uint256(fee));
        // 4. NFT Token의 소유권을 구매자로 변경
        token721.tokenTrasferFrom(item.seller, msg.sender, uint256(_itemId));
        // 5. NFT는 sold-out
        items[_itemId].sold = true;
        // 7. NFT seller(owner) 변경
        items[_itemId].seller = payable(msg.sender);
        // 6. 거래 완료 이벤트 발생
        emit NFTBought(_itemId, item.tokenURI, item.price, item.seller, msg.sender, true);
        
    }

    function getItemSeller(int _itemId) external view returns(address){
        return items[_itemId].seller;
    }

    
    /*
     * @ dev : NFT Item Total Price
     * @ Desc : fee와 NFT 가격을 포함한 NFT 구매시 필요한 총액을 반환
    */
    function getTotalPrice(int _itemId) private returns(uint256){
        uint256 totalPrice = uint256(items[_itemId].price + fee);

        return totalPrice;
    }

    /*
     * @ dev : ERC20 잔액확인
     * @ Desc : 해당 계정의 ERC20 잔액을 확인할 수 있다.
    */
    function getBalanceOfERC20(address _address) public view onlyOwner(_address) returns(uint256){
        uint256 _balanceOf = token20.balanceOf(_address);

        return _balanceOf;
    }

    /*
     * @ dev : ERC721 소유확인
     * @ Desc : 발행된 NFT의 소유자를 확인할 수 있다.
    */
    function getOwnerOfERC721(uint256 _tokenId) public view returns(address){
        address _ownerOf = token721.ownerOf(_tokenId);

        return _ownerOf;
    }

    /*
     * @ dev : ERC721 판매권 양도 확인
     * @ Desc : 발행된 NFT의 양도상황을 확인할 수 있다.
    */
    function getIsApprovedForAll(address _owner, address _operator) public view returns(bool){
        bool isApproved = token721.isApprovedForAll(_owner, _operator);
        return isApproved;
    }

    /*
     * @ dev : ERC721토큰의 tokenURI 반환
     * @ Desc : 발행된 NFT에 설정된 tokenURI를 확인할 수 있다.
    */
    function getTokenURIERC721(int _itemId) public view returns(string memory){
        string memory _tokenURI = items[_itemId].tokenURI;
        return _tokenURI;
    }

}