require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "https://school-management-system-tau-ebon.vercel.app",
];

// middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(helmet());
app.use(express.json());

// SESSION MIDDLEWARE
// app.use(
//   session({
//     name: "sms-session",
//     secret: process.env.SESSION_SECRET || "devsecret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false, // false for localhost
//       sameSite: "lax",
//       maxAge: 60 * 60 * 1000, // 1 hour
//     },
//   }),
// );

app.set("trust proxy", 1);

app.use(
  session({
    name: "sms-session",
    secret: process.env.SESSION_SECRET || "devsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    },
  }),
);

// routes path
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classRoutes");
const schoolYearRoutes = require("./routes/schoolYearRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const classSubjectRoutes = require("./routes/classSubjectRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const enrollmentRequestRoutes = require("./routes/enrollmentRequestRoutes");
const gradesRoutes = require("./routes/gradesRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const activityRoutes = require("./routes/activityRoutes");
const reportRoutes = require("./routes/reportRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const profileRoutes = require("./routes/profileRoutes");

//link routes
app.use("/api", authRoutes);
app.use("/api/students/", studentRoutes);
app.use("/api", classRoutes);
app.use("/api", schoolYearRoutes);
app.use("/api", subjectRoutes);
app.use("/api", teacherRoutes);
app.use("/api/class-subjects", classSubjectRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/enrollment-requests", enrollmentRequestRoutes);
app.use("/api/grades", gradesRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/profile", profileRoutes);

// test route
app.get("/", (req, res) => {
  res.json({ message: "School Management System API Running" });
});

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
