const Mintable = artifacts.require("MintableToken");
const Broker = artifacts.require("Broker");

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {

    // Deploy mintable token
    await deployer.deploy(
        Mintable,
        'ClubRare', // name of contract
        'CLR', // Symbol for contract
        '0x2f9240294a5b7790c868a496b9d1b550eab47d22', // Address to deploy
        'https://ipfs.io/ipfs/Qmb7mkJ75ornHjKdxtrg9idsaVUfeXxYECsuTe9pbFFeUZ', // Contract URI, will be changed with live URL
        'https://clubrare2.mypinata.cloud/ipfs/' // Token prefix
    );
  });
};
