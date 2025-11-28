import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/database.js";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import tagRoutes from "./src/routes/tag.routes.js";
import articleRoutes from "./src/routes/article.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
