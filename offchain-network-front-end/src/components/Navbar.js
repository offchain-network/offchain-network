import React, { useEffect, useState } from 'react';
import Logo from "../images/Logo.png";
import '../css/navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({signer, init}) => {
  const [content, setContent] = useState("")

  const navInit = async () => {
    const mycontent = await signer.getAddress()
    setContent(mycontent)
  }

  useEffect(() => {
    if(signer === undefined) {
      setContent("Connect to Wallet")
    } else {
      navInit()
    }
  }, [])

  const handleInit = () => {
    init()
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
          {content == "Connect to Wallet" ? <button className="nav-link-red" onClick = {handleInit}>Connect to Wallet</button> : <span>{content.slice(0,6)}...{content.slice(-4, content.length)}</span>}
        </div>
      </nav> 
    </div>
  );
}
 
export default Navbar;