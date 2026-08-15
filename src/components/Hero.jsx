
import "./Hero.css";
import { useNavigate } from "react-router-dom";
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

        <div className='hero-btns'>
        <button  className="hero-button" onClick={() => navigate("/builder")}>
         Build My Resume
         </button>

         <button className="hero-button"
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
        <div className="resume-paper">
          <div className="resume-header">
            <div className="resume-name">Devanshi</div>
            <div className="resume-contact">B.Tech CSE | Aspiring SDE</div>
          </div>
           <div className="resume-section">Projects</div>
          <div className="resume-line"></div>
          <div className="resume-line short"></div>

          <div className="resume-section">Experience</div>
          <div className="resume-line"></div>
          <div className="resume-line"></div>
          <div className="resume-line short"></div>

          <div className="resume-section">Skills</div>
          <div className="resume-line"></div>
          <div className="resume-line short"></div>
        </div>
      </div>

    </section>
  );
};

export default Hero;