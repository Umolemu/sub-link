import { Router } from "express";
import {
  adminDeleteSubscriptionController,
  createSubscriptionController,
  deleteSubscriptionController,
  getSubscriptionsController,
} from "../controllers/subscriptionController";
import { authenticate } from "../middleware/authMiddleware";
import type { AuthRequest } from "../middleware/authMiddleware";

const subscriptionRoutes = Router();

subscriptionRoutes.post("/", authenticate, createSubscriptionController);
subscriptionRoutes.delete(
  "/:serviceId",
  authenticate,
  deleteSubscriptionController
);
subscriptionRoutes.delete(
  "/admin/:msisdn/:serviceId",
  authenticate,
  (req, res, next) => {
    const r = req as AuthRequest;
    if (!r.user?.isAdmin) return res.status(403).json({ error: "Forbidden" });
    next();
  },
  adminDeleteSubscriptionController
);
subscriptionRoutes.get("/", authenticate, getSubscriptionsController);

export default subscriptionRoutes;
