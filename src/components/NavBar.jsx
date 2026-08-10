import React from "react";
import  "./NavBar.css";
const NavBar=()=>{
  return(
    <nav className="navbar">
     <div className="logo">
        DraftCV
     </div>

     <div className="nav-links">
       <a href="">How It Works</a>
       <a href="">Templates</a>
       <a href="">FAQs</a>
       <button>Start Building</button>
     </div>
    </nav>
  )
}
export default NavBar;