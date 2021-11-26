import { useState } from 'react'
import { BigNumber } from 'bignumber.js'
import Bridge from '../contracts/Bridge.json'
import { Connect } from './Connect'
import Web3 from 'web3'

export const Withdraw = (props) => {
  const [successful, setSuccessful] = useState(false)
  const [with_account, setWith_Account] = useState()

  const bridgeAbi = Bridge.abi
  //   const connect = Connect()
  //   const web3 = connect.web3
  const web3 = new Web3(Web3.givenProvider || 'localhost:8545')
  //   const bridgeContractEth = new web3.eth.Contract(
  //     bridgeAbi,
  //     '0x93C11Ea795519DD09175DA5a23f64b32a37Eff2E',
  //   )
  const bridgeContractBsc = new web3.eth.Contract(
    bridgeAbi,
    '0x1d6E5AD248dbdaEDd51C284b3Bd011e722126a4B',
  )

  const withdrawToken = async (e) => {
    e.preventDefault()
    console.log('hello its working', ...props.data.nonce)
    await Connect.onClickConnect

    // const _network = await web3.eth.net.getNetworkType()

    try {
      let accounts = await web3.eth.getAccounts()
      setWith_Account(accounts[0])

      await bridgeContractBsc.methods
        .withDrawToken(
          new BigNumber(props.data.amount * 10 ** 18),
          props.data.nonce,
          props.data.messageHash,
          props.data.v,
          props.data.r,
          props.data.s,
        )
        .send({ from: with_account })
      props.data.setLoading(false)

      setSuccessful(true)
    } catch (error) {
      console.error(error)
    }
  }

  return successful === false ? (
    <div>
      <div>
        <h4>To withdraw your token on Bs. Select bsc network in metamask </h4>
        amount
        <p>{props.data.amount}</p>
        user address <p>{props.data.account}</p>
      </div>
      {props.data.input ? (
        <button
          className="btn btn-warning"
          onClick={withdrawToken}
          // disabled={props.data.tran_account === with_account ? false : true}
        >
          {props.loadings ? (
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
            'Withdraw Token'
          )}
        </button>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <div>
      <h1>transaction successful</h1>
    </div>
  )
}
// else if ((_network !== 'private', _network !== undefined)) {
//   try {
//     // console.log(v, r, s, signer, 'gggggggggggggggggggg')

//     let accounts = await web3.eth.getAccounts()
//     console.log(accounts)

//     const results = await bridgeContractEth.methods
//       .withDrawToken(
//         new BigNumber(amount * 10 ** 18),
//         nonce,
//         messageHash,
//         v,
//         r,
//         s,
//         '0xa155D12C5AB84b9b8B6A1cC714cfE911e29f6D9b',
//       )
//       .send({ from: '0xa155D12C5AB84b9b8B6A1cC714cfE911e29f6D9b' })
//     setSuccessful(true)
//   } catch (error) {
//     console.error(error)
//   }
// }
// else {
//   console.log(
//     'please change network type to withdraw token on other chain ',
//   )
// }
