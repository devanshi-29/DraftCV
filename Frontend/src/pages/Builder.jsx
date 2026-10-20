import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useSearchParams } from "react-router-dom";
import "./Builder.css";

const API_URL = "http://localhost:3000/api/resumes";

const PAGE_HEIGHT_MM = 297;
const PAGE_PADDING_MM = 12;
const PAGE_CONTENT_HEIGHT_PX =
  ((PAGE_HEIGHT_MM - PAGE_PADDING_MM * 2) * 96) / 25.4;

const DEFAULT_SPACING = {
  letterSpacing: 0,
  lineSpacing: 1.4,
  sectionSpacing: 15,
};

const DEFAULT_SECTIONS = ["summary"];

const getLocalResume = () => {
  try {
    return JSON.parse(localStorage.getItem("draftcv-resume")) || {};
  } catch {
    return {};
  }
};

const getLocalSections = () => {
  try {
    return (
      JSON.parse(localStorage.getItem("draftcv-sections")) ||
      DEFAULT_SECTIONS
    );
  } catch {
    return DEFAULT_SECTIONS;
  }
};

const Builder = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const resumeId = searchParams.get("resumeId");
  const selectedTemplate = searchParams.get("template") || "original";

  const {
    register,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: getLocalResume(),
  });

  const [resumeTitle, setResumeTitle] = useState("Untitled Resume");
  const [sections, setSections] = useState(getLocalSections);
  const [spacing, setSpacing] = useState(DEFAULT_SPACING);

  const [aiResult, setAiResult] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [pageGroups, setPageGroups] = useState([]);

  const [isReady, setIsReady] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const measureRef = useRef(null);
  const loadedResumeIdRef = useRef(null);
  const formData = watch();

  // --------------------------------------------------
  // LOAD A SAVED RESUME
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadResume = async () => {
      setSaveMessage("");
      setSaveError("");

      if (!resumeId) {
        setIsLoadingResume(false);
        setIsReady(true);
        loadedResumeIdRef.current = null;
        return;
      }

      // Avoid reloading the same resume unnecessarily.
      if (loadedResumeIdRef.current === resumeId) {
        setIsReady(true);
        return;
      }

      setIsLoadingResume(true);
      setIsReady(false);

      try {
        const response = await fetch(`${API_URL}/${resumeId}`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load resume.");
        }

        if (cancelled) return;

        const savedResume = result.resume;

        if (!savedResume) {
          throw new Error("Resume data was not found.");
        }

        const savedData = savedResume.resumeData || {};

        // Support the structure used by this builder.
        const savedFormData =
          savedData.formData && typeof savedData.formData === "object"
            ? savedData.formData
            : savedData;

        reset(savedFormData);

        setResumeTitle(savedResume.title || "Untitled Resume");

        setSections(
          Array.isArray(savedData.sections)
            ? savedData.sections
            : DEFAULT_SECTIONS
        );

        setSpacing({
          ...DEFAULT_SPACING,
          ...(savedData.spacing || {}),
        });

        if (
          savedResume.template &&
          savedResume.template !== selectedTemplate
        ) {
          setSearchParams(
            (previous) => {
              const updated = new URLSearchParams(previous);
              updated.set("template", savedResume.template);
              return updated;
            },
            { replace: true }
          );
        }

        localStorage.setItem(
          "draftcv-resume",
          JSON.stringify(savedFormData)
        );

        localStorage.setItem(
          "draftcv-sections",
          JSON.stringify(
            Array.isArray(savedData.sections)
              ? savedData.sections
              : DEFAULT_SECTIONS
          )
        );

        loadedResumeIdRef.current = resumeId;
        setSaveMessage("Saved resume loaded successfully.");
      } catch (error) {
        if (!cancelled) {
          console.error("LOAD RESUME ERROR:", error);
          setSaveError(error.message || "Failed to load resume.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingResume(false);
          setIsReady(true);
        }
      }
    };

    loadResume();

    return () => {
      cancelled = true;
    };
  }, [resumeId, reset, setSearchParams]);

  // --------------------------------------------------
  // LOCAL STORAGE AUTOSAVE
  // --------------------------------------------------

  useEffect(() => {
    if (!isReady) return;

    localStorage.setItem(
      "draftcv-resume",
      JSON.stringify(formData)
    );
  }, [formData, isReady]);

  useEffect(() => {
    if (!isReady) return;

    localStorage.setItem(
      "draftcv-sections",
      JSON.stringify(sections)
    );
  }, [sections, isReady]);

  // --------------------------------------------------
  // SAVE NEW RESUME OR UPDATE EXISTING RESUME
  // --------------------------------------------------

  const saveResume = async () => {
    if (isSaving || isLoadingResume || !isReady) return;

    const title = resumeTitle.trim();

    if (!title) {
      setSaveError("Please enter a resume title.");
      setSaveMessage("");
      return;
    }

    setIsSaving(true);
    setSaveError("");
    setSaveMessage("");

    try {
      const payload = {
        title,
        template: selectedTemplate,
        resumeData: {
          formData,
          sections,
          spacing,
        },
      };

      const isUpdating = Boolean(resumeId);

      const response = await fetch(
        isUpdating ? `${API_URL}/${resumeId}` : API_URL,
        {
          method: isUpdating ? "PUT" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to save resume. Please check your login."
        );
      }

      if (!result.resume?._id) {
        throw new Error("Resume was saved, but its ID was not returned.");
      }

      setResumeTitle(result.resume.title || title);

      // A newly created resume gets an ID in the URL.
      // Subsequent saves will update this same resume.
      if (!isUpdating) {
        setSearchParams((previous) => {
          const updated = new URLSearchParams(previous);
          updated.set("resumeId", result.resume._id);
          return updated;
        });

        loadedResumeIdRef.current = result.resume._id;
      }

      setSaveMessage(
        isUpdating
          ? "Resume updated successfully."
          : "Resume saved successfully."
      );
    } catch (error) {
      console.error("SAVE RESUME ERROR:", error);
      setSaveError(
        error.message ||
          "Something went wrong while saving your resume."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------
  // PDF DOWNLOAD
  // --------------------------------------------------

  const downloadPDF = async () => {
    const pages = document.querySelectorAll(
      ".resume-pages .resume-preview"
    );

    if (!pages.length) {
      setSaveError("There is no resume preview to download.");
      return;
    }

    try {
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.98);

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
      }

      const safeTitle =
        resumeTitle.trim().replace(/[<>:"/\\|?*]+/g, "-") ||
        "my-resume";

      pdf.save(`${safeTitle}.pdf`);
    } catch (error) {
      console.error("PDF DOWNLOAD ERROR:", error);
      setSaveError("Failed to generate PDF. Please try again.");
    }
  };

  // --------------------------------------------------
  // CLEAR CURRENT RESUME FORM
  // --------------------------------------------------

  const clearResume = () => {
    const confirmed = window.confirm(
      "Clear the current resume form? Unsaved form data will be removed."
    );

    if (!confirmed) return;

    reset({});
    setSections([]);
    setSpacing(DEFAULT_SPACING);
    setResumeTitle("Untitled Resume");
    setAiResult(null);
    setJobDescription("");
    setSaveMessage("");
    setSaveError("");

    loadedResumeIdRef.current = null;

    localStorage.removeItem("draftcv-resume");
    localStorage.removeItem("draftcv-sections");

    // Keep the saved MongoDB record intact.
    // Remove its ID from this editing session.
    setSearchParams({
      template: selectedTemplate,
    });
  };

  // --------------------------------------------------
  // REACT HOOK FORM FIELD ARRAYS
  // --------------------------------------------------

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "experiences",
  });

  // --------------------------------------------------
  // AI RESUME ANALYSIS
  // --------------------------------------------------

  const prepareAIData = () => ({
    resume: formData,
    jobDescription,
  });

  const analyzeResumeWithAI = async () => {
    setSaveError("");
    setSaveMessage("");

    if (!jobDescription.trim()) {
      setSaveError("Please paste a job description first.");
      return;
    }

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prepareAIData()),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "AI analysis failed.");
      }

      console.log("AI RESPONSE:", data);
      setAiResult(data);
    } catch (error) {
      console.error("AI ERROR:", error);
      setSaveError(
        error.message || "Failed to analyze your resume."
      );
    }
  };

  // --------------------------------------------------
  // BUILD RESUME PREVIEW BLOCKS
  // --------------------------------------------------

  const resumeBlocks = [];

  resumeBlocks.push({
    id: "personal",
    node: (
      <div className="resume-block resume-personal-block">
        <h1>{formData.name || "Your Name"}</h1>

        <p className="resume-contact">
          {formData.website ? (
            <a
              href={formData.website}
              target="_blank"
              rel="noreferrer"
            >
              {formData.websiteName || "Website"}
            </a>
          ) : (
            formData.websiteName || "Website"
          )}
          {" | "}
          {formData.email || "email@example.com"}
          {" | "}
          {formData.phone || "Phone"}
          {" | "}
          {formData.location || "Location"}
        </p>
      </div>
    ),
  });

  if (sections.includes("summary")) {
    resumeBlocks.push({
      id: "summary",
      node: (
        <div className="resume-block">
          <h2>Summary</h2>
          <p>
            {formData.summary ||
              "Your professional summary will appear here."}
          </p>
        </div>
      ),
    });
  }

  if (formData.experiences?.length > 0) {
    ["Experience", "Internship"].forEach((type) => {
      const filteredExperiences = formData.experiences.filter(
        (experience) => experience.type === type
      );

      if (filteredExperiences.length === 0) return;

      resumeBlocks.push({
        id: `experience-${type}`,
        node: (
          <div className="resume-block experience-group">
            <h2>{type}</h2>

            {filteredExperiences.map((experience, index) => (
              <div className="preview-experience" key={index}>
                <div className="gap-btw-comp-date">
                  <h3>
                    {experience.position || "Job Title"} |{" "}
                    {experience.company || "Company"}
                  </h3>

                  <p>
                    {experience.startDate || "Start Date"}
                    {" - "}
                    {experience.endDate || "Present"}
                  </p>
                </div>

                {experience.description ? (
                  <ul className="experience-bullets">
                    {experience.description
                      .split("\n")
                      .filter((point) => point.trim() !== "")
                      .map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                  </ul>
                ) : (
                  <p>Your experience description</p>
                )}
              </div>
            ))}
          </div>
        ),
      });
    });
  }

  if (formData.education?.length > 0) {
    resumeBlocks.push({
      id: "education",
      node: (
        <div className="resume-block">
          <h2>Education</h2>

          {formData.education.map((education, index) => (
            <div className="preview-education" key={index}>
              <div className="gap-btw-comp-date">
                <h3>
                  {education.degree || "Degree"} |{" "}
                  {education.institution || "University / College"}
                </h3>

                <p>
                  {education.startDate || "Start Date"}
                  {" - "}
                  {education.endDate || "Present"}
                </p>
              </div>

              <p>{education.field || "Field of Study"}</p>
            </div>
          ))}
        </div>
      ),
    });
  }

  if (formData.projects?.length > 0) {
    resumeBlocks.push({
      id: "projects",
      node: (
        <div className="resume-block">
          <h2>Projects</h2>

          {formData.projects.map((project, index) => (
            <div className="preview-project" key={index}>
              <div className="project-title">
                <h3>{project.name || "Project Name"}</h3>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Project
                  </a>
                )}
              </div>

              <p className="project-tech">
                {project.technologies || "Technologies used"}
              </p>

              {project.description ? (
                <ul className="project-bullets">
                  {project.description
                    .split("\n")
                    .filter((point) => point.trim() !== "")
                    .map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                </ul>
              ) : (
                <p>Your project description will appear here.</p>
              )}
            </div>
          ))}
        </div>
      ),
    });
  }

  if (formData.skills?.length > 0) {
    resumeBlocks.push({
      id: "skills",
      node: (
        <div className="resume-block">
          <h2>Technical Skills & Achievements</h2>

          <ul className="skills-preview">
            {formData.skills.map((skill, index) => (
              <li key={index}>
                <span className="skill-heading">
                  {skill.heading || "Skill Heading"}:
                </span>{" "}
                <span className="skill-description">
                  {skill.description || "Skill description"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ),
    });
  }

  if (formData.certifications?.length > 0) {
    resumeBlocks.push({
      id: "certifications",
      node: (
        <div className="resume-block">
          <h2>Certifications</h2>

          <div className="certifications-preview">
            {formData.certifications.map((certification, index) => (
              <div
                className="preview-certification"
                key={index}
              >
                <div className="certification-row">
                  <div className="certification-info">
                    <span className="certification-name">
                      {certification.name || "Certification Name"}
                    </span>

                    <span className="separator">{" | "}</span>

                    <span className="certification-org">
                      {certification.organization || "Organization"}
                    </span>

                    {certification.link && (
                      <>
                        <span className="separator">{" | "}</span>
                        <a
                          href={certification.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Credential
                        </a>
                      </>
                    )}
                  </div>

                  <span className="certification-date">
                    {certification.date || "Date"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    });
  }

  // --------------------------------------------------
  // AUTOMATIC A4 PAGINATION
  // --------------------------------------------------

  useLayoutEffect(() => {
    if (!isReady) return undefined;

    const calculatePages = () => {
      const container = measureRef.current;
      if (!container) return;

      const elements = Array.from(
        container.querySelectorAll("[data-resume-block]")
      );

      if (!elements.length) {
        setPageGroups([]);
        return;
      }

      const measurePage = container.querySelector(".resume-preview");
      const containerRect = measurePage?.getBoundingClientRect();

      if (!measurePage || !containerRect) return;

      const computedStyle = window.getComputedStyle(measurePage);
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const contentTop = containerRect.top + paddingTop;

      const groups = [];
      let currentPage = [];
      let currentPageStart = 0;

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();

        const bottom = rect.bottom - contentTop;

        if (currentPage.length === 0) {
          currentPageStart = groups.length;
        }

        const BOTTOM_GAP_PX = 15;

        const currentPageBottom =
          (currentPageStart + 1) * PAGE_CONTENT_HEIGHT_PX -
          BOTTOM_GAP_PX;

        if (
          currentPage.length > 0 &&
          bottom > currentPageBottom
        ) {
          groups.push(currentPage);
          currentPage = [];
          currentPageStart += 1;
        }

        currentPage.push(element.dataset.resumeBlock);
      });

      if (currentPage.length > 0) {
        groups.push(currentPage);
      }

      setPageGroups(groups);
    };

    const frame = requestAnimationFrame(calculatePages);

    const resizeObserver = new ResizeObserver(calculatePages);

    if (measureRef.current) {
      resizeObserver.observe(measureRef.current);
    }

    window.addEventListener("resize", calculatePages);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculatePages);
    };
  }, [
    formData,
    sections,
    educationFields,
    projectFields,
    skillFields,
    certificationFields,
    fields,
    spacing,
    isReady,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 80);

    return () => clearTimeout(timer);
  }, [pageGroups.length]);

  const getBlockById = (id) =>
    resumeBlocks.find((block) => block.id === id);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="builder">
      {/* LEFT SIDE - FORM */}
      <div className="builder-form">
        <h1>Build your resume</h1>

        <p>
          Fill in your details and see your resume update live.
        </p>

        {/* SAVE / UPDATE RESUME */}
        <div className="form-section resume-save-section">
          <h2>Save Your Resume</h2>

          <label htmlFor="resume-title">Resume Title</label>

          <input
            id="resume-title"
            type="text"
            placeholder="e.g. Frontend Developer Resume"
            value={resumeTitle}
            onChange={(event) => setResumeTitle(event.target.value)}
            maxLength={100}
          />

          <button
            type="button"
            className="save-resume-btn"
            onClick={saveResume}
            disabled={isSaving || isLoadingResume || !isReady}
          >
            {isSaving
              ? "Saving..."
              : resumeId
                ? "Update Resume"
                : "Save Resume"}
          </button>

          {isLoadingResume && (
            <p role="status">Loading saved resume...</p>
          )}

          {saveMessage && (
            <p className="save-success" role="status">
              {saveMessage}
            </p>
          )}

          {saveError && (
            <p className="error" role="alert">
              {saveError}
            </p>
          )}
        </div>

        {/* SPACING CUSTOMIZATION */}
        <div className="form-section spacing-section">
          <h2>Spacing Customization</h2>

          <label>
            Letter Spacing: {spacing.letterSpacing}px
          </label>

          <input
            type="range"
            min="-1"
            max="5"
            step="0.1"
            value={spacing.letterSpacing}
            onChange={(event) =>
              setSpacing({
                ...spacing,
                letterSpacing: Number(event.target.value),
              })
            }
          />

          <label>Line Spacing: {spacing.lineSpacing}</label>

          <input
            type="range"
            min="1"
            max="2.5"
            step="0.1"
            value={spacing.lineSpacing}
            onChange={(event) =>
              setSpacing({
                ...spacing,
                lineSpacing: Number(event.target.value),
              })
            }
          />

          <label>
            Section Spacing: {spacing.sectionSpacing}px
          </label>

          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={spacing.sectionSpacing}
            onChange={(event) =>
              setSpacing({
                ...spacing,
                sectionSpacing: Number(event.target.value),
              })
            }
          />
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="form-section">
          <h2>Personal Information</h2>

          <input
            type="text"
            placeholder="Full name"
            {...register("name", {
              required: "Name is required",
            })}
          />

          {errors.name && (
            <p className="error">{errors.name.message}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
          />

          {errors.email && (
            <p className="error">{errors.email.message}</p>
          )}

          <input
            type="text"
            placeholder="Phone"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit phone number",
              },
            })}
          />

          {errors.phone && (
            <p className="error">{errors.phone.message}</p>
          )}

          <input
            type="text"
            placeholder="Location"
            {...register("location")}
          />

          <input
            type="url"
            placeholder="Website"
            {...register("website", {
              pattern: {
                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/,
                message: "Enter a valid website URL",
              },
            })}
          />

          {errors.website && (
            <p className="error">{errors.website.message}</p>
          )}

          <input
            type="text"
            placeholder="Website name (e.g. GitHub, LinkedIn)"
            {...register("websiteName")}
          />
        </div>

        {/* SUMMARY */}
        {sections.includes("summary") && (
          <div className="form-section">
            <div className="section-heading">
              <h2>Summary</h2>

              <button
                type="button"
                className="remove-section"
                onClick={() =>
                  setSections(
                    sections.filter((section) => section !== "summary")
                  )
                }
              >
                −
              </button>
            </div>

            <textarea
              placeholder="Write a short professional summary..."
              {...register("summary")}
            />
          </div>
        )}

        {!sections.includes("summary") && (
          <div className="add-section">
            <button
              type="button"
              onClick={() => setSections([...sections, "summary"])}
            >
              + Add Summary
            </button>
          </div>
        )}

        {/* EXPERIENCE */}
        {fields.map((field, index) => (
          <div className="form-section" key={field.id}>
            <div className="section-heading">
              <select
                {...register(`experiences.${index}.type`)}
                className="section-type"
              >
                <option value="Experience">Experience</option>
                <option value="Internship">Internship</option>
              </select>

              <button
                type="button"
                className="remove-section"
                onClick={() => remove(index)}
              >
                −
              </button>
            </div>

            <input
              type="text"
              placeholder="Company"
              {...register(`experiences.${index}.company`, {
                required: "Company name is required",
              })}
            />

            {errors.experiences?.[index]?.company && (
              <p className="error">
                {errors.experiences[index].company.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Job title"
              {...register(`experiences.${index}.position`, {
                required: "Job title is required",
              })}
            />

            {errors.experiences?.[index]?.position && (
              <p className="error">
                {errors.experiences[index].position.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Start date"
              {...register(`experiences.${index}.startDate`, {
                required: "Start date is required",
              })}
            />

            {errors.experiences?.[index]?.startDate && (
              <p className="error">
                {errors.experiences[index].startDate.message}
              </p>
            )}

            <input
              type="text"
              placeholder="End date"
              {...register(`experiences.${index}.endDate`)}
            />

            <textarea
              placeholder="Describe your role and responsibilities..."
              {...register(`experiences.${index}.description`, {
                required: "Description is required",
              })}
            />

            {errors.experiences?.[index]?.description && (
              <p className="error">
                {errors.experiences[index].description.message}
              </p>
            )}
          </div>
        ))}

        <div className="add-section">
          <button
            type="button"
            onClick={() =>
              append({
                type: "Experience",
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                description: "",
              })
            }
          >
            + Add Experience
          </button>
        </div>

        {/* EDUCATION */}
        {educationFields.map((field, index) => (
          <div className="form-section" key={field.id}>
            <div className="section-heading">
              <h2>Education {index + 1}</h2>

              <button
                type="button"
                className="remove-section"
                onClick={() => removeEducation(index)}
              >
                −
              </button>
            </div>

            <input
              type="text"
              placeholder="University / College"
              {...register(`education.${index}.institution`, {
                required: "University / College is required",
              })}
            />

            {errors.education?.[index]?.institution && (
              <p className="error">
                {errors.education[index].institution.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Degree"
              {...register(`education.${index}.degree`, {
                required: "Degree is required",
              })}
            />

            {errors.education?.[index]?.degree && (
              <p className="error">
                {errors.education[index].degree.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Field of Study"
              {...register(`education.${index}.field`, {
                required: "Field of study is required",
              })}
            />

            {errors.education?.[index]?.field && (
              <p className="error">
                {errors.education[index].field.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Start date"
              {...register(`education.${index}.startDate`, {
                required: "Start date is required",
              })}
            />

            {errors.education?.[index]?.startDate && (
              <p className="error">
                {errors.education[index].startDate.message}
              </p>
            )}

            <input
              type="text"
              placeholder="End date"
              {...register(`education.${index}.endDate`)}
            />
          </div>
        ))}

        <div className="add-section">
          <button
            type="button"
            onClick={() =>
              appendEducation({
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
              })
            }
          >
            + Add Education
          </button>
        </div>

        {/* PROJECTS */}
        {projectFields.map((field, index) => (
          <div className="form-section" key={field.id}>
            <div className="section-heading">
              <h2>Project {index + 1}</h2>

              <button
                type="button"
                className="remove-section"
                onClick={() => removeProject(index)}
              >
                −
              </button>
            </div>

            <input
              type="text"
              placeholder="Project name"
              {...register(`projects.${index}.name`, {
                required: "Project name is required",
              })}
            />

            {errors.projects?.[index]?.name && (
              <p className="error">
                {errors.projects[index].name.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Technologies used (e.g. React, JavaScript)"
              {...register(`projects.${index}.technologies`, {
                required: "Technologies are required",
              })}
            />

            {errors.projects?.[index]?.technologies && (
              <p className="error">
                {errors.projects[index].technologies.message}
              </p>
            )}

            <textarea
              placeholder="Describe your project..."
              {...register(`projects.${index}.description`, {
                required: "Project description is required",
              })}
            />

            {errors.projects?.[index]?.description && (
              <p className="error">
                {errors.projects[index].description.message}
              </p>
            )}

            <input
              type="url"
              placeholder="Project link"
              {...register(`projects.${index}.link`, {
                pattern: {
                  value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/,
                  message: "Enter a valid project URL",
                },
              })}
            />

            {errors.projects?.[index]?.link && (
              <p className="error">
                {errors.projects[index].link.message}
              </p>
            )}
          </div>
        ))}

        <div className="add-section">
          <button
            type="button"
            onClick={() =>
              appendProject({
                name: "",
                technologies: "",
                description: "",
                link: "",
              })
            }
          >
            + Add Project
          </button>
        </div>

        {/* TECHNICAL SKILLS */}
        {skillFields.map((field, index) => (
          <div className="form-section" key={field.id}>
            <div className="section-heading">
              <h2>Technical Skill {index + 1}</h2>

              <button
                type="button"
                className="remove-section"
                onClick={() => removeSkill(index)}
              >
                −
              </button>
            </div>

            <input
              type="text"
              placeholder="Skill heading (e.g. Core Subjects)"
              {...register(`skills.${index}.heading`, {
                required: "Skill heading is required",
              })}
            />

            {errors.skills?.[index]?.heading && (
              <p className="error">
                {errors.skills[index].heading.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Description (e.g. OOPS, CN, OS, DBMS)"
              {...register(`skills.${index}.description`, {
                required: "Skill description is required",
              })}
            />

            {errors.skills?.[index]?.description && (
              <p className="error">
                {errors.skills[index].description.message}
              </p>
            )}
          </div>
        ))}

        <div className="add-section">
          <button
            type="button"
            onClick={() =>
              appendSkill({
                heading: "",
                description: "",
              })
            }
          >
            + Add Skill
          </button>
        </div>

        {/* CERTIFICATIONS */}
        {certificationFields.map((field, index) => (
          <div className="form-section" key={field.id}>
            <div className="section-heading">
              <h2>Certification {index + 1}</h2>

              <button
                type="button"
                className="remove-section"
                onClick={() => removeCertification(index)}
              >
                −
              </button>
            </div>

            <input
              type="text"
              placeholder="Certification name"
              {...register(`certifications.${index}.name`, {
                required: "Certification name is required",
              })}
            />

            {errors.certifications?.[index]?.name && (
              <p className="error">
                {errors.certifications[index].name.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Issuing organization"
              {...register(`certifications.${index}.organization`, {
                required: "Issuing organization is required",
              })}
            />

            {errors.certifications?.[index]?.organization && (
              <p className="error">
                {errors.certifications[index].organization.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Date"
              {...register(`certifications.${index}.date`)}
            />

            <input
              type="url"
              placeholder="Credential / Certificate link"
              {...register(`certifications.${index}.link`, {
                pattern: {
                  value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/,
                  message: "Enter a valid certificate URL",
                },
              })}
            />

            {errors.certifications?.[index]?.link && (
              <p className="error">
                {errors.certifications[index].link.message}
              </p>
            )}
          </div>
        ))}

        <div className="add-section">
          <button
            type="button"
            onClick={() =>
              appendCertification({
                name: "",
                organization: "",
                date: "",
                link: "",
              })
            }
          >
            + Add Certification
          </button>
        </div>

        {/* AI RESUME OPTIMIZATION */}
        <div className="ai-section">
          <div className="ai-header">
            <span className="ai-badge">AI POWERED</span>

            <h2>Make Your Resume Job-Ready</h2>

            <p>
              Get AI-powered insights tailored to your target role.
              Paste a job description and discover what your resume
              is missing.
            </p>
          </div>

          <div className="jd-box">
            <label>Target Job Description</label>

            <textarea
              placeholder="Paste the job description you're applying for..."
              rows="8"
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
            />
          </div>

          <button
            type="button"
            className="ai-btn"
            onClick={analyzeResumeWithAI}
          >
            Optimize My Resume
          </button>
        </div>
      </div>

      {/* RIGHT SIDE - RESUME PREVIEW */}
      <div className="builder-preview">
        <div className="preview-navigation">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("resume-preview-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
            }
          >
            View Resume
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("ai-analysis-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
            }
          >
            AI Resume Analysis
          </button>
        </div>

        {/* AI ANALYSIS RESULTS */}
        {aiResult && (
          <div
            id="ai-analysis-section"
            className="ai-analysis-card"
          >
            <div className="ai-analysis-header">
              <div>
                <span className="ai-label">AI POWERED</span>
                <h2>Resume Intelligence</h2>
                <p>Smart insights tailored to your target job.</p>
              </div>

              <div className="ats-score">
                <span>{aiResult.atsScore}</span>
                <small>/100</small>
                <label>ATS SCORE</label>
              </div>
            </div>

            <div className="ai-analysis-section">
              <h3>Keyword Match</h3>

              {aiResult.matchedKeywords?.length > 0 ? (
                <div className="keyword-list">
                  {aiResult.matchedKeywords.map((keyword, index) => (
                    <span key={index}>{keyword}</span>
                  ))}
                </div>
              ) : (
                <p className="ai-muted">
                  No strong keyword matches found yet.
                </p>
              )}
            </div>

            <div className="ai-analysis-section">
              <h3>Missing Skills</h3>

              <div className="ai-list">
                {aiResult.missingSkills?.map((skill, index) => (
                  <div key={index}>
                    <span>+</span>
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="ai-analysis-section">
              <h3>Missing Keywords</h3>

              <div className="ai-list">
                {aiResult.missingKeywords?.map((keyword, index) => (
                  <div key={index}>
                    <span>+</span>
                    {keyword}
                  </div>
                ))}
              </div>
            </div>

            <div className="ai-analysis-section">
              <h3>Resume Improvements</h3>

              <div className="ai-list">
                {aiResult.resumeImprovements?.map(
                  (improvement, index) => (
                    <div key={index}>
                      <span>✓</span>
                      {improvement}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="ai-analysis-section">
              <h3>Improved Summary</h3>

              <p className="improved-summary">
                {aiResult.improvedSummary}
              </p>
            </div>
          </div>
        )}

        {/* RESUME ACTIONS */}
        <div className="resume-actions">
          <button
            type="button"
            className="download-pdf-btn"
            onClick={downloadPDF}
          >
            Download PDF
          </button>

          <button
            type="button"
            className="clear-resume-btn"
            onClick={clearResume}
          >
            Clear Resume
          </button>
        </div>

        {/* PAGINATED PREVIEW */}
        <div id="resume-preview-section" className="resume-pages">
          {pageGroups.map((group, pageIndex) => (
            <div
              className="resume-page-wrapper"
              key={pageIndex}
            >
              <div className="resume-page-number">
                Page {pageIndex + 1}
              </div>

              <div
                className={`resume-preview ${selectedTemplate}-template`}
                style={{
                  letterSpacing: `${spacing.letterSpacing}px`,
                  lineHeight: spacing.lineSpacing,
                }}
              >
                {group.map((id) => {
                  const block = getBlockById(id);

                  return (
                    <div
                      className="resume-block-wrapper"
                      key={id}
                      style={{
                        marginBottom: `${spacing.sectionSpacing}px`,
                      }}
                    >
                      {block?.node}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* HIDDEN MEASUREMENT COPY FOR PAGINATION */}
        <div
          ref={measureRef}
          className="resume-measure"
          aria-hidden="true"
        >
          <div
            className={`resume-preview ${selectedTemplate}-template`}
            style={{
              letterSpacing: `${spacing.letterSpacing}px`,
              lineHeight: spacing.lineSpacing,
            }}
          >
            {resumeBlocks.map((block) => (
              <div
                key={block.id}
                data-resume-block={block.id}
                className="resume-block-wrapper"
                style={{
                  marginBottom: `${spacing.sectionSpacing}px`,
                }}
              >
                {block.node}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;