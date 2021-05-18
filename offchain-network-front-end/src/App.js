import Navbar from "./components/Navbar";
import { ethers } from 'ethers';
import Receive from "./components/Receive";
import Send from "./components/Send";
import { Route, Switch } from "react-router";
import Channel from "./components/Channel";
import { InjectedConnector } from '@web3-react/injected-connector'
import { Web3ReactProvider } from '@web3-react/core'
import getLibrary from './utils/library'
import './App.css';

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })




function App() {

/*
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
*/
/*
const isMetaMaskConnected = async (provider) => {
    const accounts = await provider.listAccounts();
    setLength(accounts.length);
}
*/
/*
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
*/

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <Navbar></Navbar>
        <Switch>
          <Route path="/send" render = {() => <Send/>}/>
          <Route path="/receive" component = {Receive}/>
          <Route path="/" render = {() => <Channel/>}/>
        </Switch>
      </div>
    </Web3ReactProvider>
  );
}

export default App;
