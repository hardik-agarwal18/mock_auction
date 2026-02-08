import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
