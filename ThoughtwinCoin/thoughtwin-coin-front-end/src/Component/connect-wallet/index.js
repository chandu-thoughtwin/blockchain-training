import React, { useEffect } from 'react'
import Web3 from 'web3'
import { useDispatch, useSelector } from 'react-redux'
import { setAccounts } from '../../redux/actions'
import MetaMaskOnboarding from '@metamask/onboarding'

export default function ConnectWallet(props) {
  const onBoarding = new MetaMaskOnboarding()
  const account = useSelector((state) => state.account)
  const dispatch = useDispatch()

  const web3Connect = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider || 'localhost:8545')

      const accounts = await web3.eth.getAccounts()
      dispatch(setAccounts(accounts[0]))
      const network = await web3.eth.net.getNetworkType()
      console.log(network)

      console.log('web3', account)
    } catch (e) {
      console.error(e)
    }
  }

  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  const onClickInstallMetaMask = () => {
    onBoarding.startOnboarding()
  }

  const MetaMaskClientCheck = () => {
    //Now we check to see if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      //   onboardButton.innerText = 'Click here to install MetaMask!';
      onClickInstallMetaMask()
      console.log('Please install MetaMask')
    } else {
      //If it is installed we change our button text
      //   onboardButton.innerText = 'Connect';
      onClickConnect()
    }
  }

  const onClickConnect = async () => {
    const { ethereum } = window
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: 'eth_requestAccounts' })
      await web3Connect()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <button onClick={MetaMaskClientCheck}>web3</button>
    </div>
  )
}
