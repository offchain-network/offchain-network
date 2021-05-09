import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {postEndpoint} from "../api/utils";
import "../css/sender.css";
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, injected } from "../hooks/index";
import { signPayment } from "../utils/signer.js"
import abi from '../contracts/UnidirectionalPaymentChannelHub.json';


const Sender = (channelId) => {

  const [content, setContent] = useState("")
  const { library, account, connector, active, activate } = useWeb3React();

  const triedEager = useEagerConnect();

  const [balance, setBalance] = useState(0)

  useEffect(async () => {
    if (active) {
        let tempBalance = await library.getBalance(account)
        tempBalance = ethers.utils.formatEther(tempBalance)
        tempBalance = (+tempBalance).toFixed(4);
        setBalance(tempBalance)
    }
  })

  useEffect(() => {
    if (!active && triedEager) {
      activate(connector, null, false);
    }
  }, [])

  const transactionObject = {
           id: "id",               
           SenderAddress: account,
           ReceiverAddress: "receiver",
           AddressOfTokenUsed: "token",
           AmountOfTokensWithSender: "senderToken",
           AmountOfTokensWithReceiver: "receivertoken", 
           TransactionNonce: "0",
           Signature: "sig",
           ChannelId: "chanelId"
     }

  const [amount, setAmount] = useState("0.0");
  const [transaction, setTransaction] = useState(transactionObject);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (active) {
    try {
    if (!ethers.utils.isHexString(channelId.channelId, 32)) {
        throw "Channel is not bytes32"
    }

    let contractAddress = "0xd600fC088b51d98d86235A14E22ca14AD3aD7728";
    let contract = new ethers.Contract(contractAddress, abi.abi, library.getSigner());

    let channelInfo = await contract.getIdToChannel(channelId.channelId);

    if (channelInfo.sender != account) {
      throw "You are not the sender of this paymentChannel, only the sender can sign"
    }

    if (channelInfo.open == false) {
      throw "This channel has been closed by the recipient, make a new one!"
    }

    await signPayment(library.getSigner(), contractAddress, channelId.channelId, ethers.utils.parseEther(amount));
    await axios.post(`${postEndpoint}/${transaction}`);
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
              <input value={amount} onChange={handleChange} name="amount" placeholder="0.0"/>
            </div>
            <div className="form-part">
              <span>Balance: {balance}</span>
              <select>
                <option>MATIC</option>
              </select>
            </div>
          </div>
          <button>Sign Payment</button>
        </form>
      </div>
    </div>
   );
}
 
export default Sender;