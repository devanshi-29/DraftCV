import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import "./Builder.css";

const Builder = () => {
 
  const {register,watch,control,formState: { errors }} = useForm({mode: "onBlur"});
  const [sections, setSections] = useState(["summary"]);

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

</div>




      {/* RIGHT SIDE - PREVIEW */}
      <div className="builder-preview">

        <div className="resume-preview">

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
            </a>) : (formData.websiteName || "Website")}

            {" | "}
            {formData.email || "email@example.com"}
            {" | "}
            {formData.phone || "Phone"}
            {" | "}
            {formData.location || "Location"}

          </p>
          

          {/* SUMMARY PREVIEW */}
          {sections.includes("summary") && (
            <>
              <h2>Summary</h2>

              <p>
                {formData.summary ||
                  "Your professional summary will appear here."}
              </p>
            </>
          )}

          {/*Experience Preview */}

{formData.experiences?.length > 0 && (
  <>
    <h2>Experience</h2>

    {formData.experiences.map((experience, index) => (
      <div className="preview-experience" key={index}>

        <div className="gap-btw-comp-date">
          <h3>
          {experience.position || "Job Title"} | {experience.company || "Company"}
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
  </>
)}

        </div>

      </div>

    </div>
  );
};

export default Builder;