import express, { type Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import servicesRoutes from "./routes/serviceRoutes";
import userRoutes from "./routes/userRoutes";

// Load environment variables
dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/transactions", transactionRoutes);
app.use("/services", servicesRoutes);
app.use("/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running!" });
});

export default app;
