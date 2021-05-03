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
        <button>Redeem</button>
      </form>
    </div>
   );
}
 
export default Receive;