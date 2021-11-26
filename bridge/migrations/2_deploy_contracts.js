const TokenBase = artifacts.require('TokenBase.sol')
const Bridge = artifacts.require('Bridge.sol')
var BigNumber = require('bignumber.js')

module.exports = async function (deployer, network, addresses) {
  //   if (network === 'ethTestnet') {
  // await deployer.deploy(TokenBase, 'ETK Token', 'ETK')
  // const token = await TokenBase.deployed()
  // await token.mint(addresses[0], new BigNumber(1000 * 10 ** 18))

  // await deployer.deploy(
  //   Bridge,
  //   token.address,
  //   '0xa155D12C5AB84b9b8B6A1cC714cfE911e29f6D9b',
  // )
  // const bridge = await Bridge.deployed()
  // await token.updateAdmin(bridge.address)
  // //   }
  //   if (network === 'bscTestnet') {
  await deployer.deploy(TokenBase, 'ETK Token', 'ETK')
  const token = await TokenBase.deployed()

  await deployer.deploy(
    Bridge,
    token.address,
    '0xa155D12C5AB84b9b8B6A1cC714cfE911e29f6D9b',
  )
  const bridge = await Bridge.deployed()
  await token.updateAdmin(bridge.address)
  //   }
}
