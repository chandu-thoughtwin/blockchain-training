// const TokenDetArrayLibV1 = artifacts.require("TokenDetArrayLibV1");
// const Broker = artifacts.require("Broker");

// module.exports = async function (deployer) {
//     // await deployer.deploy(ERC20Addresses);
//     await deployer.deploy(TokenDetArrayLibV1);
//     // await deployer.link( ERC20Addresses,BrokerV2);
//     await deployer.link(TokenDetArrayLibV1,Broker);
//     await deployer.deploy(Broker, 700);

//     let response = `\n      TokenDetArrayLibV1: ${TokenDetArrayLibV1.address}\n     Broker: ${Broker.address}`

//     console.log(response)
// };