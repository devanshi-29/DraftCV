import "./HowItWorks.css";

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">

      <div className="how-header">
        <h2>Three steps, in order - nothing to guess</h2>
        <p>
          The build follows one path from blank page to finished PDF.        
        </p>
      </div>

      <div className="steps">

        <div className="step">
          <span className="step-number">01</span>

          <h3>Fill in your details</h3>

          <p>
            Add your education, experience, projects and skills as repeatable entries- add or remove any section as your history grows.            
          </p>
        </div>


        <div className="step">
          <span className="step-number">02</span>

          <h3>Watch it render</h3>

          <p>
            Every keystroke updates the resume beside it, live - so you always see exactly what a recruiter will.
          </p>
        </div>


        <div className="step">
          <span className="step-number">03</span>

          <h3>Refine & download</h3>

          <p>
            Improve your content with AI and export a clean,
            professional resume when you're ready.
          </p>
        </div>

      </div>

    </section>
  );
};

export default HowItWorks;