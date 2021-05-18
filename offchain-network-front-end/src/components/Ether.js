import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import '../css/ether.css';
import ChannelId from './ChannelId';
import { useWeb3React } from '@web3-react/core';

const Ether = ({etherContent}) => {
  const { library, account, active } = useWeb3React();

  const [etherChannel, setEtherChannel] = useState({amount: ethers.utils.parseEther("1.0"), duration: 86400})
  const [balance, setBalance] = useState(0)

  const handleChange=(e) => {
    if(e.target.name === "amount") {
      setEtherChannel({...etherChannel, [e.target.name]: e.target.value})
      }
    else {
      setEtherChannel({...etherChannel, [e.target.name]: e.target.value})
      }
    console.log(etherChannel)
  }

  const handleClick = (e) => {
    e.preventDefault()
    etherContent(etherChannel)
  }
  
  useEffect(async () => {
    if (active) {
        let tempBalance = await library.getBalance(account)
        tempBalance = ethers.utils.formatEther(tempBalance)
        tempBalance = (+tempBalance).toFixed(4);
        setBalance(tempBalance)
    }
  })
  

  return ( 
    <div className="ether-container">
      <h3>MATIC</h3>
      <p>MATIC is the base currency of Matic, and is used to pay for transaction fees there.</p>
      <form>
        <div className="inputs">
          <div className="input-field">
            <label>Amount to supply</label>
            <input placeholder="0.00" name="amount" onChange={handleChange} value={ChannelId.amount}/>
          </div>
          <div className="input-field">
            <label>Balance: {balance}</label>
            <span>MATIC</span>
          </div>
        </div>
        <div className="token-address">
            <span>Duration (in seconds) contract stays open</span>
            <input placeholder="86400" name="duration" onChange={handleChange} value={ChannelId.duration}/>
          </div>
        <button onClick = {handleClick}>Use MATIC</button>
      </form>
    </div>
   );
}
 
export default Ether;