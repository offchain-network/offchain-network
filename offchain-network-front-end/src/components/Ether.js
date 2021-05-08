import React, { useState } from 'react';
import { ethers } from 'ethers';
import '../css/ether.css';
import ChannelId from './ChannelId';

const Ether = ({etherContent}) => {
  const [etherChannel, setEtherChannel] = useState({amount: ethers.utils.parseEther("1.0"), duration: 86400})

  const handleChange=(e) => {
    if(e.target.name === "amount") {
      setEtherChannel({...etherChannel, [e.target.name]: ethers.utils.parseEther(e.target.value)})
      }
    else {
      setEtherChannel({...etherChannel, [e.target.name]: parseInt(e.target.value)})
      }
    console.log(etherChannel)
  }

  const handleClick = (e) => {
    e.preventDefault()
    etherContent(etherChannel)
  }

  return ( 
    <div className="ether-container">
      <h3>Ether</h3>
      <p>Ether is the base currency of Ethereum, is used to pay for transactions on the base layer.</p>
      <form>
        <div className="inputs">
          <div className="input-field">
            <label>Amount to supply</label>
            <input placeholder="0.00" name="amount" onChange={handleChange} value={ChannelId.amount}/>
          </div>
          <div className="input-field">
            <label>Balance: 1.1103</label>
            <span>ETH</span>
          </div>
        </div>
        <div className="token-address">
            <span>Duration (in seconds) contract stays open</span>
            <input placeholder="86400" name="duration" onChange={handleChange} value={ChannelId.duration}/>
          </div>
        <button onClick = {handleClick}>Use Ether</button>
      </form>
    </div>
   );
}
 
export default Ether;