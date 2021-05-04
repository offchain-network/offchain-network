import React from 'react';
import '../css/ether.css';

const Ether = () => {
  return ( 
    <div className="ether-container">
      <h3>Ether</h3>
      <p>Ether is the base currency of Ethereum, is used to pay for transactions on the base layer.</p>
      <form>
        <div className="inputs">
          <div className="input-field">
            <label>Amount to supply</label>
            <input placeholder="0.00"/>
          </div>
          <div className="input-field">
            <label>Balance: 1.1103</label>
            <span>ETH</span>
          </div>
        </div>
        <button>Use Ether</button>
      </form>
    </div>
   );
}
 
export default Ether;