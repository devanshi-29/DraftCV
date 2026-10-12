import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";
const NavBar=()=>{
  const navigate = useNavigate();
  return(
    <nav className="navbar">
     <div className="logo">
        Draft<span>CV</span>
     </div>

     <div className="nav-links">
  <a
    href="#how-it-works"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("how-it-works")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
  >
    How It Works
  </a>

  <a
    href="#templates"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("templates")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
  >
    Templates
  </a>

  <a
    href="#faqs"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("faqs")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
  >
    FAQs
  </a>
</div>

    <button className="startBuilding-btn" onClick={() => navigate("/builder")}>Start Building</button>
    </nav>
  )
}
export default NavBar;