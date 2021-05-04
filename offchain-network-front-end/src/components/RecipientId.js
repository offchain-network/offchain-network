import React from 'react';
import '../css/channelId.css';

const RecipientId = () => {
  return ( 
    <div className="channel-id-container">
      <div className="channel-id-search">
        <span>Recipient address</span>
        <input placeholder="0x123abc..."/>
      </div>
    </div>
   );
}
 
export default RecipientId;