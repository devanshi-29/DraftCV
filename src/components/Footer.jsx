import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-brand">
          <h2>DraftCV</h2>
          <p>
            Build a professional resume that gets noticed.
          </p>
        </div>

        <div className="footer-links">
          <h3>Product</h3>
          <a href="/builder">Resume Builder</a>
          <a href="#templates">Templates</a>
          <a href="#faq">FAQs</a>
        </div>

        <div className="footer-links">
          <h3>Resources</h3>
          <a href="#how-it-works">How It Works</a>
          <a href="#templates">Resume Templates</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 DraftCV. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;