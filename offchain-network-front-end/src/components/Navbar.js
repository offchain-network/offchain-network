import React, { useEffect, useState } from 'react';
import Logo from "../images/Logo.png";
import '../css/navbar.css';
import { Link } from 'react-router-dom';
import { useEagerConnect, injected } from "../hooks/index";
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';


function Navbar() {
  console.log("start")
  const [content, setContent] = useState("")
  const { account, connector, active, activate, error } = useWeb3React();
  const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError
  if (isUnsupportedChainIdError) {
    alert("Switch to Matic Testnet \nMore info: https://docs.matic.network/docs/develop/metamask/config-matic")
  }

  useEffect(() => {
    console.log("hello", active)
    if (!active) {
        setContent("Connect to Wallet")
    } else {
        setContent(account)
    }
  }, [active])

  const handleActivate = () => {
    console.log(account)
    activate(injected, null, false);
  }

  return ( 
    <div className="navbar-container">
      <nav>
        <div className="nav-description">
          <div className="nav-logo">
            <img src={Logo} alt="logo"/>
            <span>offchain.network</span>
          </div>
          <div className="nav-center">
            <span><Link to="/">Create Channel</Link></span>
            <span><Link to="/send">Send</Link></span>
            <span><Link to="/receive">Receive</Link></span>
          </div>
        </div>
        <div className="nav-links">
          <span><a href="#">About</a></span>
          <span><a href="#">Whitepaper</a></span>
          {content === "Connect to Wallet" ? <button className="nav-link-red" onClick = {handleActivate}>Connect to Wallet</button> : <span>{content.slice(0,6)}...{content.slice(-4, content.length)}</span>}
        </div>
      </nav> 
    </div>
  );
}
 
export default Navbar;