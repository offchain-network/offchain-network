import React from 'react';
import '../css/erc20.css';

const ERC20 = () => {
  return ( 
    <div className="ether-container">
      <h3>ERC20 token</h3>
      <p>ERC20 tokens are fungible (currency-like) tokens on Ethereum, such as Tether, Dai, Chainlink, Wrapped Bitcoin.</p>
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
        <div className="token-address">
          <span>Token Address</span>
          <input placeholder="0x123abc"/>
        </div>
        <button className="erc-20">Use an ERC20 token</button>
      </form>
    </div>
   );
}
 
export default ERC20;