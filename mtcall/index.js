const { ethers } = require('ethers')
// const { ALCHEMY_URL } = require('./config')
const compound = require('./contracts/ThoughtwinCoin.json')
const accounts = [
  '0xa155D12C5AB84b9b8B6A1cC714cfE911e29f6D9b',
  '0xA82D361cC67D6A6b4A123ff664dbB5a30b8F5C04',
  '0x002cdd18F00897d595e069D73713669f8BF0B823',
  '0x0E19c63dAfB0a2731f056d0620Aa160D090e5FBa',
]
const { Contract, Provider } = require('ethers-multicall')
const provider = new ethers.providers.JsonRpcProvider()

const calculateTime = async () => {
  const startDate = new Date()
  const result = await getLiquidity()
  const endDate = new Date()
  const milliseconds = endDate.getTime() - startDate.getTime()
  console.log(`Time to process in milliseconds: $ {milliseconds}`)
  console.log(`Time to process in seconds: $ {milliseconds / 1000}`)
  const callsCount = Object.keys(result).length
  console.log(`Number of entries in the result: $ {callsCount}`)
}
const getLiquidity = () => {
  const compoundContract = new ethers.Contract(
    '0xad09ca83a8fa444e429337a6b14e84c5130fc48f',
    compound.abi,
    provider,
  )

  return Promise.all(
    accounts.map((account) => {
      let data
      try {
        data = compoundContract.balanceOf(account)
      } catch (error) {
        console.log(`Error getting the data $ {error}`)
      }
      return data
    }),
  )
}
