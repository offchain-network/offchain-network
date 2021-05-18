import React from 'react';
import "../css/receiver.css";

const Receiver = () => {
  return ( 
    <div className="receiver-container">
      <span>Receiver (0xb23b...9aB1)</span>
      <div className="container-border">
        <span>Receiver Balance</span>
        <form className="receiver-info">
          <span>1.3405</span>
          <select>
            <option>ETH</option>
          </select>
        </form>
      </div>
      <div className="receiver-footer">
        <span>Channel Expiration:</span>
        <span>2021.06.20 10:00 UTC</span>
      </div>
    </div>
   );
}
 
export default Receiver;