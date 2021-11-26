// import detectEthereumProvider from '@metamask/detect-provider'
// import { ethers, Contract } from 'ethers'
// import Bridge from '../contracts/Bridge.json'

// export const BscNetworkConnect = () => {
//   new Promise(async (resolve, reject) => {
//     let provider = await detectEthereumProvider()
//     if (provider) {
//       await provider.request({ method: 'eth_requestAccounts' })
//       provider = new ethers.providers.Web3Provider(provider)
//       const signer = provider.getSigner()

//       const bridgeAbiBsc = new Contract(
//         '0xe526187e7Ca657a63410a7e644b96047f21212aF',
//         Bridge.abi,
//         signer,
//       )
//       resolve(bridgeAbiBsc)
//       return
//     }
//     reject('please select bsc testnet')
//   })

//   return <div></div>
// }

// async function getTransferEvent() {
//   const web3wss = new Web3('wss://rinkeby.infura.io/ws/v3/' + infuraKey)
//   const contractWss = new web3wss.eth.Contract(
//     bridgeAbi,
//     '0xC470dA35D7b24E2da3Ad7D6B7C84f8BBA5cf9b76',
//   )
//   //   await contract.events.Approval({ fromBlock: 0 }, function (error, events) {
//   //     console.log(events)
//   //   })

//   await contractWss.events
//     .transfer(
//       {
//         fromBlock: 'latest',
//       },
//       function (error, event) {
//         if (error) {
//           console.log('without subscrption', error)
//         }
//       },
//     )
//     .on('connected', function (subscriptionId) {
//       console.log('cdfgfgbfc', subscriptionId)
//     })
//     .on('data', function (event) {
//       console.log('without subscrption', event) // same results as the optional callback above
//     })
//     .on('changed', function (event) {
//       console.log(event)
//     })
//     .on('error', function (error, receipt) {
//       console.error(error)
//     })
// }

// const withdrawToken = async (e) => {
//   e.preventDefault()
//   try {
//     i
//     // var data_to_sign = nonce + amount + sender
//     // var signature = web3.eth.accounts.sign(
//     //   data_to_sign,
//     //   '6e2d79a5df892d4ad3a876d4910d8f9e756a128ac3c243c054c9a192b1c320e8',
//     // )
//   } catch (e) {
//     console.error(e)
//   }
// }
