import React from 'react';
import Logo from "../images/Logo.png";
import '../css/navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
          <span><a href="#">Contact</a></span>
        </div>
      </nav> 
    </div>
  );
}
 
export default Navbar;