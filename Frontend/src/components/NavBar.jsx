
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch logged-in user's details
  const fetchUser = async () => {
    try {
      const response = await fetch(
        "https://draftcv.onrender.com",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Logout user
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://draftcv.onrender.com/api/auth/me",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setUser(null);
        setShowProfile(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        Draft<span>CV</span>
      </div>

      {/* Navigation links */}
      <div className="nav-links">
        <a
          href="#how-it-works"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("how-it-works")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          How It Works
        </a>

        <a
          href="#templates"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("templates")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Templates
        </a>

        <a
          href="#faqs"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("faqs")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          FAQs
        </a>
      </div>

      {/* Right-side actions */}
      <div className="nav-actions">
        <button
          className="startBuilding-btn"
          onClick={() => navigate("/builder")}
        >
          Start Building
        </button>

        {/* Profile dropdown */}
        <div className="profile-container">
          <button
            className="profile-btn"
            onClick={() => setShowProfile((prev) => !prev)}
            aria-label="Open profile menu"
            aria-expanded={showProfile}
          >
            <span className="profile-icon">👤</span>
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              {user ? (
                <>
                  <h3 className="profile-heading">My Account</h3>

                  <div className="profile-details">
                    <div className="profile-detail-row">
                      <span className="profile-label">
                        Username
                      </span>

                      <span className="profile-value">
                        {user.username}
                      </span>
                    </div>

                    <div className="profile-detail-row">
                      <span className="profile-label">
                        Email
                      </span>

                      <span className="profile-value">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="profile-menu-actions">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/builder");
                      }}
                    >
                      My Resume
                    </button>

                    <button onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="profile-heading">Welcome!</h3>

                  <div className="profile-menu-actions">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/login");
                      }}
                    >
                      Login
                    </button>

                    <button
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/signup");
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
