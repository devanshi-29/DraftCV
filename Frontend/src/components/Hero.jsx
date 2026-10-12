import "./Hero.css";
import { useNavigate } from "react-router-dom";
import heroResume from "../assets/hero-resume.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">

      <div className="hero-content">
        <p className="hero-label">AI-POWERED RESUME BUILDER</p>

        <h1>
          Your resume,
          <br />
          written <span>as you type it.</span>
        </h1>

        <p className="hero-description">
          Fill in your details. Watch your resume take shape on the right —
          section by section, line by line. Then refine it with AI and
          download it when you're ready.
        </p>

        <div className="hero-btns">
          <button
            className="hero-button"
            onClick={() => navigate("/builder")}
          >
            Build My Resume
          </button>

          <button
            className="hero-button"
            onClick={() =>
              document.getElementById("templates")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            See Templates
          </button>
        </div>
      </div>

      <div className="hero-preview">
        <img
          src={heroResume}
          alt="Resume Builder Preview"
          className="hero-resume-image"
        />
      </div>

    </section>
  );
};

export default Hero;