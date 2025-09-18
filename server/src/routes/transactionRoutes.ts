import { Router } from "express";
import {
  createTransactionController,
  getTransactionsController,
} from "../controllers/transactionController";
import { authenticate } from "../middleware/authMiddleware";

const transactionRoutes = Router();

transactionRoutes.post("/", authenticate, createTransactionController);
transactionRoutes.get("/", authenticate, getTransactionsController);

export default transactionRoutes;
