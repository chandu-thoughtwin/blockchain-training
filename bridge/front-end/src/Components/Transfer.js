import { useState } from 'react'
import { BigNumber } from 'bignumber.js'
import Bridge from '../contracts/Bridge.json'
import { Connect } from './Connect'
import { Withdraw } from './Withdraw'
import Web3 from 'web3'

export const Transfer = (props) => {
  //   const connect = Connect.web3Connect()
  //   const withdraw = Withdraw()
  const [nonce, setNonce] = useState()
  const [messageHash, setMessageHash] = useState()
  const [v, setV] = useState()
  const [r, setR] = useState()
  const [s, setS] = useState()
  const [amount, setAmount] = useState(0)
  const [input, setInput] = useState(false)
  const [tran_account, setTran_Account] = useState()

  const [network, setNetwork] = useState()
  const [loadings, setLoading] = useState(false)
  // const [account, setAccounts] = useState()

  const bridgeAbi = Bridge.abi
  //   const web3 = connect.web3
  const web3 = new Web3(Web3.givenProvider || 'localhost:8545')

  const bridgeContractEth = new web3.eth.Contract(
    bridgeAbi,
    '0x93C11Ea795519DD09175DA5a23f64b32a37Eff2E',
  )
  // const bridgeContractBsc = new web3.eth.Contract(
  //   bridgeAbi,
  //   '0x1d6E5AD248dbdaEDd51C284b3Bd011e722126a4B',
  // )
  const handleChange = (e) => {
    setAmount(e.target.value)
  }
  const handleNetwork = async (e) => {
    let _network = await web3.eth.net.getNetworkType()
    setNetwork(_network)
  }

  const code = process.env.REACT_APP_CODE

  const transferToken = async (e) => {
    e.preventDefault()

    try {
      const accounts = await web3.eth.getAccounts()
      setTran_Account(accounts[0])
      await Connect.onClickConnect
      if (network !== 'rinkeby') {
        // setNetwork(undefined)
        setLoading(true)
        await bridgeContractEth.methods
          .transferToken(new BigNumber(amount * 10 ** 18))
          .send({ from: accounts[0] })
          .then(async (response) => {
            let nonce = response.events.transfer.returnValues.nonce
            setNonce(nonce)
            let amount = response.events.transfer.returnValues.amount
            let sender = response.events.transfer.returnValues.sender

            let data_to_sign = nonce + amount + sender
            let signature = web3.eth.accounts.sign(data_to_sign, code)
            setMessageHash(signature['messageHash'])
            setV(signature['v'])
            setR(signature['r'])
            setS(signature['s'])

            console.log(
              'Invoke Verifier.verify() with the following arguments:',
            )
            console.log('messageHash: ' + signature['messageHash'])
            console.log('v          : ' + signature['v'])
            console.log('r          : ' + signature['r'])
            console.log('s          : ' + signature['s'])
          })
        // const _network = await web3.eth.net.getNetworkType()
        // setNetwork(_network)
        await handleNetwork()

        setInput(true)
        setLoading(false)
      } else {
        console.log(
          'please change network type to withdraw token on other chain ',
        )
      }

      // await getTransferEvent()
      // console.log('xfvgfvfvbfv', results.events.transfer.returnValues)
    } catch (e) {
      console.log(e)
    }
  }
  const data = {
    nonce: nonce,
    messageHash: messageHash,
    v: v,
    r: r,
    s: s,
    amount: amount,
    input: input,
    network: network,
    loadings: loadings,
    setLoading: setLoading,
    tran_account: tran_account,
  }

  return (
    <div className="container">
      {!input ? (
        <div className="row mt-4">
          <div className="col-8">
            <form>
              <div className="form-group">
                <label htmlFor="amount-id">Amount</label>
                <input
                  type="text"
                  className="form-control"
                  name=""
                  id="amount-id"
                  aria-describedby="helpId"
                  placeholder=""
                  // value={amount}
                  onChange={handleChange}
                  disabled={input}
                />
              </div>

              <button className="btn btn-primary" onClick={transferToken}>
                {loadings ? (
                  <svg
                    width="135"
                    height="135"
                    viewBox="0 0 135 135"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#fff"
                  >
                    <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 67 67"
                        to="-360 67 67"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 67 67"
                        to="360 67 67"
                        dur="8s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </svg>
                ) : (
                  'transferToken'
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Withdraw data={data} />
      )}
    </div>
  )
}

// export async function addNetwork(id) {

//     let networkData;

//     switch (id) {

//       //bsctestnet

//       case 97:

//         networkData = [

//           {

//             chainId: "0x61",

//             chainName: "BSCTESTNET",

//             rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],

//             nativeCurrency: {

//               name: "BINANCE COIN",

//               symbol: "BNB",

//               decimals: 18,

//             },

//             blockExplorerUrls: ["https://testnet.bscscan.com/"],

//           },

//         ];

//         break;

//       //bscmainet

//       case 56:

//         networkData = [

//           {

//             chainId: "0x38",

//             chainName: "BSCMAINET",

//             rpcUrls: ["https://bsc-dataseed1.binance.org"],

//             nativeCurrency: {

//               name: "BINANCE COIN",

//               symbol: "BNB",

//               decimals: 18,

//             },

//             blockExplorerUrls: ["https://testnet.bscscan.com/"],

//           },

//         ];

//         break;

//       default:

//         break;

//     }

//     // agregar red o cambiar red

//     return window.ethereum.request({

//       method: "wallet_addEthereumChain",

//       params: networkData,

//     });

//   }
