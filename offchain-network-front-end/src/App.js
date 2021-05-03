import "./css/app.css";
import Navbar from "./components/Navbar";
import Receiver from "./components/Receiver";
import Sender from "./components/Sender";
import Transaction from "./components/Transaction";
import arrow from "./images/Forward Arrow.png";
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import ChannelId from "./components/ChannelId";

function App() {

const [signer, setSigner] = useState(undefined);

const init = async () => {
  await window.ethereum.enable()
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  setSigner(signer);
}

useEffect(()=>{
  init();
}, [])

  return (
    <div className="App">
      <ChannelId/>
      {/* <Navbar/>
      <div className="transfer-info">
        <Sender signer={signer}/>
        <img src={arrow} alt="arrow" className="arrow-png"/>
        <Receiver/>
      </div>
      <Transaction/> */}
    </div>
  );
}

export default App;
