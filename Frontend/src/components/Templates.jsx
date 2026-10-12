import { useNavigate } from "react-router-dom";
import "./Templates.css";
function Templates() {
    const navigate = useNavigate();
  return (
    <section id="templates" className="templates-section">
      <div className="templates-heading">
        <h2>Choose your template</h2>
        <p>Pick a design that fits your style and start building.</p>
      </div>


      <div className="templates-grid">

        {/* Grid Template */}
        <div className="template-card">
          <div className="template-preview grid-preview">
  <div className="grid-name">YOUR NAME</div>
  <div className="grid-role">Software Developer</div>

  <div className="grid-contact">
    email@example.com · +91 98765 43210 · LinkedIn
  </div>

  <div className="grid-title">SUMMARY</div>
  <div className="grid-line"></div>
  <div className="grid-line"></div>

  <div className="grid-title">EXPERIENCE</div>
  <div className="grid-line"></div>
  <div className="grid-line"></div>
  <div className="grid-line short"></div>

  <div className="grid-title">EDUCATION</div>
  <div className="grid-line"></div>
  <div className="grid-line short"></div>

  <div className="grid-title">SKILLS</div>
  <div className="grid-line"></div>
</div>

          <h3>Grid</h3>
          <p>Clean & ATS-friendly for every application</p>

          <button onClick={() => navigate("/builder?template=grid")}>
             Use this template →
           </button>
        </div>

        {/* Ledger Template */}
        <div className="template-card">
          <div className="template-preview ledger-preview">
  <div className="ledger-name">YOUR NAME</div>
  <div className="ledger-contact">
    email@example.com · +91 98765 43210
  </div>

  <div className="ledger-divider"></div>

  <div className="ledger-section">EXPERIENCE</div>

  <div className="ledger-entry">
    <div className="ledger-entry-title">Software Developer</div>
    <div className="ledger-entry-date">2024 — Present</div>
  </div>

  <div className="ledger-line"></div>
  <div className="ledger-line short"></div>

  <div className="ledger-section">EDUCATION</div>

  <div className="ledger-entry">
    <div className="ledger-entry-title">B.Tech Computer Science</div>
    <div className="ledger-entry-date">2022 — 2026</div>
  </div>

  <div className="ledger-line"></div>
  <div className="ledger-line short"></div>

  <div className="ledger-section">SKILLS</div>

  <div className="ledger-skills">
    React · Java · JavaScript · SQL
  </div>
</div>

          <h3>Ledger</h3>
          <p>Professional & polished for a corporate look</p>

          <button onClick={() => navigate("/builder?template=ledger")}>
            Use this template →
          </button>
        </div>

        {/* Signal Template */}
        <div className="template-card">
          <div className="template-preview signal-preview">
  <div className="signal-top">
    <div>
      <div className="signal-name">YOUR NAME</div>
      <div className="signal-role">Software Developer</div>
    </div>

    <div className="signal-contact">
      email@example.com<br />
      +91 98765 43210
    </div>
  </div>

  <div className="signal-accent"></div>

  <div className="signal-section">
    <span>PROFILE</span>
    <div className="signal-line"></div>
    <div className="signal-line short"></div>
  </div>

  <div className="signal-section">
    <span>EXPERIENCE</span>
    <div className="signal-line"></div>
    <div className="signal-line"></div>
    <div className="signal-line short"></div>
  </div>

  <div className="signal-section">
    <span>PROJECTS</span>
    <div className="signal-line"></div>
    <div className="signal-line short"></div>
  </div>

  <div className="signal-section">
    <span>SKILLS</span>
    <div className="signal-skills">
      React · Java · JavaScript · SQL
    </div>
  </div>
</div>

          <h3>Signal</h3>
          <p>Modern & minimal with a distinctive style</p>
            <button onClick={() => navigate("/builder?template=signal")}>
            Use this template →
           </button>
        </div>
        {/* Original Template */}
<div className="template-card">
  <div className="template-preview original-preview">

    <div className="original-name">YOUR NAME</div>

    <div className="original-contact">
      email@example.com · +91 98765 43210 · Location
    </div>

    <div className="original-section">SUMMARY</div>
    <div className="original-text"></div>
    <div className="original-text"></div>

    <div className="original-section">EXPERIENCE</div>

    <div className="original-entry">
      <strong>Software Developer | Company</strong>
      <span>2024 — Present</span>
    </div>

    <div className="original-text"></div>
    <div className="original-text short"></div>

    <div className="original-section">EDUCATION</div>

    <div className="original-entry">
      <strong>B.Tech Computer Science</strong>
      <span>2022 — 2026</span>
    </div>

    <div className="original-section">SKILLS</div>
    <div className="original-skills">
      Java · React · JavaScript · SQL
    </div>

  </div>

  <h3>Classic</h3>
<p>Clean & professional for every application</p>

  <button onClick={() => navigate("/builder?template=original")}>
    Use this template →
  </button>
</div>
      </div>
    </section>
  );
}

export default Templates;