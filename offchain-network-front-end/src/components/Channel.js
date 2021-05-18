import React, { useState } from 'react';
import '../css/channel.css';
import ERC20 from './ERC20';
import Ether from './Ether';
import RecipientId from './RecipientId';
import abi from '../contracts/UnidirectionalPaymentChannelHub.json';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
//import { Interface } from '@ethersproject/abi'

const Channel = () => {

  //const abiInterface = new Interface(abi)

  const { account, active, library, connector, error } = useWeb3React()
  if (error) {
    alert(error)
  }

  const [recipient, setRecipient] = useState("")
  const [etherChannel, setEtherChannel] = useState(undefined)
  const getRecipientId = (state) => {
    setRecipient(state)
  }


  const etherContent = async (content) => {
    if (active) {
    try {
      let contractAddress = "0xd600fC088b51d98d86235A14E22ca14AD3aD7728";
      let contract = new ethers.Contract(contractAddress, abi.abi, library.getSigner());
      if (!ethers.utils.isAddress(recipient)) {
        throw "Please enter a correct recipient address"
      }
      let recipientAddress = recipient;
      let duration = parseInt(content.duration);
      let tokenAddress = ethers.constants.AddressZero
      let tokenAmount = 0;
      let overrides = { value: ethers.utils.parseEther(content.amount) };
      let tx = await contract.open(recipientAddress, duration, tokenAddress, tokenAmount, overrides);
        console.log(tx.hash);
        await tx.wait();
        let channelId = await contract.getUsersToId(account, recipientAddress, tokenAddress);
        alert("Success - save your channel's ID: " + channelId)
      } catch (e) {
        if (e.data !== undefined) {
          alert(e.data.message)
        } else {
          alert(e)
        }
      }
    } else {
      alert("Connect to a wallet first")
    }
    

  }

  return ( 
    <>
    <RecipientId getRecipientId = {getRecipientId}/>
    <div className="channel-container">
      <div className="channel-title">Which type of payment channel would you like to create?</div>
      <div className="payment-type">
        <div className="one-way">
          <h3>One-way</h3>
          <p>Only you can send transactions to the recipient. However, only you need to sign messages for them to be valid, and the recipient can redeem their funds in a simple manner.</p>
          <button disabled={true}>Selected</button>
        </div>
        <div className="two-way">
          <h3>Two-way</h3>
          <p>You and the recipient can send transactions to each other both ways. However, you both need to sign all transactions and there is a challenge period when you want to withdraw yours funds where you must be active.</p>
          <button disabled={true}>TBA</button>
        </div>
      </div>
      <div className="channel-title">What currency would you like to use?</div>
      <div className="form-div">
        <Ether etherContent = {etherContent}/>
        <ERC20/>
      </div>
    </div>
    </>
   );
}
 
export default Channel;