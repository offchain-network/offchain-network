import React, { useState } from 'react';
import { ethers } from 'ethers';
import "../css/sender.css";

const Sender = ({signer}) => {

  const [amount, setAmount] = useState(0.0);

  const constructPaymentMessage = async (contractAddress, channelId, amount) => {
    return ethers.utils.solidityKeccak256(
        ["address", "bytes32", "uint256"],
        [contractAddress, channelId, amount]
    );
}

const signPayment = async (signer, contractAddress, channelId, amount) => {
    let message = await constructPaymentMessage(contractAddress, channelId, amount);
    let signedMessage = await signer.signMessage(ethers.utils.arrayify(message));
    return signedMessage;
}

const handleSubmit = (e) => {
  e.preventDefault();
  signPayment(signer, "0x0000000000000", "channelId", amount);
}

const handleChange = (e) => {
  const amount = e.target.value;
  setAmount(amount);
}

  return ( 
    <div className="sender-container">
      <span>You</span>
      <div className="send-description">
        <form className="send-info" onSubmit={handleSubmit}>
          <div className="form-border">
            <div className="form-part">
              <span>Amount</span>
              <input value={amount} onChange={handleChange} name="amount"/>
            </div>
            <div className="form-part">
              <span>Balance: 1.1183</span>
              <select>
                <option>ETH</option>
              </select>
            </div>
          </div>
          <button>Send Payment</button>
        </form>
      </div>
    </div>
   );
}
 
export default Sender;