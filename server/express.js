import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import qualificationsRoutes from "./routes/qualifications.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import educationRoutes from "./routes/education.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import skillRoutes from "./routes/skill.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);







const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", contactRoutes);
app.use("/", projectsRoutes);
app.use("/", qualificationsRoutes);
app.use("/", servicesRoutes);
app.use("/", educationRoutes);
app.use("/", certificateRoutes);
app.use("/", skillRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

// Serve static files from the React app build directory (dist/app)
app.use(express.static(path.join(__dirname, '../client/dist/app')));
// Handle React routing, return all requests to React app
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/app', 'index.html'));
});

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});
    
export default app;
