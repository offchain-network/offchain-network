import React from 'react';
import "../css/transaction.css";

const Transaction = () => {
  return ( 
    <div className="history-container">
      <div className="history-title">
        <span>Transaction History</span>
        <span><i class="fa fa-refresh"></i></span>
      </div>
    </div>
   );
}
 
export default Transaction;