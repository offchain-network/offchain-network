import React, { useState } from 'react';
import '../css/receive.css';
import ChannelId from './ChannelId';
import Transaction from './Transaction';

const Receive = () => {

  const [display, setDisplay] = useState(false);

  const handleChange = () => {
    setDisplay(!display);
  }

  return ( 
    <>
    <ChannelId/>
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
          <input placeholder="1.1103 ETH"/>
        </div>
        <div className={`receive-form-on ${display ? "" : "display"}`}>
          <div className="amount-to-withdraw">
            <span>Amount to withdraw</span>
            <input placeholder="31.862332423846223847 ETH"/>
          </div>
          <div className="amount-to-withdraw">
            <span>Withdrawal Signature</span>
            <input className="input" placeholder="0x8a3cd88e97634c89b3a5d8408dcb73013e7357ae92f5d6"/>
          </div>
        </div>
        <button>Redeem</button>
      </form>
    </div>
    <Transaction/>
    </>
   );
}
 
export default Receive;