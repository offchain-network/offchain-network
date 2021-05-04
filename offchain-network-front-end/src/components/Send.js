import React from 'react';
import "../css/send.css";
import arrow from "../images/Forward Arrow.png";
import ChannelId from './ChannelId';
import Receiver from './Receiver';
import Sender from './Sender';
import Transaction from './Transaction';

const Send = ({signer}) => {
  return ( 
    <>
    <ChannelId/>
    <div className="transfer-info">
      <Sender signer={signer}/>
      <img src={arrow} alt="arrow" className="arrow-png"/>
      <Receiver/>
    </div>
    <Transaction/>
    </>
   );
}
 
export default Send;