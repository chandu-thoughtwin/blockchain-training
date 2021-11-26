pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


import './MintableToken.sol';

contract Collection is MintableToken{
    uint private counter = 1;

    constructor (
        string memory name, 
        string memory symbol, 
        address sender,
        string memory contractURI, 
        string memory tokenURIPrefix
    ) public MintableToken(
        name, 
        symbol, 
        sender, 
        contractURI, 
        tokenURIPrefix
    ){

    }

    function mint(string memory tokenURI, uint _royality) onlyOwner public {
        _mint(msg.sender, counter, _royality);
        _setTokenURI(counter, tokenURI);
        counter++;
    }

}