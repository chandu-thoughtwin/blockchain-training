import React from 'react'
import ConnectWallet from './Component/connect-wallet'
import ThoughtWinContract from './Component/thoughtwin-contract'
import { Header } from './Component/Header'

function App() {
  return (
    <div>
      <Header />
      <ConnectWallet />
      <ThoughtWinContract />
    </div>
  )
}
export default App
