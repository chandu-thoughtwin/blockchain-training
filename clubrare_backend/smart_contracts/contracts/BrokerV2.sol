pragma solidity ^0.5.17;
pragma experimental ABIEncoderV2;
import "./brokerV2_utils/BrokerModifiers.sol";


contract BrokerV2 is ERC721Holder, BrokerModifiers {
    // events
    event Bid(
        address indexed collection,
        uint256 indexed tokenId,
        address indexed seller,
        address bidder,
        uint256 amouont,
        uint256 time,
        address ERC20Address
    );
    event Buy(
        address indexed collection,
        uint256 tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 amount,
        uint256 time,
        address ERC20Address
    );
    event Collect(
        address indexed collection,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        address collector,
        uint256 time,
        address ERC20Address
    );
    event OnSale(
        address indexed collection,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 auctionType,
        uint256 amount,
        uint256 time,
        address ERC20Address
    );
    event PriceUpdated(
        address indexed collection,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 auctionType,
        uint256 oldAmount,
        uint256 amount,
        uint256 time,
        address ERC20Address
    );
    event OffSale(
        address indexed collection,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 time,
        address ERC20Address
    );

    mapping(address => uint256) brokerageBalance;

    constructor(uint16 _brokerage ,uint256 _updatedTime) public {
        brokerage = _brokerage;
        setUpdatedClosingTime(_updatedTime);
        transferOwnership(msg.sender);
    }

    function addERC20TokenPayment(address _erc20Token) public onlyOwner {
        erc20TokensArray.addERC20Tokens(_erc20Token);
    }

    function removeERC20TokenPayment(address _erc20Token)
        public
        erc20Allowed(_erc20Token)
        onlyOwner
    {

        erc20TokensArray.removeERC20Token(_erc20Token);
    }

    function bid(
        uint256 tokenID,
        address _mintableToken,
        uint256 amount
    )
        public
        payable
        onSaleOnly(tokenID, _mintableToken)
        activeAuction(tokenID, _mintableToken)
    {
        IMintableToken Token = IMintableToken(_mintableToken);

        auction memory _auction = auctions[_mintableToken][tokenID];

        if (_auction.erc20Token == address(0)) {
            require(
                msg.value > _auction.currentBid,
                "Insufficient bidding amount."
            );

            if (_auction.buyer == true) {
                _auction.highestBidder.transfer(_auction.currentBid);
            }
        } else {
            IERC20 erc20Token = IERC20(_auction.erc20Token);
            require(
                erc20Token.allowance(msg.sender, address(this)) >= amount,
                "Allowance is less than amount sent for bidding."
            );
            require(
                amount > _auction.currentBid,
                "Insufficient bidding amount."
            );
            erc20Token.transferFrom(msg.sender, address(this), amount);

            if (_auction.buyer == true) {
                erc20Token.transfer(
                    _auction.highestBidder,
                    _auction.currentBid
                );
            }
        }

        _auction.currentBid = _auction.erc20Token == address(0)
            ? msg.value
            : amount;

        Token.safeTransferFrom(Token.ownerOf(tokenID), address(this), tokenID);
        _auction.buyer = true;
        _auction.highestBidder = msg.sender;
        _auction.closingTime += updateClosingTime;
        auctions[_mintableToken][tokenID] = _auction;

        // Bid event
        emit Bid(
            _mintableToken,
            tokenID,
            _auction.lastOwner,
            _auction.highestBidder,
            _auction.currentBid,
            block.timestamp,
            _auction.erc20Token
        );
    }
    // Collect Function are use to collect funds and NFT from Broker
    function collect(uint256 tokenID, address _mintableToken)
        public
    {
        IMintableToken Token = IMintableToken(_mintableToken);
        auction memory _auction = auctions[_mintableToken][tokenID];
        TokenDetArrayLib.TokenDet memory _tokenDet = TokenDetArrayLib.TokenDet(_mintableToken,tokenID);

        require(
            block.timestamp > _auction.closingTime,
            "Auction Not Over!"
        );

        address payable lastOwner2 = _auction.lastOwner;
        uint256 royalities = Token.royalities(tokenID);
        address payable creator = Token.creators(tokenID);

        uint256 royality = (royalities * _auction.currentBid) / 10000;
        uint256 brokerageAmount = (brokerage * _auction.currentBid) / 10000;

        // uint256 lastOwner_funds = ((10000 - royalities - brokerage) *
        //     _auction.currentBid) / 10000;

        uint256 lastOwner_funds = _auction.currentBid - royality - brokerageAmount;
        
        if (_auction.buyer == true) {
            if (_auction.erc20Token == address(0)) {
                creator.transfer(royality);
                lastOwner2.transfer(lastOwner_funds);
            } else {
                IERC20 erc20Token = IERC20(_auction.erc20Token);
                // transfer royalitiy to creator
                erc20Token.transfer(creator, royality);
                erc20Token.transfer(lastOwner2, lastOwner_funds);
            }
            brokerageBalance[_auction.erc20Token] += brokerageAmount;
            tokenOpenForSale[_mintableToken][tokenID] = false;
            Token.safeTransferFrom(
                Token.ownerOf(tokenID),
                _auction.highestBidder,
                tokenID
            );

            // Buy event
            emit Buy(
                _tokenDet.NFTAddress,
                _tokenDet.tokenID,
                lastOwner2,
                _auction.highestBidder,
                _auction.currentBid,
                block.timestamp,
                _auction.erc20Token
            );
        }

        // Collect event
        emit Collect(
            _tokenDet.NFTAddress,
            _tokenDet.tokenID,
            lastOwner2,
            _auction.highestBidder,
            msg.sender,
            block.timestamp,
            _auction.erc20Token
        );

        tokensForSale.removeTokenDet(_tokenDet);

        tokensForSalePerUser[lastOwner2].removeTokenDet(_tokenDet);
        auctionTokens.removeTokenDet(_tokenDet);
        delete auctions[_mintableToken][tokenID];
    }

    function buy(uint256 tokenID, address _mintableToken)
        public
        payable
        onSaleOnly(tokenID, _mintableToken)
        flatSaleOnly(tokenID, _mintableToken)
    {
        IMintableToken Token = IMintableToken(_mintableToken);
        auction memory _auction = auctions[_mintableToken][tokenID];
        TokenDetArrayLib.TokenDet memory _tokenDet = TokenDetArrayLib.TokenDet(_mintableToken,tokenID);
        
        address payable lastOwner2 = _auction.lastOwner;
        uint256 royalities = Token.royalities(tokenID);
        address payable creator = Token.creators(tokenID);
        uint256 royality = (royalities * _auction.buyPrice) / 10000;
        uint256 brokerageAmount = (brokerage * _auction.buyPrice) / 10000;

        uint256 lastOwner_funds = _auction.buyPrice - royality - brokerageAmount;

        if (_auction.erc20Token == address(0)) {
            require(msg.value >= _auction.buyPrice, "Insufficient Payment");

            creator.transfer(royality);
            lastOwner2.transfer(lastOwner_funds);


        } else {
            IERC20 erc20Token = IERC20(_auction.erc20Token);
            require(
                erc20Token.allowance(msg.sender, address(this)) >=
                    _auction.buyPrice,
                "Insufficient spent allowance "
            );
            // transfer royalitiy to creator
            erc20Token.transferFrom(msg.sender, creator, royality);
            // transfer brokerage amount to broker
            erc20Token.transferFrom(msg.sender, address(this), brokerageAmount);
            // transfer remaining  amount to lastOwner
            erc20Token.transferFrom(msg.sender, lastOwner2, lastOwner_funds);
        }
        brokerageBalance[_auction.erc20Token] += brokerageAmount;

        tokenOpenForSale[_tokenDet.NFTAddress][_tokenDet.tokenID] = false;
        // _auction.buyer = true;
        // _auction.highestBidder = msg.sender;
        // _auction.currentBid = _auction.buyPrice;

        Token.safeTransferFrom(
            Token.ownerOf(_tokenDet.tokenID),
            // _auction.highestBidder,/
            msg.sender,
            _tokenDet.tokenID
        );

        // Buy event
        emit Buy(
            _tokenDet.NFTAddress,
            _tokenDet.tokenID,
            lastOwner2,
            msg.sender,
            _auction.buyPrice,
            block.timestamp,
            _auction.erc20Token
        );

        tokensForSale.removeTokenDet(_tokenDet);
        tokensForSalePerUser[lastOwner2].removeTokenDet(_tokenDet);

        fixedPriceTokens.removeTokenDet(_tokenDet);
        delete auctions[_tokenDet.NFTAddress][_tokenDet.tokenID];
    }

    function withdraw() public onlyOwner {
        msg.sender.transfer(brokerageBalance[address(0)]);
        brokerageBalance[address(0)] = 0;
    }

    function withdrawERC20(address _erc20Token) public onlyOwner {
        require(
            erc20TokensArray.exists(_erc20Token),
            "This erc20token payment not allowed"
        );
        IERC20 erc20Token = IERC20(_erc20Token);
        erc20Token.transfer(msg.sender, brokerageBalance[_erc20Token]);
        brokerageBalance[_erc20Token] = 0;
    }
 function putOnSale(
        uint256 _tokenID,
        uint256 _startingPrice,
        uint256 _auctionType,
        uint256 _buyPrice,
        uint256 _startingTime,
        uint256 _closingTime,
        address _mintableToken,
        address _erc20Token
    )
        public
        erc20Allowed(_erc20Token)
        tokenOwnerOnlly(_tokenID, _mintableToken)
    {
       IMintableToken Token = IMintableToken(_mintableToken);
    //   uint256 _ID =_tokenID;
    //   uint256 _aucType =_auctionType;
    //   uint256 _startPrice= _startingPrice;
        auction memory _auction = auctions[_mintableToken][_tokenID];

        // Allow to put on sale to already on sale NFT \
        // only if it was on auction and have 0 bids and auction is over
        if (tokenOpenForSale[_mintableToken][_tokenID] == true) {
            require(
                _auction.auctionType == 2 &&
                    _auction.buyer == false &&
                    block.timestamp > _auction.closingTime,
                "This NFT is already on sale."
            );
        }
        TokenDetArrayLib.TokenDet memory _tokenDet = TokenDetArrayLib.TokenDet(_mintableToken, _tokenID);
        auction memory newAuction = auction(
            msg.sender,
            _startingPrice,
            address(0),
            _auctionType,
            _startingPrice,
            _buyPrice,
            false,
            _startingTime,
            _closingTime,
            _erc20Token
        );
       
        require(
            Token.getApproved(_tokenDet.tokenID) == address(this),
            "Broker Not approved"
        );
        require(
            _closingTime > _startingTime,
            "Closing time should be greater than starting time!"
        );
        auctions[_tokenDet.NFTAddress][_tokenDet.tokenID] = newAuction;
        

        // Store data in all mappings if adding fresh token on sale
        if (tokenOpenForSale[_tokenDet.NFTAddress][_tokenDet.tokenID] == false) {
            tokenOpenForSale[_tokenDet.NFTAddress][_tokenDet.tokenID] = true;

            tokensForSale.addTokenDet(_tokenDet);
            tokensForSalePerUser[msg.sender].addTokenDet(_tokenDet);

            // Add token to fixedPrice on Timed list
            if (_auctionType == 1) {
                fixedPriceTokens.addTokenDet(_tokenDet);
            } else if (_auctionType == 2) {
                auctionTokens.addTokenDet(_tokenDet);
            }
        }

        // OnSale event
        emit OnSale(
            _tokenDet.NFTAddress,
            _tokenDet.tokenID,
            msg.sender,
            newAuction.auctionType,
            newAuction.auctionType == 1 ? newAuction.buyPrice : newAuction.startingPrice,
            block.timestamp,
            newAuction.erc20Token
        );
    }
    function updatePrice(
        uint256 tokenID,
        address _mintableToken,
        uint256 _newPrice,
        address _erc20Token
    )
        public
        onSaleOnly(tokenID, _mintableToken)
        erc20Allowed(_erc20Token)
        tokenOwnerOnlly(tokenID, _mintableToken)
    {
        // IMintableToken Token = IMintableToken(_mintableToken);
        auction memory _auction = auctions[_mintableToken][tokenID];

        if (_auction.auctionType == 2) {
            require(
                block.timestamp < _auction.closingTime,
                "Auction Time Over!"
            );
        }
        emit PriceUpdated(
            _mintableToken,
            tokenID,
            _auction.lastOwner,
            _auction.auctionType,
            _auction.auctionType == 1
                ? _auction.buyPrice
                : _auction.startingPrice,
            _newPrice,
            block.timestamp,
            _auction.erc20Token
        );
        // Update Price
        if (_auction.auctionType == 1) {
            _auction.buyPrice = _newPrice;
        } else {
            _auction.startingPrice = _newPrice;
            _auction.currentBid = _newPrice;
        }
        _auction.erc20Token = _erc20Token;
        auctions[_mintableToken][tokenID] = _auction;
    }

    function putSaleOff(uint256 tokenID, address _mintableToken)
        public
        tokenOwnerOnlly(tokenID, _mintableToken)
    {
        // IMintableToken Token = IMintableToken(_mintableToken);
        auction memory _auction = auctions[_mintableToken][tokenID];
        TokenDetArrayLib.TokenDet memory _tokenDet = TokenDetArrayLib.TokenDet(_mintableToken,tokenID);
        tokenOpenForSale[_mintableToken][tokenID] = false;

        // OffSale event
        emit OffSale(
            _mintableToken,
            tokenID,
            msg.sender,
            block.timestamp,
            _auction.erc20Token
        );

        tokensForSale.removeTokenDet(_tokenDet);

        tokensForSalePerUser[msg.sender].removeTokenDet(_tokenDet);
        // Remove token from list
        if (_auction.auctionType == 1) {
            fixedPriceTokens.removeTokenDet(_tokenDet);
        } else if (_auction.auctionType == 2) {
            auctionTokens.removeTokenDet(_tokenDet);
        }
        delete auctions[_mintableToken][tokenID];
    }

    function getOnSaleStatus(address _mintableToken, uint256 tokenID)
        public
        view
        returns (bool)
    {
        return tokenOpenForSale[_mintableToken][tokenID];
    }
}
