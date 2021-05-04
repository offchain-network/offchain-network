import React from 'react';
import "../css/send.css";
import arrow from "../images/Forward Arrow.png";
import Receiver from './Receiver';
import Sender from './Sender';
import Transaction from './Transaction';

const Send = ({signer}) => {
  return ( 
    <>
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