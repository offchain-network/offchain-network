import React, { useState } from 'react';
import '../css/channelId.css';

const RecipientId = ({getRecipientId}) => {
    const [recipientId, setRecipientId] = useState("")
    const handleChange = (e) => {
      const newRecipientId = e.target.value
      getRecipientId(newRecipientId)
      setRecipientId(newRecipientId)
    }
    
  return ( 
    <div className="channel-id-container">
      <div className="channel-id-search">
        <span>Recipient address</span>
        <input placeholder="0x123abc..."  name="recipientId" onChange={handleChange} value={recipientId}/>
      </div>
    </div>
   );
}
 
export default RecipientId;