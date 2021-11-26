const ERC20Addresses = artifacts.require("ERC20Addresses");
const TokenDetArrayLib = artifacts.require("TokenDetArrayLib");
const BrokerV2 = artifacts.require("BrokerV2");

module.exports = async function (deployer) {
    await deployer.deploy(ERC20Addresses);
    await deployer.deploy(TokenDetArrayLib);
    await deployer.link( ERC20Addresses,BrokerV2);
    await deployer.link(TokenDetArrayLib,BrokerV2);
    await deployer.deploy(BrokerV2, 700,600);

    let response = `\n     ERC20Addresses: ${ERC20Addresses.address}\n     TokenDetArrayLib: ${TokenDetArrayLib.address}\n     BrokerV2: ${BrokerV2.address}`

    console.log(response)
};