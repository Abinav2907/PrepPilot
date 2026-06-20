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
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
