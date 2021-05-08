import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import Receive from "./components/Receive";
import Send from "./components/Send";
import { Route, Switch } from "react-router";
import Channel from "./components/Channel";

function App() {

const [signer, setSigner] = useState(localStorage.getItem("signer") || undefined);
const [length, setLength] = useState(undefined)

const init = async () => {
  await window.ethereum.enable()
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const appSigner = provider.getSigner()
  console.log(appSigner);
  const jsonSigner = JSON.stringify(appSigner)
  console.log(JSON.parse(jsonSigner))
  const chainId = await appSigner.getChainId()
  const appSignerAddress = await appSigner.getAddress()
  setSigner(appSignerAddress)
  localStorage.setItem("signer", JSON.stringify(appSignerAddress))
  // window.location.reload();
}

const isMetaMaskConnected = async (provider) => {
    const accounts = await provider.listAccounts();
    setLength(accounts.length);
}

useEffect(()=>{
  if(window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    isMetaMaskConnected(provider);
    if(length === 0) {
      localStorage.removeItem("signer");
      window.location.reload();
    }
  }
}, [])

  return (
    <div className="App">
      <Navbar init = {init}/>
      <Switch>
        <Route path="/send" render = {() => <Send signer={signer}/>}/>
        <Route path="/receive" component = {Receive}/>
        <Route path="/" render = {() => <Channel signer={signer}/>}/>
      </Switch>
    </div>
  );
}

export default App;
