import { Request, Response } from "express";
import {
  addTransaction,
  getUserTransactions,
} from "../services/transactionService";
import { io } from "../server";
import { AuthRequest } from "../middleware/authMiddleware";

export async function createTransactionController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { msisdn, serviceId, type } = req.body;

    if (!msisdn || !serviceId || !type) {
      return res
        .status(400)
        .json({ error: "msisdn, serviceId, and type are required" });
    }

    if (!["SUBSCRIBE", "UNSUBSCRIBE"].includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    const transaction = await addTransaction(msisdn, serviceId, type);

    io.emit("transactionCreated", transaction);

    return res.status(201).json(transaction);
  } catch (error) {
    console.error("createTransactionController error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTransactionsController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const transactions = await getUserTransactions(req.user.msisdn);
    return res.json(transactions);
  } catch (error) {
    console.error("getTransactionsController error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
