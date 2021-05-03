import React from 'react';
import '../css/channelId.css';

const ChannelId = () => {
  return ( 
    <div className="channel-id-container">
      <div className="channel-id-search">
        <span>Channel ID</span>
        <input placeholder="0x123abc..."/>
      </div>
    </div>
   );
}
 
export default ChannelId;