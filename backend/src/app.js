
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const authRoutes = require("./routes/auth.route");
const resumeRoutes = require("./routes/resume.route");


app.use(cors({
  origin: "https://draftcv-beta.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);

module.exports = app;
