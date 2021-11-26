import { useState } from 'react'

import Web3 from 'web3'

export const Connect = () => {
  console.log('FUNCTION CALLING 11')

  const [account, setAccounts] = useState()

  const web3 = new Web3(Web3.givenProvider || 'localhost:8545')

  const web3Connect = async () => {
    // console.log('FUNCTION CALLING')
    try {
      const accounts = await web3.eth.getAccounts()
      setAccounts(accounts[0])
      const _network = await web3.eth.net.getNetworkType()
      // setNetwork(_network)
      console.log(_network)

      console.log('web3', account)
    } catch (e) {
      console.error(e)
    }
  }

  async function onClickConnect() {
    const { ethereum } = window
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      console.log('FUNCTION CALLING')

      await ethereum.request({ method: 'eth_requestAccounts' })
      await web3Connect()
    } catch (error) {
      console.error(error)
    }
  }
  return <div></div>
}
