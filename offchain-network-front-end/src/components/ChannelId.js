import React, { useState } from 'react';
import '../css/channelId.css';
import { ethers } from 'ethers';
import abi from '../contracts/UnidirectionalPaymentChannelHub.json';
import { useWeb3React } from '@web3-react/core';


const ChannelId = ({getChannelId}) => {
	const { library, account, active } = useWeb3React();
    const [channelId, setChannelId] = useState("")
    const handleChange = (e) => {
      const newChannelId = e.target.value
      getChannelId(newChannelId)
      setChannelId(newChannelId)
    }

    const [channelData, setChannelData] = useState(undefined);

   	const displayChannel = async (state) => {
   		if (active) {
		    let contractAddress = "0xd600fC088b51d98d86235A14E22ca14AD3aD7728";
		    let contract = new ethers.Contract(contractAddress, abi.abi, library.getSigner());
		    try {
		      if (!ethers.utils.isHexString(channelId, 32)) {
		        throw "Channel is not bytes32"
		      }

		      let channelInfo = await contract.getIdToChannel(channelId);


		      setChannelData({
		      	"sender": channelInfo.sender,
		      	"recipient": channelInfo.recipient,
		      	"expiration": new Date(channelInfo.expiration.toNumber()*1000).toLocaleString(),
		      	"amount": ethers.utils.formatEther(channelInfo.amount) + " MATIC",
		      	"open": channelInfo.open
		      })
		      console.log(channelData)
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

    const handleKeyUp = (e) => {
	    // Enter
	    if (e.keyCode === 13) {
	      displayChannel(channelId)
	    }
  	}


  return ( 
    <div className="channel-id-container">
      <div className="channel-id-search">
        <span>Channel ID</span>
        <input placeholder="0x123abc..." name="channelId" onChange={handleChange} onKeyUp={handleKeyUp} value={channelId}/>
      </div>
			<div className = {`channel-id-details ${channelData === undefined ? "display-none": ""}` }>
				<div className="channleData-content">
					<span>Sender address</span>
					<span>{channelData !== undefined ? channelData["sender"] : ""}</span>
				</div>
				<div className="channleData-content">
					<span>Recipient address</span>
					<span>{channelData !== undefined ? channelData["recipient"] : ""}</span>
				</div>
				<div className="channleData-content">
					<span>Expiration Date</span>
					<span>{channelData !== undefined ? channelData["expiration"] : ""}</span>
				</div>
				<div className="channleData-content">
					<span>Amount</span>
					<span>{channelData !== undefined ? channelData["amount"] : ""}</span>
				</div>
				<div className="channleData-content">
					<span>Open</span>
					<span>{channelData !== undefined ? channelData["open"] ? "true" : "false" : ""}</span>
				</div>
			</div>
    </div>
   );
}
 
export default ChannelId;