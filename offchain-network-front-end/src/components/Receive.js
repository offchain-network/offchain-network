import React from 'react';
import '../css/receive.css';

const Receive = () => {

  const handleChange = () => {
    // console.log("changed")
  }

  return ( 
    <div className="receive-container">
      <div className="receive-header">
        <span>You</span>
        <div className="custom">
          <span>Custom</span>
           <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" id="customSwitch1" onChange={handleChange}/>
              <label class="custom-control-label" for="customSwitch1"></label>
          </div>
        </div>
      </div>
      <form>
        <div className="receive-form-off">
          <label>Balance</label>
          <input placeholder="1.1103 ETH"/>
        </div>
        <div className="receive-form-on">
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
   );
}
 
export default Receive;