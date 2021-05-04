import React from 'react';
import '../css/channel.css';

const Channel = () => {
  return ( 
    <div className="channel-container">
      <div className="channel-title">Which type of payment channel would you like to create?</div>
      <div className="payment-type">
        <div className="one-way">
          <h3>One-way</h3>
          <p>Only you can send transactions to the recipient. However, only you need to sign messages for them to be valid, and the recipient can redeem their funds in a simple manner.</p>
          <button>Create one-way channel</button>
        </div>
        <div className="two-way">
          <h3>Two-way</h3>
          <p>You and the recipient can send transactions to each other both ways. However, you both need to sign all transactions and there is a challenge period when you want to withdraw yours funds where you must be active.</p>
          <button>Create two-way channel</button>
        </div>
      </div>
      <div className="channel-title">What currency would you like to use?</div>
    </div>
   );
}
 
export default Channel;