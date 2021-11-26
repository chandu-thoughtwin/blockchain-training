const constants = require("../config/constant.js");
const Web3 = require('web3');
const web3_url = constants.web3_url;
let web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider( web3_url ));

const nftArtifacts = require("../smart_contracts/build/contracts/MintableToken.json");
const brokerNftArtifacts = require("../smart_contracts/build/contracts/Broker.json");
const collectionFactoryArtifacts = require("../smart_contracts/build/contracts/CollectionFactory.json");

const nftAddr = constants.nftAddress;
const nftContract = new web3.eth.Contract(nftArtifacts.abi, nftAddr);
const brokerNftAddr = constants.brokerNftAddress;
const brokerNftContract = new web3.eth.Contract(brokerNftArtifacts.abi, brokerNftAddr);
const factoryNftCollectionAddress = constants.factoryNftCollectionAddress;
const collectionFactoryNftContract = new web3.eth.Contract(collectionFactoryArtifacts.abi, factoryNftCollectionAddress);

const caver_url = constants.caver_url;
let klaytnWeb3 = new Web3(caver_url );
const klaytn_mintable_address = constants.klaytn_mintable_address;
const klaytn_broker_address = constants.klaytn_broker_address;
const klaytnMintableContract = new klaytnWeb3.eth.Contract(nftArtifacts.abi, klaytn_mintable_address);
const klaytnBrokerContract = new klaytnWeb3.eth.Contract(brokerNftArtifacts.abi, klaytn_broker_address);
const klaytnFactoryCollectionAddress = constants.collection_factory_address;
const klaytnCollectionFactoryContract = new web3.eth.Contract(collectionFactoryArtifacts.abi, klaytnFactoryCollectionAddress);

// const Caver = require('caver-js');
// const klaytn_broker_address = constants.klaytn_broker_address;
// const caver = new Caver(caver_url);
// const klaytn_mintable_address = constants.klaytn_mintable_address;
// const klaytn_broker_address = constants.klaytn_broker_address;
// const klaytnMintableContract = caver.contract.create(nftArtifacts.abi, klaytn_mintable_address);
// const klaytnBrokerContract = caver.contract.create(brokerNftArtifacts.abi, klaytn_broker_address);

exports.getContractObject = async (network_id) => {
    if(network_id == 1) {
        const obj = {
            nftContract: nftContract,
            brokerNftContract:brokerNftContract,
            web3: web3,
            nftAddress: nftAddr
        }
        return obj;
    } else {
        const obj = {
            nftContract: klaytnMintableContract,
            brokerNftContract:klaytnBrokerContract,
            web3: klaytnWeb3,
            nftAddress: klaytn_mintable_address
        }
        return obj;
    }
}

exports.getCollectionObject = async ( network_id ) => {
    if(network_id == 1) {
        const obj = {
            collectionFactoryContract: collectionFactoryNftContract,
            web3: web3
        }
        return obj;
    } else {
        const obj = {
            collectionFactoryContract: klaytnCollectionFactoryContract,
            web3: web3
        }
        return obj;
    }
}