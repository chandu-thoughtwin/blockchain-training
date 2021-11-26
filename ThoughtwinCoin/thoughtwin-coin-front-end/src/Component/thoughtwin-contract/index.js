import React from 'react'
import ContractAbi from '../../smart-contracts/contracts/ThoughtwinCoin.json'
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from 'ethereum-multicall'
import Web3 from 'web3'
import { useState } from 'react'
const ThoughtWinContract = () => {
  const [balance, setBalance] = useState('')
  const [account, setAccount] = useState('')
  const web3Contract = new Web3(Web3.givenProvider || 'localhost:8545')
  const multiCall = new Multicall({
    web3Instance: web3Contract,
    tryAggregate: true,
  })

  const contract = new web3Contract.eth.Contract(
    ContractAbi.abi,
    '0xAd09cA83A8fA444E429337a6B14E84C5130FC48f',
  )

  // const getEvents = async () => {
  //   const balance = await contract.methods.name().call()
  //   console.log(balance)

  //   const receipt = await contract.events.Transfer(
  //     {
  //       fromBlock: 0,
  //       toBlock: 'latest',
  //     },

  //     function (error, events) {
  //       console.log(events)
  //     },
  //   )
  //   console.log(receipt)
  // }

  const getBalance = async () => {
    let acc = await web3Contract.eth.getAccounts()
    const balance_ = await contract.methods.balanceOf(acc[0]).call()
    const format = web3Contract.utils.fromWei(balance_)
    setBalance(format)
  }
  console.log(balance)

  return (
    <div>
      <button onClick={getBalance}>getBalance</button>
    </div>
  )
}
export default ThoughtWinContract
