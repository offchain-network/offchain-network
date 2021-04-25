import React from 'react';
import "../css/transaction.css";
import Arrow from "../images/Forward Arrow.png";
import Copy from "../images/Copy.png";

const Transaction = () => {
  return ( 
    <div className="transaction-container">
      <div className="transaction-title">
        <span>Transaction History</span>
        <span><i className="fa fa-refresh"></i></span>
      </div>
    <div className="transaction-history-container">
      <div className="transaction-history">
        <span>0.540443 ETH</span>
        <div className="transaction-top">
          <span>0x4d93...2b9a (You)</span>
          <img src={Arrow} alt="arrow"/>
          <span>0xb23b...9a81</span>
        </div>
        <div className="transaction-bottom">
          <div className="transaction-bottom-left">
            <span>Signature: 0x8a3cd88e97634c89b3a5d8408dcb73013e7357ae92f5d6</span>
            <img src={Copy} alt="copy"/>
          </div>
          <span className="transaction-time">2021.04.14 13:53 UTC</span>
        </div>
      </div>
      <div className="transaction-history">
        <span>0.540443 ETH</span>
        <div className="transaction-top">
          <span>0x4d93...2b9a (You)</span>
          <img src={Arrow} alt="arrow"/>
          <span>0xb23b...9a81</span>
        </div>
        <div className="transaction-bottom">
          <div className="transaction-bottom-left">
            <span>Signature: 0x8a3cd88e97634c89b3a5d8408dcb73013e7357ae92f5d6</span>
            <img src={Copy} alt="copy"/>
          </div>
          <span>2021.04.14 13:53 UTC</span>
        </div>
      </div>
      <div className="transaction-history">
        <span>0.540443 ETH</span>
        <div className="transaction-top">
          <span>0x4d93...2b9a (You)</span>
          <img src={Arrow} alt="arrow"/>
          <span>0xb23b...9a81</span>
        </div>
        <div className="transaction-bottom">
          <div className="transaction-bottom-left">
            <span>Signature: 0x8a3cd88e97634c89b3a5d8408dcb73013e7357ae92f5d6</span>
            <img src={Copy} alt="copy"/>
          </div>
          <span>2021.04.14 13:53 UTC</span>
        </div>
      </div>
    </div>
    </div>
   );
}
 
export default Transaction;