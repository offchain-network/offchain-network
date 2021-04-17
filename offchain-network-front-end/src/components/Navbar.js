import React from 'react';
import Logo from "../images/Logo.png";
import '../css/navbar.css';

const Navbar = () => {
  return ( 
    <div>
      <nav>
        <div className = "nav-logo">
          <img src={Logo} alt="logo"/>
          <span>offchain.network</span>
        </div>
      </nav> 
    </div>
  );
}
 
export default Navbar;