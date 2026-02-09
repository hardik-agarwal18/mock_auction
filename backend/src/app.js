import express from "express";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes.js";
import errorMiddleware from "./shared/middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Global error handler (LAST)
app.use(errorMiddleware);

export default app;
