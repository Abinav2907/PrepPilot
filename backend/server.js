require("dotenv").config();
console.log(process.env.PORT);
console.log("PORT =", process.env.PORT);
console.log("SUPABASE_URL =", process.env.SUPABASE_URL);
console.log(
  "SERVICE ROLE KEY EXISTS =",
  !!process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./router/authRoutes");
const resumeRoutes = require("./router/resumeRoutes");
const interviewRoutes = require("./router/interviewRoutes");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/resume", resumeRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
