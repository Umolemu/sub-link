import { Router } from "express";
import {
  getServicesController,
  addServiceController,
  deleteServiceController,
  getServicesWithUserCountController,
} from "../controllers/serviceController";
import { authenticate } from "../middleware/authMiddleware";

const servicesRoutes = Router();

servicesRoutes.get("/", authenticate, getServicesController);
servicesRoutes.get(
  "/with-user-count",
  authenticate,
  getServicesWithUserCountController
);

servicesRoutes.post("/", authenticate, addServiceController);
servicesRoutes.delete("/:id", authenticate, deleteServiceController);

export default servicesRoutes;
