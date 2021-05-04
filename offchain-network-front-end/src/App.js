import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import ChannelId from "./components/ChannelId";
import Receive from "./components/Receive";
import Send from "./components/Send";
import { Route, Switch } from "react-router";
import Channel from "./components/Channel";

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
      <Navbar/>
      <ChannelId/>
      <Switch>
        <Route path="/send" render = {() => <Send signer={signer}/>}/>
        <Route path="/receive" component = {Receive}/>
        <Route path="/" component = {Channel}/>
      </Switch>
    </div>
  );
}

export default App;
