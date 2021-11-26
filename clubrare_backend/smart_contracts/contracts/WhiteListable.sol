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
contract WhitelistableCollection is Ownable, IERC721, IERC721Metadata, ERC721Burnable, ERC721Base {

    address[] public whitelistedUsers;

    uint private counter = 1;

    constructor (string memory name, string memory symbol, address newOwner, string memory contractURI, string memory tokenURIPrefix) public ERC721Base(name, symbol, contractURI, tokenURIPrefix) {
        _registerInterface(bytes4(keccak256('MINT_WITH_ADDRESS')));
        transferOwnership(newOwner);
    }


    function whitelistedUserExist(address _sender) public view returns (bool) {
        for (uint256 i = 0; i < whitelistedUsers.length; i++) {
            if (_sender == whitelistedUsers[i]) {
                return true;
            }
        }
        return false;
    }


    modifier whitelistedUserOnly() {
        require(whitelistedUserExist(msg.sender), "WhitelistedUserManager: whitelistedUser only.");
        _;
    }


    modifier whitelistedUserAndOwnerOnly() {
        require(
            whitelistedUserExist(msg.sender) || isOwner(),
            "WhitelistedUserManager: whitelistedUser and owner only."
        );
        _;
    }

    function addWhitelistedUser(address whitelistedUser) public onlyOwner {
        if (!whitelistedUserExist(whitelistedUser)) {
            whitelistedUsers.push(whitelistedUser);
        } else {
            revert("WhitelistedUser already in list");
        }

    }


    function getWhitelistedUsers() public view returns (address[] memory) {
        return whitelistedUsers;
    }


    function removeWhitelistedUser(address whitelistedUser) public onlyOwner {
        for (uint256 i = 0; i < whitelistedUsers.length; i++) {
            if (whitelistedUsers[i] == whitelistedUser) {
                whitelistedUsers[whitelistedUsers.length - 1] = whitelistedUsers[i];
                whitelistedUsers.pop();
                break;
            }
        }
        
    }


    function mint(string memory tokenURI, uint _royality) public whitelistedUserAndOwnerOnly{
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

