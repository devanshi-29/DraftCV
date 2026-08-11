import React from "react";
import  "./NavBar.css";
const NavBar=()=>{
  return(
    <nav className="navbar">
     <div className="logo">
        Draft<span>CV</span>
     </div>

     <div className="nav-links">
       <a href="">How It Works</a>
       <a href="">Templates</a>
       <a href="">FAQs</a>
     </div>

     <button className='startBuilding-btn'>Start Building</button>
    </nav>
  )
}
export default NavBar;