# Cluberare NFT MarketPlace(backend)

A Cluberare is Blockchain based NFT MarketPlace Dapp, where users can create NFT
Then they can buy and sale NFT on this platform. This is a backend of the Dapp.

## List of smart contracts

- ### Mintable smart contract [Link](https://rinkeby.etherscan.io/address/0xf9cc25b179e062914fbe508287f46f65d3511148#writeContract) :

  This smart contract are used to mint the NFTs.

  ### Functions

  - Function-name : mint

    arguments

    ```bash
        tokenURI(string)
        _royality(uint256)

    ```

        _return None

        Description : This function are used to mint the NFTs with the given parameters.

  - Function-name : burn

    arguments

  ```bash
      tokenId(uint256)

  ```

         _return None
        Description : This function are used to burn the NFT, need a token id as argument.

* Function-name : approve

  arguments

```bash
    to(address)
    tokenId(uint256)
```

        _return None
        Description : This function are used to Approve the third person to spend NFT token on behalf of owner, need a token id and to address as argument.

- Function-name : safeTransferFrom

  arguments

```bash
    from(address)
    to(address)
    tokenId(uint256)

```

    _return None
    Description : This function are used to  Transfer NFT token , need a token id from and to address as argument.This function can call owner or approved address.

- Function-name : safeTransferFrom (with extra args)

  arguments

```bash
    from(address)
    to(address)
    tokenId(uint256)
   _data(bytes)
```

        _return None
        Description :
        This function are used to  Transfer NFT token , need a token id from and to address as argument it also take optional data argument(need 0x as arg)  .This function can call owner or approved address

- Function-name : transferFrom

  arguments

```bash
    from(address)
    to(address)
    tokenId(uint256)

```

        _return None
        Description :This function are used to  Transfer NFT token , need a token id from and to address as argument.This function can call owner or approved address.

- Function-name : setApprovalForAll

  arguments

```bash
   to (address)

   approved(bool)

```

        _return None

        Description : This function are used to Approve the third person to spend ALL NFT token on behalf of owner, need a token id and to to address as argument.

- Function-name : setContractUri

  arguments

```bash
   contractURI(string)

```

        _return None

        Description :
        Description : This function are used to Set Contract uri , need a string uri  as argument. only owner can call this function.

- Function-name : setTokenURIPrefix

  arguments

```bash
   tokenURIPrefix(string)
```

        _return None

        Description : This function are used to Set token uri prefix, need a string uri prefix as argument. only owner can call this function.

- Function-name : transferOwnership

  arguments

  ```bash
    newOwner(address)
  ```

        _return None

        Description :
        Description : This function are used to Transfer Ownership, need a address of new owner  as argument. only owner can call this function.

- Function-name : renounceOwnership

  arguments

  ```bash
    None
  ```

        _return None

        Description :  This function are used to Renounce Ownership,  only owner can call this function.

###### Read only functions

Checkout contract read only functions [Here](https://rinkeby.etherscan.io/address/0xf9cc25b179e062914fbe508287f46f65d3511148#readContract)

- #### Borker smart contract :

  This smart contract are used to buy and sell mintable NFTs with native currency only.

  #### Functions

  - Function-name : buy

  arguments

  ```bash
      buy payableAmount (ether)
      tokenID (uint256)
      _mintableToken (address)

  ```

        _return None

        Description :  This function are used to Buy NFT Token which is on sale , need tokenID , NFT contract address or payable amount greater than sale amount.

  - Function-name : bid

  arguments

  ```bash

      bid payableAmount (ether)
      tokenID (uint256)
      _mintableToken (address)

  ```

        _return None

        Description :  This function are used to Bid NFT Token which is on sale , need tokenID , NFT contract address or payable amount greater than sale  current bid amount.

  - Function-name : putOnSale

  arguments

  ```bash
      tokenID (uint256)
      _startingPrice (uint256)
      _auctionType (uint256)
      _buyPrice (uint256)
      _duration (uint256)
      _mintableToken (address)

  ```

        _return None

        Description :  This function are used to Put NFT Token  on sale , need tokenID , NFT contract address _auctionType , start price if  2nd type _auctionType ,buy price if 1st type _auctionType, duration, as argument.

  - Function-name : putOffSale

  arguments

  ```bash
      tokenID (uint256)
      _mintableToken (address)

  ```

        _return None

        Description :  This function are used to Put off NFT Token which is on sale , need tokenID , NFT contract address as argument.

  - Function-name : collect

  arguments

  ```bash
      tokenID (uint256)
      _mintableToken (address)
  ```

        _return None

        Description :  This function are used to collect NFT Token which is on sale time is over , need tokenID , NFT contract address as argument.

  - Function-name : setBrokerage

  arguments

  ```bash
    _brokerage (uint16)

  ```

        _return None

        Description :  This function are used to Set Brokerage on NFTs which comes on sale , brokerage amount as argument only admin can call this function.

- Function-name : updatePrice

arguments

```bash
  tokenID (uint256)
 _mintableToken (address)
 _newPrice (uint256)
```

        _return None

        Description :  This function are used to Update NFT Token  on sale currrent price , need tokenID , NFT contract address or new amount (only non bided on sale price update).

- Function-name : withdraw

arguments

```bash
   None

```

        _return None

        Description :  This function are used to withdraw the amount on contract by admin account.

- Function-name : onERC721Received

arguments

```bash
  address
  address
  uint256
  bytes
```

        _return None

        Description :  This function onERC721Received check weather the contract is able to send nft token functions.

#### Read only functions

Checkout contract read only functions [Here](https://rinkeby.etherscan.io/address/0xf4A6C89e790f6E218808AE162279fb9180e76437#readContract)

- #### BorkerV2 smart contract[Link](https://rinkeby.etherscan.io/address/0x6A341599E362869cb87800fb0a8F3087cBF3A97f#writeContract) :

  This smart contract are used to buy and sell mintable NFTs with native currency and with ECR20 Tokens.

- Function-name : addERC20TokenPayment

  arguments

```bash
    _erc20Token (address)
```

        _return None

        Description : This function are use to add ERC20TokenPayment support for particular erc20 token in broker. only owner can call this function.

- Function-name : removeERC20TokenPayment

  arguments

```bash
    _erc20Token (address)
```

        _return None

        Description :  This function use to remove ERC20TokenPayment support  from broker.Only owner can call this function.

- Function-name : buy

  arguments

```bash
    buy payableAmount (ether)
    tokenID (uint256)
    _mintableToken (address)

```

        _return None

        Description :  This function are used to Buy NFT Token which is on sale , need tokenID , NFT contract address or payable amount greater than sale amount.

- Function-name : bid

  arguments

```bash

    bid payableAmount (ether)
    tokenID (uint256)
    _mintableToken (address)
    amount (uint256)

```

        _return None

        Description :  This function are used to Bid NFT Token which is on sale , need tokenID , NFT contract address or payable amount greater than sale amount.

- Function-name : putOnSale

  arguments

```bash
    tokenID (uint256)
    _startingPrice (uint256)
    _auctionType (uint256)
    _buyPrice (uint256)
    _startingTime (uint256)
    _closingTime (uint256)
    _mintableToken (address)
    _erc20Token (address)

```

        _return None

        Description :  This function are used to Put NFT Token  on sale , need tokenID , NFT contract address _auctionType , start price if  2nd type _auctionType ,buy price if 1st type _auctionType, duration, as argument.

- Function-name : putOffSale

  arguments

```bash
    tokenID (uint256)
    _mintableToken (address)

```

        _return None

        Description : This function are used to Put off NFT Token which is on sale , need tokenID , NFT contract address as argument.

- Function-name : collect

  arguments

```bash
    tokenID (uint256)
    _mintableToken (address)
```

        _return None

        Description :   This function are used to collect NFT Token which is on sale time is over , need tokenID , NFT contract address as argument.

- Function-name : setBrokerage

  arguments

```bash
  _brokerage (uint16)

```

        _return None

        Description :  This function are used to Set Brokerage on NFTs which comes on sale , brokerage amount as argument only admin can call this function.

- Function-name : setUpdatedClosingTime

  arguments

```bash
  _updateTime (uint256)
```

        _return None

        Description :  This function used by admin to  update closing time of auction, when new user bid on auction the auction closing time extended by this update time .

- Function-name : updatePrice

  arguments

```bash
  tokenID (uint256)
 _mintableToken (address)
 _newPrice (uint256)
 _erc20Token (address)
```

        _return None

        Description :  This function are used to Update NFT Token  on sale currrent price , need tokenID , NFT contract address or new amount (only non bided on sale price update).

- Function-name : withdraw

  arguments

```bash
   None

```

        _return None

        Description :  This function are used to withdraw the amount on contract by admin account.

- Function-name : withdrawERC20

  arguments

```bash
  _erc20Token (address)
```

        _return None

        Description :  This function are used to withdraw erc20 balance amount on contract by admin account,need erc20Token contract address as argument . only owner can call this function.

- Function-name : onERC721Recived

  arguments

```bash
  address
  address
  uint256
  bytes
```

        _return None

        Description :  This function onERC721Received check weather the contract is able to send nft token functions.

- Function-name : transferOwnership

  arguments

```bash
  newOwner(address)
```

        _return None

        Description :  This are use to transfer ownership  the contract form current owner to new owner, Only admin can call this function.

#### Read only functions

Checkout contract read only functions [Here](https://rinkeby.etherscan.io/address/0x6A341599E362869cb87800fb0a8F3087cBF3A97f#readContract)

- #### AdminManager smart contract [Link](https://rinkeby.etherscan.io/address/0xDF795FD3AD283057e6f8B05E027dABF60A229cD7#code) :

  This smart contract are used to manage NFT market place list of authorized admins.

  - Function-name : addAdmin

  arguments

  ```bash
      admin (address)
  ```

        _return None

        Description :  This function are used to add admin in admin manager to give right access this contract.

  - Function-name : removeAdmin

  arguments

  ```bash
      admin (address)
  ```

        _return None

        Description :  This function are used to remove admin in adminManager contract.

  - Function-name : approve

  arguments

  ```bash
      _erc20 (address)
      spender (address)
      value (uint256)
  ```

        _return None

        Description : This function are used to Approve the third person to spend  token on behalf of owner, need a erc20 address ,token amount and spender address as argument.

  - Function-name : buy

  arguments

  ```bash
      buy payableAmount (ether)
      tokenID (uint256)
      _mintableToken (address)

  ```

        _return None

        Description :  This function are used to Buy NFT Token which is on sale , need tokenID , NFT contract address or payable amount greater than sale amount.

  - Function-name : bid

  arguments

  ```bash
      bid payableAmount (ether)
      tokenID (uint256)
      _mintableToken (address)
      amount (uint256)

  ```

        _return None

        Description :  This function are used to Bid NFT Token which is on sale , need tokenID , NFT contract address or payable amount greater than sale amount.

  - Function-name : burnNFT

  arguments

  ```bash
      collection(address)
      tokenId(uint256)

  ```

        _return None

        Description : This function are used to Burn NFT Token in NFT contract address of NFT contract and token id as argument .

  - Function-name : putOnSale

  arguments

  ```bash
      tokenID (uint256)
      _startingPrice (uint256)
      _auctionType (uint256)
      _buyPrice (uint256)
      _startingTime (uint256)
      _closingTime (uint256)
      _mintableToken (address)
      _erc20Token (address)

  ```

        _return None

        Description :  This function are used to Put NFT Token  on sale , need tokenID , NFT contract address _auctionType , start price if  2nd type _auctionType ,buy price if 1st type _auctionType, duration, as argument.

  - Function-name : putOffSale

  arguments

  ```bash
      tokenID (uint256)
      _mintableToken (address)

  ```

        _return None

        Description :   This function are used to Put off NFT Token which is on sale , need tokenID , NFT contract address as argument.

  - Function-name : collect

  arguments

  ```bash
      tokenID (uint256)
      _mintableToken (address)
  ```

        _return None

        Description :  This function are used to collect NFT Token which is on sale time is over , need tokenID , NFT contract address as argument.

  - Function-name : setBrokerAddress

  arguments

  ```bash
    _broker (address)

  ```

        _return None

        Description :  This function use to setBrokerAddress in admin manager to manage the contract of broker .

- Function-name : updatePrice

  arguments

```bash
  tokenID (uint256)
 _mintableToken (address)
 _newPrice (uint256)
 _erc20Token (address)
```

        _return None

        Description : This function are used to Update NFT Token  on sale currrent price , need tokenID , NFT contract address or new amount (only non bided on sale price update).

- Function-name : withdraw

  arguments

```bash
   None

```

        _return None

        Description :  This function are used to withdraw the amount on contract by admin account.

- Function-name : withdrawERC20

  arguments

```bash
  _erc20Token (address)
```

        _return None

        Description :  This function are used to withdraw erc20 balance amount on contract by admin account,need erc20Token contract address as argument . only owner can call this function.

- Function-name : onERC721Received

  arguments

```bash
  address
  address
  uint256
  bytes
```

        _return None

        Description :  This function onERC721Received check weather the contract is able to send nft token functions.

- Function-name : transferOwnership

  arguments

```bash
  newOwner(address)
```

        _return None

        Description :  This are use to transfer ownership  the contract form current owner to new owner, Only admin can call this function.

- Function-name : renounceOwnership

  arguments

```bash
  None
```

        _return None

        Description : This function are used to Renounce Ownership,  only owner can call this function.

- Function-name : decreaseAllowance

  arguments

```bash
    _erc20 (address)
    spender (address)
    subtractedValue (uint256)
```

        _return None

        Description :  This are use to decrease Allowance of erc20 token amount of spender .

- Function-name : decreaseApproval

  arguments

```bash
    _erc20 (address)
    spender (address)
    subtractedValue (uint256)
```

        _return None

        Description :

- Function-name : increaseAllowance

  arguments

```bash
    _erc20 (address)
    spender (address)
    addedValue (uint256)
```

        _return None

        Description : This are use to increase Allowance of erc20 token amount of spender .

- Function-name : increaseApproval

  arguments

```bash
    _erc20 (address)
    spender (address)
    addedValue (uint256)
```

        _return None

        Description :

- Function-name : transfer

  arguments

```bash
    _erc20 (address)
    to (address)
    value (uint256)

```

        _return None

        Description :  This are use to transfer tokens from owner to receiver account by owner .

- Function-name : transferFrom

  arguments

```bash
    _erc20 (address)
    from (address)
    to (address)
    value (uint256)

```

        _return None

        Description :  This are use to transfer tokens from owner to receiver account by spender.

- Function-name : erc721Approve

  arguments

```bash
  _ERC721Address(address)
  _to(address)
  _tokenId(uint256)

```

        _return None

        Description : This are use to Approve spender to spend   his NFTs behalf of him.

- Function-name : erc721Burn

  arguments

```bash
  _ERC721Address (address)
  tokenId (uint256)
```

        _return None

        Description :  This are use to burn NFTs on mintable contract.

- Function-name : erc721Mint

  arguments

```bash
  _ERC721Address (address)
  tokenURI (string)
  _royalty (uint256)
```

        _return None

        Description :  This are use to mint new NFTs on mintable contract.

- Function-name : erc721SafeTransferFrom(with extra args)

  arguments

```bash
  _ERC721Address (address)
  from (address)
  to (address)
  tokenId (uint256)
  _data (bytes)
```

        _return None

        Description :  This function are used to  Transfer NFT token , need a token id from and to address as argument it also take optional data argument(need 0x as arg)  .This function can call owner or approved address.

- Function-name : erc721SafeTransferFrom

  arguments

```bash
  _ERC721Address (address)
  from (address)
  to (address)
  tokenId (uint256)

```

        _return None

        Description : This function are used to  Transfer NFT token , need a token id from and to address as argument.This function can call owner or approved address.

- Function-name : erc721TransferFrom

  arguments

```bash
  _ERC721Address (address)
  from (address)
  to (address)
  tokenId (uint256)

```

        _return None

        Description : This function are used to  Transfer NFT token , need a token id from and to address as argument.This function can call owner or approved address.

#### Read only functions

Checkout contract read only functions [Here](https://rinkeby.etherscan.io/address/0xDF795FD3AD283057e6f8B05E027dABF60A229cD7#readContract)

