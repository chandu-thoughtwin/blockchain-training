const LazyMint = artifacts.require('LazyMint')

module.exports = async function (deployer) {
  await deployer.deploy(LazyMint, '0xa155d12c5ab84b9b8b6a1cc714cfe911e29f6d9b')
}
