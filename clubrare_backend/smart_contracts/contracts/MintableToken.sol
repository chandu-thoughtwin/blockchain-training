
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";


import "./tokens/ERC721/ERC721Base.sol";

/**
 * @title MintableToken
 * @dev anyone can mint token.
 */
contract MintableToken is Ownable, IERC721, IERC721Metadata, ERC721Burnable, ERC721Base {

    uint private counter = 1;

    constructor (string memory name, string memory symbol, address newOwner, string memory contractURI, string memory tokenURIPrefix) public ERC721Base(name, symbol, contractURI, tokenURIPrefix) {
        _registerInterface(bytes4(keccak256('MINT_WITH_ADDRESS')));
        transferOwnership(newOwner);
    }


    function mint(string memory tokenURI, uint _royality) public {
        // require(owner() == ecrecover(keccak256(abi.encodePacked(this, tokenId)), v, r, s), "owner should sign tokenId");
        _mint(msg.sender, counter, _royality);
        _setTokenURI(counter, tokenURI);
        counter++;
    }

    function setTokenURIPrefix(string memory tokenURIPrefix) public onlyOwner {
        _setTokenURIPrefix(tokenURIPrefix);
    }

    function setContractURI(string memory contractURI) public onlyOwner {
        _setContractURI(contractURI);
    }
}
