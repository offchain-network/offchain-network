import React from 'react';
import "../css/send.css";
import arrow from "../images/Forward Arrow.png";
import Receiver from './Receiver';
import Sender from './Sender';

const Send = ({signer}) => {
  return ( 
    <div className="transfer-info">
        <Sender signer={signer}/>
        <img src={arrow} alt="arrow" className="arrow-png"/>
        <Receiver/>
      </div>
   );
}
 
export default Send;