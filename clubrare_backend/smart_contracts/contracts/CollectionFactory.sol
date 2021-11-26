pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


import './Collection.sol';
import './brokerV2_utils/AddressArrayLib.sol';


/**
 * @title CollectionFactory
 * @author Yogesh Singh
 * @notice This function will create new collection for you
 * @dev Factory contract to create collections 
 */
contract CollectionFactory is Ownable{

    // Custom lib for managing address[]
    using AddressArrayLib for AddressArrayLib.addresses;

    // List to store all collections created till now.
    AddressArrayLib.addresses private _collections;

    // Mapping to store collection created by user
    // sender => list of collection deployed
    mapping(address => AddressArrayLib.addresses) private _userCollections;

    // Events:
    event CollectionCreated(
        address indexed creator,
        address indexed collection,
        string name,
        string indexed symbol,
        string contractURI,
        string tokenURIPrefix,
        uint time
    );

    event CollectionRemoved(
        address indexed creator,
        address indexed collection,
        uint time
    );

    /**
     * @dev Constructor function
     */
    constructor() public{
        transferOwnership(msg.sender);
    }

    /**
     * @dev Public function that deploys new collection contract and return new collection address.
     * @dev Returns address of deployed contract
     * @param name Display name for  collection contract
     * @param symbol Symbol for collection contract
     * @param contractURI Collection description URI which contains display image and other necessery details.
     * @param tokenURIPrefix prefix for tokenURI of NFT contract
     */
    function createCollection(
        string memory name, 
        string memory symbol,
        string memory contractURI, 
        string memory tokenURIPrefix
    ) public returns (address){
        Collection collection = new Collection(
            name, 
            symbol, 
            msg.sender, 
            contractURI, 
            tokenURIPrefix
        );
        _collections.add(address(collection));
        _userCollections[msg.sender].add(address(collection));
        emit CollectionCreated(msg.sender, address(collection), name, symbol, contractURI, tokenURIPrefix, block.timestamp);
        return address(collection);
    }

    /**
     * @dev Public function that Removes contract address from user's collections.
     */
    function removeCollection(address collection) public{
        // Check conditions
        require(_collections.exists(collection), "Collection doesn't exists");
        require(_userCollections[msg.sender].exists(collection), "Collection doesn't exists");
        Ownable _collection = Ownable(collection);
        require(_collection.owner() == address(0), 'renounceOwnership of contract required');

        // Delete the address
        _userCollections[msg.sender].removeAddress(collection);
        _collections.removeAddress(collection);

        // Trigger the event
        emit CollectionRemoved(msg.sender, address(collection), block.timestamp);

    }

    /**
     * @dev return all collections deployed till now.
     */
    function getAllCollection() public view returns (address[]memory){
        return _collections.array;
    }

    /**
     * @dev Returns contracts depolyet to address
     */
    function getUserCollection(address _user) public view returns (address[] memory){
        return _userCollections[_user].array;
    }

}