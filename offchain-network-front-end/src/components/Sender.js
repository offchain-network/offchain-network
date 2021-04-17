import React from 'react';
import "../css/sender.css";

const Sender = () => {
  return ( 
    <div className="sender-container">
      <span>You</span>
      <div className="send-description">
        <form className="send-info">
          <div className="form-border">
            <div className="form-part">
              <label>Amount</label>
              <input placeholder="0.00"/>
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