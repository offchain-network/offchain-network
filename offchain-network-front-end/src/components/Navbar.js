import React from 'react';
import Logo from "../images/Logo.png";
import '../css/navbar.css';

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
            <span><a href="#">Create Channel</a></span>
            <span><a href="#">Send</a></span>
            <span><a href="#">Receive</a></span>
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