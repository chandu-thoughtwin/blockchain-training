const Web3 = require('web3')
const address = "0xe84B1bd201b9886edCDc8A79e9A70c1d8D5Ea1A8"
const abi = [{"constant":true,"inputs":[{"name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenId","type":"uint256"}],"name":"cancelSell","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"_supportNft","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token_addr","type":"address"},{"name":"_platform","type":"address"},{"name":"_authorVault","type":"address"}],"name":"setAddresses","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"platform","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allTokens","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"nft","type":"address"}],"name":"removeSupportNft","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tokenId","type":"uint256"},{"name":"newPrice","type":"uint256"}],"name":"updatePrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"tokensOfOwner","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"addMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenId","type":"uint256"}],"name":"getSellDetail","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenIdFunction","type":"uint256"}],"name":"getAuthor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"nft_a","type":"address"},{"name":"tokenId","type":"uint256"},{"name":"seller","type":"address"},{"name":"price","type":"uint256"}],"name":"sellNFT","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"sellList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isMinter","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokenURI","type":"string"},{"name":"quantity","type":"uint256"},{"name":"flag","type":"bool"}],"name":"mintWithTokenURI","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"nft","type":"address"}],"name":"addSupportNft","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"onSell","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"main","type":"uint256"},{"name":"_author","type":"uint256"},{"name":"_platform","type":"uint256"}],"name":"setValue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"authorVault","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"nft_a","type":"address"},{"name":"tokenId","type":"uint256"},{"name":"buyer","type":"address"}],"name":"buyNFT","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"action","type":"string"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"token_addr","type":"address"},{"indexed":false,"name":"_platform","type":"address"},{"indexed":false,"name":"_authorVault","type":"address"}],"name":"SetAddresses","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"action","type":"string"},{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"main","type":"uint256"},{"indexed":false,"name":"_author","type":"uint256"},{"indexed":false,"name":"_platform","type":"uint256"}],"name":"SetValue","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"action","type":"string"},{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"nft_a","type":"address"},{"indexed":false,"name":"tokenId","type":"uint256"},{"indexed":false,"name":"seller","type":"address"},{"indexed":false,"name":"price","type":"uint256"}],"name":"SellNFT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"action","type":"string"},{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"nft_a","type":"address"},{"indexed":false,"name":"tokenId","type":"uint256"},{"indexed":false,"name":"buyer","type":"address"}],"name":"BuyNFT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"action","type":"string"},{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"tokenId","type":"uint256"}],"name":"CancelSell","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"action","type":"string"},{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"tokenId","type":"uint256"},{"indexed":false,"name":"newPrice","type":"uint256"}],"name":"UpdatePrice","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"action","type":"string"},{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"tokenURI","type":"string"},{"indexed":false,"name":"quantity","type":"uint256"},{"indexed":false,"name":"flag","type":"bool"}],"name":"MintWithTokenURI","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"approved","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"operator","type":"address"},{"indexed":false,"name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"}]
const mongoUtil = require('../../utils/db');
const rpcURL = "wss://data-seed-prebsc-1-s1.binance.org:8545/"
const provider = new Web3.providers.WebsocketProvider(rpcURL)
var ObjectId = require('mongodb').ObjectID;
const axios = require('axios');
const fetch = require('node-fetch');
let settings = { method: "Get" };

mongoUtil.connectToServer((err) => {
  if (!err) {
    console.log('Connected to Server')
    mintWithTokenURI()
    buyNFT()
    sellNFT()
    updatePrice()
    cancelSell()
    setAddresses()
    setValue()
    //testing()
  }
})

async function setAddresses() {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, address);
    await contract.events.SetAddresses(
    {fromBlock: 0},  async function(error, event){ await saveInfo(event); console.log(error) })
      .on('data', async (log) => {
        console.log("Data", log)
        await saveInfo(log);
      })
      .on('changed', async (log) => {
        console.log(`Changed: ${log}`)
        await saveInfo(log);
      })
      .on('error', (log) => {
        console.log(`error:  ${log}`)
      })
}

async function setValue() {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, address);
    await contract.events.SetValue(
    {fromBlock: 0}, async  function(error, event){ await saveInfo(event); console.log(error) })
      .on('data', async (log) => {
        console.log("Data", log)
        await saveInfo(log);
      })
      .on('changed', async (log) => {
        console.log(`Changed: ${log}`)
        await saveInfo(log);
      })
      .on('error', (log) => {
        console.log(`error:  ${log}`)
      })
}

async function sellNFT() {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, address);
    await contract.events.SellNFT(
    {fromBlock: 0}, async  function(error, event){ await saveInfo(event); console.log(error) })
      .on('data', async (log) => {
        console.log("Data", log)
        await saveInfo(log);
      })
      .on('changed', async (log) => {
        console.log(`Changed: ${log}`)
        await saveInfo(log);
      })
      .on('error', (log) => {
        console.log(`error:  ${log}`)
      })
}

async function buyNFT() {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, address);
    await contract.events.BuyNFT(
    {fromBlock: 0}, async  function(error, event){ await saveInfo(event); console.log(error) })
      .on('data', async (log) => {
        console.log("Data", log)
        await saveInfo(log);
      })
      .on('changed', async (log) => {
        console.log(`Changed: ${log}`)
        await saveInfo(log);
      })
      .on('error', (log) => {
        console.log(`error:  ${log}`)
      })
}

async function cancelSell() {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, address);
    await contract.events.CancelSell(
    {fromBlock: 0}, async  function(error, event){ await saveInfo(event); console.log(error) })
      .on('data', async (log) => {
        console.log("Data", log)
        await saveInfo(log);
      })
      .on('changed', async (log) => {
        console.log(`Changed: ${log}`)
        await saveInfo(log);
      })
      .on('error', (log) => {
        console.log(`error:  ${log}`)
      })
}

async function updatePrice() {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, address);
    await contract.events.UpdatePrice(
    {fromBlock: 0}, async  function(error, event){ await saveInfo(event); console.log(error) })
      .on('data', async (log) => {
        console.log("Data", log)
        await saveInfo(log);
      })
      .on('changed', async (log) => {
        console.log(`Changed: ${log}`)
        await saveInfo(log);
      })
      .on('error', (log) => {
        console.log(`error:  ${log}`)
      })
}

async function testing(){
  const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, address);
   await contract.events.allEvents({fromBlock: 0}, async  function(error, event){
      console.log("event", event)
     }).on('data', async (log) => {
        console.log("Data", log);
      })
      .on('changed', async (log) => {
        console.log(`Changed: ${log}`)
      })
      .on('error', (log) => {
        console.log(`error:  ${log}`)
        console.log("log", log)
      })
}

async function mintWithTokenURI() {
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, address);

    await contract.events.MintWithTokenURI(
    {fromBlock: 8545903 }, async  function(error, event){ 
      await saveInfo(event); //console.log(error) 
      })
      .on('data', async (log) => {
        //console.log("Data", log);
        await saveInfo(log);
      })
      .on('changed', async (log) => {
        //console.log(`Changed: ${log}`)
        await saveInfo(log);
      })
      .on('error', (log) => {
        //console.log(`error:  ${log}`)
      })
}

async function saveInfo(data) {
  try {
    let tokenURI;

    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, address);
    console.log("data.transactionHash", data.transactionHash)
    if(data.transactionHash) {
      let checkExist = await mongoUtil.retrieveOneInfo("demuxNFTData_new", { transactionHash: data.transactionHash });
      //console.log("checkExist", checkExist)
      if(checkExist && checkExist.transactionHash ) {
        if(data.event  == "MintWithTokenURI") {
          tokenURI = data.returnValues[3];
          if(tokenURI.includes('https://ipfs.io/ipfs/')) {
            await fetch(tokenURI, settings)
              .then(res => res.json())
              .then((json) => {
                  console.log(json);
                  data.metaData = json;
              });
          } else {
            console.log("tokenUri", 'https://ipfs.infura.io:5001/api/v0/object/get?arg='+tokenURI)
            await fetch('https://ipfs.infura.io:5001/api/v0/cat?arg='+tokenURI, settings)
              .then(res => res.json())
              .then((json) => {
                  //console.log(json);
                  data.metaData = json;
              });
          }

          let txhash = await web3.eth.getTransactionReceipt(data.transactionHash).then(async txObj => {
            for(i=0; i < txObj.logs.length; i++) {
              if(txObj.logs[i].data == '0x') {
                if(txObj.logs[i].topics && txObj.logs[i].topics[3]) {
                  data.tokenId =  await web3.utils.hexToNumber(txObj.logs[i].topics[3]);
                }
              }
            }
          });
          data.copies =  await web3.utils.hexToNumber(data.returnValues.quantity._hex);
        }
        console.log("data", data)
        await mongoUtil.upd("demuxNFTData_new", {_id: ObjectId(checkExist._id)}, { $set: data });
      } else {
        if(data.event  == "MintWithTokenURI") {
          tokenURI = data.returnValues[3];
          if(tokenURI.includes('https://ipfs.io/ipfs/')) {
            await fetch(tokenURI, settings)
              .then(res => res.json())
              .then((json) => {
                  console.log(json);
                  data.metaData = json;
              });
          } else {
            console.log("tokenUri", 'https://ipfs.infura.io:5001/api/v0/object/get?arg='+tokenURI)            
            await fetch('https://ipfs.infura.io:5001/api/v0/cat?arg='+tokenURI, settings)
              .then(res => res.json())
              .then((json) => {
                  //console.log(json);
                  data.metaData = json;
              });
          }

          let txhash = await web3.eth.getTransactionReceipt(data.transactionHash).then(async txObj => {
            for(i=0; i < txObj.logs.length; i++) {
              if(txObj.logs[i].data == '0x') {
                if(txObj.logs[i].topics && txObj.logs[i].topics[3]) {
                  data.tokenId =  await web3.utils.hexToNumber(txObj.logs[i].topics[3]);
                }
              }
            }
          });

          data.copies =  await web3.utils.hexToNumber(data.returnValues.quantity._hex);
        }
        await mongoUtil.insertData("demuxNFTData_new", data);
      }
    }
  } catch(err) {
    console.log(err)
  }
}

async function slackNotification() {
  try {

  } catch(err) {
    console.log(err)
  }
}