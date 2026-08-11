
import "./Hero.css";

const Hero = () => {
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
        <button className="hero-button">
          Build my resume <span>→</span>
        </button>

         <button className="hero-button">
          See templates
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