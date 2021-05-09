import React, { useState } from 'react';
import '../css/receive.css';
import ChannelId from './ChannelId';
import Transaction from './Transaction';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import abi from '../contracts/UnidirectionalPaymentChannelHub.json';



async function constructPaymentMessage(contractAddress, channelId, amount) {
    return ethers.utils.solidityKeccak256(
        ["address", "bytes32", "uint256"],
        [contractAddress, channelId, amount]
    );
}

/*
async function signMessage(signer, message) {
    await signer.signMessage(
        ethers.utils.arrayify(message)
    );
}
*/

// contractAddress is used to prevent cross-contract replay attacks.
// amount, in wei, specifies how much Ether should be sent.

async function signPayment(signer, contractAddress, channelId, amount) {
    var message = await constructPaymentMessage(contractAddress, channelId, amount);
    let signedMessage = await signer.signMessage(ethers.utils.arrayify(message));
    return signedMessage;
}



const Receive = () => {
  const { library, account, active } = useWeb3React();

  const [closeData, setCloseData] = useState({amount: "0", signature: ""})
  const [channel, setChannel] = useState("")

  const getChannelId = (state) => {
    setChannel(state)
  }
  /*
  const displayChannel = async (state) => {
    let contractAddress = "0xd600fC088b51d98d86235A14E22ca14AD3aD7728";
    let contract = new ethers.Contract(contractAddress, abi.abi, library.getSigner());
    try {
      if (!ethers.utils.isHexString(channel, 32)) {
        throw "Channel is not bytes32"
      }

      let channelInfo = await contract.getIdToChannel(channel);
      console.log(channelInfo)
      alert(channelInfo)
    } catch (e) {
      if (e.data !== undefined) {
        alert(e.data.message)
      } else {
        alert(e)
      }
    }
    
  }
  */
  /*
  console.log(signPayment(library.getSigner(), "0xd600fC088b51d98d86235A14E22ca14AD3aD7728", "0x78d6f8da7a6fbbb7e9b1a46e51990b99f1b205f41e35a414a7f9d2dfc9c4bbe1", ethers.utils.parseEther("0.2")))
  */
  const handleInput=(e) => {
    if(e.target.name === "amount") {
      setCloseData({...closeData, [e.target.name]: e.target.value})
      }
    else {
      setCloseData({...closeData, [e.target.name]: e.target.value})
      }
    console.log(closeData)
  }

  const receiveFunction = async (content) => {
    console.log(content)
    console.log(channel)
    
    if (active) {
    try {
      let contractAddress = "0xd600fC088b51d98d86235A14E22ca14AD3aD7728";
      let contract = new ethers.Contract(contractAddress, abi.abi, library.getSigner());
      /*
      if (!ethers.utils.isArrayish(channel)) {
        throw "Please enter a correct channel ID"
      }
      

      let arrayChannelId = ethers.utils.arrayify(channel);
      */

      if (!ethers.utils.isHexString(channel, 32)) {
        throw "Channel is not bytes32"
      }
      
      if (!ethers.utils.isHexString(content.signature, 65)) {
        throw "Signature is not correct length"
      }     

      let channelInfo = await contract.getIdToChannel(channel);


      let senderAddress = channelInfo.sender;
      let recipientAddress = channelInfo.recipient;
      let expiration = channelInfo.expiration;
      let tokenAddress = channelInfo.tokenAddress;
      let open = channelInfo.open;
      let amount = ethers.utils.parseEther(content.amount);
      let signature = content.signature;

      let tx = await contract.close(senderAddress, recipientAddress, tokenAddress, amount, signature);
        console.log(tx.hash);
        await tx.wait();
        alert("Success - you have withdrawn", amount)
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

  const [display, setDisplay] = useState(false);

  const handleChange = () => {
    setDisplay(!display);
  }

  const handleClick = (e) => {
    e.preventDefault()
    receiveFunction(closeData)
  }

  return ( 
    <>
    <ChannelId getChannelId = {getChannelId}/>
    <div className="receive-container">
      <div className="receive-header">
        <span>You</span>
        <div className="custom">
          <span>Custom</span>
           <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" id="customSwitch1" onChange={handleChange}/>
              <label class="custom-control-label" htmlFor="customSwitch1"></label>
          </div>
        </div>
      </div>
      <form>
        <div className={`receive-form-off ${display ? "display" : ""}`}>
          <label>Balance</label>
          <input placeholder="0.00 ETH"/>
        </div>
        <div className={`receive-form-on ${display ? "" : "display"}`}>
          <div className="amount-to-withdraw">
            <span>Amount to withdraw</span>
            <div className="matic-div"><input className="input" placeholder="31.862332423846223847" name="amount" onChange={handleInput} value={ChannelId.amount}/><span>MATIC</span></div>
          </div>
          <div className="amount-to-withdraw">
            <span>Withdrawal Signature</span>
            <br></br>
            <input className="input" placeholder="0x8a3cd88e97634c89b3a5d8408dcb73013e7357ae92f5d6" name="signature" onChange={handleInput} value={ChannelId.amount}/>
          </div>
        </div>
        <button onClick = {handleClick}>Redeem</button>
      </form>
    </div>
    <Transaction/>
    </>
   );
}
 
export default Receive;