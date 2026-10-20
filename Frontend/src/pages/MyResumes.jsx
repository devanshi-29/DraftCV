
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyResumes.css";

const API_URL = "http://localhost:3000/api/resumes";

const templateNames = {
  grid: "Grid",
  ledger: "Ledger",
  signal: "Signal",
  original: "Original",
};

function MyResumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Could not load your resumes.");
      }

      const list = Array.isArray(result)
        ? result
        : result.resumes || result.data || [];

      if (!Array.isArray(list)) {
        throw new Error("Unexpected response received from the server.");
      }

      setResumes(list);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleEdit = (resume) => {
    navigate(
      `/builder?template=${encodeURIComponent(
        resume.template || "original"
      )}&resumeId=${encodeURIComponent(resume._id)}`
    );
  };

  const handleDelete = async (resume) => {
    const confirmed = window.confirm(
      `Delete "${resume.title || "Untitled Resume"}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(resume._id);
    setError("");

    try {
      const response = await fetch(`${API_URL}/${resume._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Could not delete this resume.");
      }

      setResumes((current) =>
        current.filter((item) => item._id !== resume._id)
      );
    } catch (err) {
      setError(err.message || "Unable to delete this resume.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="my-resumes-page">
      <header className="my-resumes-header">
        <div>
          <p className="my-resumes-label">YOUR WORKSPACE</p>
          <h1>My Resumes</h1>
          <p className="my-resumes-subtitle">
            All your resumes, organized in one place.
          </p>
        </div>

        <button
          className="new-resume-btn"
          onClick={() => navigate("/builder")}
        >
          + Create Resume
        </button>
      </header>

      {error && (
        <div className="resumes-error" role="alert">
          {error}
          <button onClick={fetchResumes}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="resumes-status">Loading your resumes...</div>
      ) : resumes.length > 0 ? (
        <>
          <div className="resumes-list-heading">
            <h2>Saved resumes</h2>
            <span>{resumes.length} total</span>
          </div>

          <section className="resumes-grid">
            {resumes.map((resume) => (
              <article className="resume-card" key={resume._id}>
                <div className="resume-card-preview">
                  <span className="resume-file-icon">▤</span>
                  <span className="resume-template-tag">
                    {templateNames[resume.template] || "Resume"}
                  </span>
                </div>

                <div className="resume-card-details">
                  <h3>{resume.title || "Untitled Resume"}</h3>

                  <p>
                    Updated{" "}
                    {resume.updatedAt
                      ? new Date(resume.updatedAt).toLocaleDateString()
                      : "recently"}
                  </p>

                  <div className="resume-card-actions">
                    <button
                      className="resume-edit-btn"
                      onClick={() => handleEdit(resume)}
                    >
                      Edit Resume
                    </button>

                    <button
                      className="resume-delete-btn"
                      disabled={deletingId === resume._id}
                      onClick={() => handleDelete(resume)}
                    >
                      {deletingId === resume._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </>
      ) : (
        <section className="resumes-content">
          <div className="resumes-empty-state">
            <div className="empty-resume-icon">▤</div>
            <h2>Your next opportunity starts here</h2>
            <p>
              You haven't saved any resumes yet. Create one and save
              it here to edit or manage it anytime.
            </p>
            <button
              className="create-first-resume-btn"
              onClick={() => navigate("/builder")}
            >
              Create Your First Resume
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default MyResumes;
