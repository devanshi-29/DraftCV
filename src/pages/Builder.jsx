import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import "./Builder.css";

const Builder = () => {
 
  const {register,watch,control,formState: { errors }} = useForm({mode: "onBlur"});
  const [sections, setSections] = useState(["summary"]);

  // Education
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation
  } = useFieldArray({
    control,
    name: "education"
});

//projects

const {
  fields: projectFields,
  append: appendProject,
  remove: removeProject
} = useFieldArray({
  control,
  name: "projects"
});

//technical skills

const {
  fields: skillFields,
  append: appendSkill,
  remove: removeSkill
} = useFieldArray({
  control,
  name: "skills"
});

//certifications 

const {
  fields: certificationFields,
  append: appendCertification,
  remove: removeCertification
} = useFieldArray({
  control,
  name: "certifications"
});

const { fields, append, remove } = useFieldArray({
  control,
  name: "experiences"
});
  
  const formData = watch();

  return (
    <div className="builder">

      {/* LEFT SIDE - FORM */}
      <div className="builder-form">

        <h1>Build your resume</h1>

        <p>
          Fill in your details and see your resume update live.
        </p>


        {/* PERSONAL INFORMATION */}
        <div className="form-section">

          <h2>Personal Information</h2>

          <input
            type="text"
            placeholder="Full name"
            {...register("name",{required: "Name is required"})}
          />

          {errors.name && (
           <p className="error">{errors.name.message}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            {...register("email",{
             required: "Email is required",
              pattern: {
             value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
             message: "Enter a valid email"
               }})}
          />

           {errors.email && (
            <p className="error">{errors.email.message}</p>
             )}
          

          <input
            type="text"
            placeholder="Phone"
            {...register("phone",{
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
                onClick={() => {
                  setSections(
                    sections.filter(
                      (section) => section !== "summary"
                    )
                  );
                }}
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


        {/* ADD SECTION */}
        {!sections.includes("summary") && (
          <div className="add-section">

            <button
              type="button"
              onClick={() => {
                setSections([...sections, "summary"]);
              }}
            >
              + Add Summary
            </button>

          </div>
        )}
        
        {/*Experience section */}

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

  {/*Education section */}

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

{/* PROJECTS SECTION */}

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

{/* TECHNICAL SKILLS & ACHIEVEMENTS */}

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

{/* CERTIFICATIONS SECTION */}

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

      {/* RIGHT SIDE - PREVIEW */}
      <div className="builder-preview">
      <div className="resume-preview">

         {/* PERSONAL INFO */}

        <h1>
          {formData.name || "Your Name"}
        </h1>

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
    


      {/* SUMMARY */}
{sections.includes("summary") && (
  <div>
    <h2>Summary</h2>

    <p>
      {formData.summary ||
        "Your professional summary will appear here."}
    </p>
  </div>
)}


      {/* EXPERIENCE */}
      {formData.experiences?.length > 0 && (
        <>
          {["Experience", "Internship"].map((type) => {

            const filteredExperiences =
              formData.experiences.filter(
                (experience) => experience.type === type
              );

            if (filteredExperiences.length === 0) return null;

            return (
              <div
                className="experience-group"
                key={type}
              >

                <h2>{type}</h2>

                {filteredExperiences.map(
                  (experience, index) => (
                    <div
                      className="preview-experience"
                      key={index}
                    >

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
                            .filter(
                              (point) =>
                                point.trim() !== ""
                            )
                            .map((point, i) => (
                              <li key={i}>
                                {point}
                              </li>
                            ))}

                        </ul>
                      ) : (
                        <p>
                          Your experience description
                        </p>
                      )}

                    </div>
                  )
                )}

              </div>
            );
          })}
         </>
      )}


      {/* EDUCATION */}
      {formData.education?.length > 0 && (
        <>

          <h2>Education</h2>

          {formData.education.map(
            (education, index) => (
              <div
                className="preview-education"
                key={index}
              >

                <div className="gap-btw-comp-date">

                  <h3>
                    {education.degree || "Degree"} |{" "}
                    {education.institution ||
                      "University / College"}
                  </h3>

                  <p>
                    {education.startDate ||
                      "Start Date"}
                    {" - "}
                    {education.endDate ||
                      "Present"}
                  </p>

                </div>

                <p>
                  {education.field ||
                    "Field of Study"}
                </p>

              </div>
            )
          )}

        </>
      )}


      {/* PROJECTS */}
      {formData.projects?.length > 0 && (
        <>

          <h2>Projects</h2>

          {formData.projects.map(
            (project, index) => (
              <div
                className="preview-project"
                key={index}
              >

                <div className="project-title">

                  <h3>
                    {project.name ||
                      "Project Name"}
                  </h3>

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
                  {project.technologies ||
                    "Technologies used"}
                </p>

                {project.description ? (
                  <ul className="project-bullets">

                    {project.description
                      .split("\n")
                      .filter(
                        (point) =>
                          point.trim() !== ""
                      )
                      .map((point, i) => (
                        <li key={i}>
                          {point}
                        </li>
                      ))}

                  </ul>
                ) : (
                  <p>
                    Your project description
                    will appear here.
                  </p>
                )}

              </div>
            )
          )}

        </>
      )}


      {/* TECHNICAL SKILLS & ACHIEVEMENTS */}
      {formData.skills?.length > 0 && (
        <>

          <h2>
            Technical Skills & Achievements
          </h2>

          <ul className="skills-preview">

            {formData.skills.map(
              (skill, index) => (
                <li key={index}>

                  <span className="skill-heading">
                    {skill.heading ||
                      "Skill Heading"}:
                  </span>{" "}

                  <span className="skill-description">
                    {skill.description ||
                      "Skill description"}
                  </span>

                </li>
              )
            )}

          </ul>

        </>
      )}


      {/* CERTIFICATIONS */}
      {formData.certifications?.length > 0 && (
        <>

          <h2>Certifications</h2>

          <div className="certifications-preview">

            {formData.certifications.map(
              (certification, index) => (
                <div
                  className="preview-certification"
                  key={index}
                >

                  <div className="certification-row">

                    <div className="certification-info">

                      <span className="certification-name">
                        {certification.name ||
                          "Certification Name"}
                      </span>

                      <span className="separator">
                        {" | "}
                      </span>

                      <span className="certification-org">
                        {certification.organization ||
                          "Organization"}
                      </span>

                      {certification.link && (
                        <>
                          <span className="separator">
                            {" | "}
                          </span>

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
                      {certification.date ||
                        "Date"}
                    </span>

                  </div>

                </div>
              )
            )}

          </div>

        </>
      )}

    </div>

</div>
    </div>
  );
};

export default Builder;




