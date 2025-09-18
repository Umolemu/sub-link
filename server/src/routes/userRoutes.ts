import { Router } from "express";
import {
  getUsersController,
  getUserController,
  deleteUserController,
} from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";
import type { AuthRequest } from "../middleware/authMiddleware";

const userRoutes = Router();

userRoutes.get(
  "/",
  authenticate,
  (req, res, next) => {
    const r = req as AuthRequest;
    if (!r.user?.isAdmin) return res.status(403).json({ error: "Forbidden" });
    next();
  },
  getUsersController
);
userRoutes.get(
  "/:msisdn",
  authenticate,
  (req, res, next) => {
    const r = req as AuthRequest;
    if (!r.user?.isAdmin) return res.status(403).json({ error: "Forbidden" });
    next();
  },
  getUserController
);
userRoutes.delete(
  "/:msisdn",
  authenticate,
  (req, res, next) => {
    const r = req as AuthRequest;
    if (!r.user?.isAdmin) return res.status(403).json({ error: "Forbidden" });
    next();
  },
  deleteUserController
);

export default userRoutes;
