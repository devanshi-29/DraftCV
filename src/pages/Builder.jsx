import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./Builder.css";
import { useSearchParams } from "react-router-dom";

const PAGE_HEIGHT_MM = 297;
const PAGE_PADDING_MM = 12;
const PAGE_CONTENT_HEIGHT_PX = (PAGE_HEIGHT_MM - PAGE_PADDING_MM * 2) * 96 / 25.4;

const Builder = () => {
  const [searchParams] = useSearchParams();

  const selectedTemplate = searchParams.get("template") || "original";
  
  const {
    register,
    watch,
    reset,
    control,
    formState: { errors }
  } = useForm({ mode: "onBlur",
  defaultValues: JSON.parse(
    localStorage.getItem("draftcv-resume")
  ) || {} });


  const downloadPDF = async () => {
  const pages = document.querySelectorAll(
  ".resume-pages .resume-preview"
);

  if (!pages.length) return;

  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait"
  });

  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(
      imgData,
      "JPEG",
      0,
      0,
      210,
      297
    );
  }

  pdf.save("my-resume.pdf");
};

const [sections, setSections] = useState(
  JSON.parse(localStorage.getItem("draftcv-sections")) || ["summary"]
);

const [spacing, setSpacing] = useState({
  letterSpacing: 0,
  lineSpacing: 1.4,
  sectionSpacing: 15
});

  const [pageGroups, setPageGroups] = useState([]);
  const measureRef = useRef(null);

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation
  } = useFieldArray({ control, name: "education" });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject
  } = useFieldArray({ control, name: "projects" });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill
  } = useFieldArray({ control, name: "skills" });

  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification
  } = useFieldArray({ control, name: "certifications" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences"
  });

  const formData = watch();

  useEffect(() => {
  localStorage.setItem(
    "draftcv-resume",
    JSON.stringify(formData)
  );
}, [formData]);

useEffect(() => {
  localStorage.setItem(
    "draftcv-sections",
    JSON.stringify(sections)
  );
}, [sections]);

  /*
   * IMPORTANT:
   * Each item below is one logical resume block.
   * Pagination moves complete blocks to the next A4 page.
   * Nothing is manually hard-coded to "page 1/page 2".
   */
  const resumeBlocks = [];

  resumeBlocks.push({
    id: "personal",
    node: (
      <div className="resume-block resume-personal-block">
        <h1>{formData.name || "Your Name"}</h1>

        <p className="resume-contact">
          {formData.website ? (
            <a href={formData.website} target="_blank" rel="noreferrer">
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
    )
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
      )
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
        )
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
      )
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
      )
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
      )
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
              <div className="preview-certification" key={index}>
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
      )
    });
  }

  /*
   * Measure every logical block and calculate the page number.
   * A block is kept together so headings/content don't overlap.
   */
  useLayoutEffect(() => {
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

      const top = rect.top - contentTop;
      const bottom = rect.bottom - contentTop;

      /*
       * First block always starts from Page 1.
       */
      if (currentPage.length === 0) {
        currentPageStart = 0;
      }

      const BOTTOM_GAP_PX = 15;

const currentPageBottom =
  (currentPageStart + 1) * PAGE_CONTENT_HEIGHT_PX - BOTTOM_GAP_PX;

      /*
       * Move the block to the next page ONLY when
       * its top has actually reached the next page.
       *
       * We don't use `bottom > currentPageBottom`
       * because that was causing Summary to jump
       * completely to Page 2.
       */
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

    /*
     * Add the last page.
     */
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
  spacing
]);


  /*
   * Recalculate when fonts/layout settle.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 80);

    return () => clearTimeout(timer);
  }, [pageGroups.length]);

  const getBlockById = (id) =>
    resumeBlocks.find((block) => block.id === id);

  return (
    <div className="builder">

      {/* LEFT SIDE - FORM */}
      <div className="builder-form">
        <h1>Build your resume</h1>

        <p>
          Fill in your details and see your resume update live.
        </p>



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
    onChange={(e) =>
      setSpacing({
        ...spacing,
        letterSpacing: Number(e.target.value)
      })
    }
  />

  <label>
    Line Spacing: {spacing.lineSpacing}
  </label>

  <input
    type="range"
    min="1"
    max="2.5"
    step="0.1"
    value={spacing.lineSpacing}
    onChange={(e) =>
      setSpacing({
        ...spacing,
        lineSpacing: Number(e.target.value)
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
    onChange={(e) =>
      setSpacing({
        ...spacing,
        sectionSpacing: Number(e.target.value)
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
            {...register("name", { required: "Name is required" })}
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
                message: "Enter a valid email"
              }
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
                message: "Enter a valid 10-digit phone number"
              }
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
                message: "Enter a valid website URL"
              }
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
                required: "Company name is required"
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
                required: "Job title is required"
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
                required: "Start date is required"
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
                required: "Description is required"
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
                description: ""
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
                required: "University / College is required"
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
                required: "Degree is required"
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
                required: "Field of study is required"
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
                required: "Start date is required"
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
                endDate: ""
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
                required: "Project name is required"
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
                required: "Technologies are required"
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
                required: "Project description is required"
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
                  message: "Enter a valid project URL"
                }
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
                link: ""
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
                required: "Skill heading is required"
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
                required: "Skill description is required"
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
                description: ""
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
                required: "Certification name is required"
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
                required: "Issuing organization is required"
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
                  message: "Enter a valid certificate URL"
                }
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
                link: ""
              })
            }
          >
            + Add Certification
          </button>
        </div>
      </div>

      {/* RIGHT SIDE - PAGINATED A4 PREVIEW */}
      <div className="builder-preview">
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
    onClick={() => {
      localStorage.removeItem("draftcv-resume");
      localStorage.removeItem("draftcv-sections");

      reset({});
      setSections([]);
    }}
  >
    Clear Resume
  </button>
</div>
        <div className="resume-pages">
          {pageGroups.map((group, pageIndex) => (
            <div className="resume-page-wrapper" key={pageIndex}>
              <div className="resume-page-number">
                Page {pageIndex + 1}
              </div>

              <div className={`resume-preview ${selectedTemplate}-template`}
                 style={{
                 letterSpacing: `${spacing.letterSpacing}px`,
                   lineHeight: spacing.lineSpacing
                  }}
              >
                {group.map((id) => {
                  const block = getBlockById(id);

                  return (
                    <div
                      className="resume-block-wrapper"
                      key={id}
                      style={{
                       marginBottom: `${spacing.sectionSpacing}px`
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

        {/* Hidden measurement copy used only for automatic pagination */}
        <div
          ref={measureRef}
          className="resume-measure"
          aria-hidden="true"
        >
          <div className={`resume-preview ${selectedTemplate}-template`}
             style={{
              letterSpacing: `${spacing.letterSpacing}px`,
              lineHeight: spacing.lineSpacing
                }}
          >
            {resumeBlocks.map((block) => (
              <div
                key={block.id}
                data-resume-block={block.id}
                className="resume-block-wrapper"
                style={{
                  marginBottom: `${spacing.sectionSpacing}px`
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