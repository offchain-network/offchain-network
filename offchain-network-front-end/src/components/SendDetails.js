import React from 'react';
import "../css/senddetails.css";

const SendDetails = ({amount, signature}) => {
  return ( 
    <div className={`details-div ${amount === "0.0" || signature == undefined ? "none" : ""}`}>
    <div className="send-details-amount">
      <span>Amount</span>
      <span>{amount}</span>
    </div>
    <div className="send-details-amount">
      <span>Signature</span>
      <span>{signature}</span>
    </div>
    </div>
   );
}
 
export default SendDetails;