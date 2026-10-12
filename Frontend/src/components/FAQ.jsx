import "./FAQ.css";

function FAQ() {
  const faqs = [
    {
      question: "Is DraftCV free to use?",
      answer:
        "Yes, DraftCV is designed to help you create and customize your resume easily without any complicated setup.",
    },
    {
      question: "Can I download my resume as a PDF?",
      answer:
        "Yes, you can download your completed resume as a professionally formatted PDF.",
    },
    {
      question: "Can I customize my resume?",
      answer:
        "Yes, you can customize sections, spacing, and other resume settings according to your needs.",
    },
    {
      question: "Is my resume ATS-friendly?",
      answer:
        "DraftCV follows a clean and structured resume format designed to improve readability and ATS compatibility.",
    },
    {
      question: "Can I save my resume and edit it later?",
      answer:
        "Yes, your resume data can be saved locally so you can continue editing it later.",
    },
    {
      question: "Does DraftCV provide AI assistance?",
      answer:
        "Yes, DraftCV includes AI-powered assistance to help refine and improve your resume content.",
    },
  ];

  return (
    <section className="faq-section" id="faq">
      <div className="faq-header">
        <h2>Frequently Asked Questions</h2>
        <p>
          Everything you need to know about creating your resume with DraftCV.
        </p>
      </div>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <details className="faq-item" key={index}>
            <summary>
              {faq.question}
              <span>+</span>
            </summary>

            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default FAQ;