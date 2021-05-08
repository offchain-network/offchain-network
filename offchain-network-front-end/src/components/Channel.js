import React, { useState } from 'react';
import '../css/channel.css';
import ERC20 from './ERC20';
import Ether from './Ether';
import RecipientId from './RecipientId';
import abi from '../contracts/UnidirectionalPaymentChannelHub.json';
import { ethers } from 'ethers';

const Channel = () => {
  const [recipient, setRecipient] = useState("")
  const [etherChannel, setEtherChannel] = useState(undefined)
  const getRecipientId = (state) => {
    setRecipient(state)
  }

  const etherContent = async (content) => {
    let contractAddress = "0xd600fC088b51d98d86235A14E22ca14AD3aD7728";
    let contract = new ethers.Contract(contractAddress, abi, "signer");
    let recipientAddress = recipient;
    let duration = content.duration;
    let tokenAddress = ethers.constants.AddressZero
    let tokenAmount = 0;
    let overrides = { value: content.amount };
    let tx = await contract.open(recipientAddress, duration, tokenAddress, tokenAmount, overrides);
    console.log(tx.hash);
    await tx.wait();
    alert("success!");
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
          <button>Create one-way channel</button>
        </div>
        <div className="two-way">
          <h3>Two-way</h3>
          <p>You and the recipient can send transactions to each other both ways. However, you both need to sign all transactions and there is a challenge period when you want to withdraw yours funds where you must be active.</p>
          <button>Create two-way channel</button>
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