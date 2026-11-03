const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.route");
const resumeRoutes = require("./routes/resume.route");
const draftRoutes = require("./routes/draft.route");

const app = express();

app.use(
  cors({
    origin: [
      "https://draftcv-beta.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/draft", draftRoutes);

module.exports = app;