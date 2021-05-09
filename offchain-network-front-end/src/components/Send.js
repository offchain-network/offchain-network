import React, { useEffect, useState } from 'react';
import "../css/send.css";
import arrow from "../images/Forward Arrow.png";
import ChannelId from './ChannelId';
import Receiver from './Receiver';
import Sender from './Sender';
import Transaction from './Transaction';
import { ethers } from 'ethers';


const Send = () => {

  const [channelId, setChannelId] = useState("")

  const getChannelId = (state) => {
    setChannelId(state)
  }

  return ( 
    <>
    <ChannelId getChannelId = {getChannelId}/>
    <div className="transfer-info">
      <Sender channelId={channelId}/>
    </div>
    </>
   );
}
 
export default Send;