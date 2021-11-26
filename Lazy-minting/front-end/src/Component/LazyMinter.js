import React from 'react'
import LazyMint from '../contractAbi/LazyMint.json'
import VerifySignature from '../contractAbi/veryfiy.json'

import { ethers } from 'ethers'
import Web3 from 'web3'
import { TypedDataUtils } from 'ethers-eip712'
import { keccak256 } from 'keccak256'

/**
 * Creates a new NFTVoucher object and signs it using this LazyMinter's signing key.
 *
 * @param {ethers.BigNumber | number} tokenId the id of the un-minted NFT
 * @param {string} uri the metadata URI to associate with this NFT
 * @param {ethers.BigNumber | number} minPrice the minimum price (in wei) that the creator will accept to redeem this NFT. defaults to zero
 *
 * @returns {NFTVoucher}
 *  */

export default function LazyMinter() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const web3 = new Web3(Web3.givenProvider || window.ethereum)
  const signer = provider.getSigner()

  const contract = new ethers.Contract(
    // '0xE3087DF444EE992884eC265071c45AC0f332E255',
    '0x22C34c49F5C228572F1C1770E6c4d7A321018c7B',
    LazyMint.abi,
    signer,
  )

  const createVoucher = async (minPrice, tokenId, tokenUri) => {
    // const voucher = { tokenId, tokenUri, minPrice }
    const account = await web3.eth.getAccounts()
    const hash = await contract.getMessageHash(tokenId, minPrice, tokenUri)
    const encodedhash = await contract.getEthSignedMessageHash(hash)

    // const data2 = web3.utils.keccak256(datav)

    // const signature = await signer.signMessage(encodedhash)
    const signature = await web3.eth.sign(encodedhash, account[0])

    // const verifyingaddress = ethers.utils.verifyMessage(encodedhash, signature)
    console.log(encodedhash)

    console.log(signature)
    const verifyingaddress = await contract.recoverSigner(
      encodedhash,
      signature,
    )
    console.log('verifyingaddress', verifyingaddress)

    // return {
    //   ...voucher,
    //   signature,
    // }
  }

  // const signDomain = async () => {
  //   const chainId = await contract.getChainID()

  //   let _domain = {
  //     name: SIGNING_DOMAIN_NAME,
  //     version: SIGNING_DOMAIN_VERSION,
  //     chainId: chainId,
  //     verifyingContract: '0x01aa5748Dd60410F3331FdE4fa0BCfbF509B7080',
  //   }
  //   return _domain
  // }

  return (
    <div>
      <button onClick={() => createVoucher(0, 3, 'Hello')}>sign</button>
    </div>
  )
}
