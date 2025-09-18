import { type Response } from "express";
import {
  subscribeUser,
  unsubscribeUser,
  getUserSubscriptions,
} from "../services/subscriptionService";
import type { AuthRequest } from "../middleware/authMiddleware";
import { io } from "../server";
import { addTransaction } from "../services/transactionService";

export async function createSubscriptionController(
  req: AuthRequest,
  res: Response
) {
  const { serviceId } = req.body;
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  if (!serviceId) {
    return res.status(400).json({ error: "serviceId is required" });
  }

  const subscription = await subscribeUser(req.user.msisdn, serviceId);

  io.emit("subscriptionCreated", subscription);

  return res.status(201).json(subscription);
}

export async function deleteSubscriptionController(
  req: AuthRequest,
  res: Response
) {
  const { serviceId } = req.params;
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const success = await unsubscribeUser(req.user.msisdn, serviceId);
  if (!success) {
    return res.status(404).json({ error: "Subscription not found" });
  }

  io.emit("subscriptionDeleted", { msisdn: req.user.msisdn, serviceId });
  return res.json({ message: "Unsubscribed successfully" });
}

export async function adminDeleteSubscriptionController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { msisdn, serviceId } = req.params;

    if (!msisdn || !serviceId) {
      return res
        .status(400)
        .json({ error: "msisdn and serviceId are required" });
    }

    const success = await unsubscribeUser(msisdn, serviceId);

    if (!success) {
      return res
        .status(404)
        .json({ error: "Subscription for this user/service not found" });
    }

    await addTransaction(msisdn, serviceId, "UNSUBSCRIBE");

    io.emit("subscriptionDeleted", { msisdn, serviceId });
    return res.json({ message: "User unsubscribed successfully" });
  } catch (error) {
    console.error("adminDeleteSubscriptionController error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSubscriptionsController(
  req: AuthRequest,
  res: Response
) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const userSubscriptions = await getUserSubscriptions(req.user.msisdn);
  return res.json(userSubscriptions);
}
