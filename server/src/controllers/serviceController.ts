import { Request, Response } from "express";
import {
  getServices,
  addService,
  deleteService,
  getServicesWithUserCount,
} from "../services/serviceService";
import { io } from "../server";

export async function getServicesController(req: Request, res: Response) {
  try {
    const services = await getServices();
    res.json(services);
  } catch (error) {
    console.error("getServicesController error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getServicesWithUserCountController(
  req: Request,
  res: Response
) {
  try {
    const services = await getServicesWithUserCount();
    res.json(services);
  } catch (error) {
    console.error("getServicesWithUserCountController error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function addServiceController(req: Request, res: Response) {
  try {
    const { name, description, price, category, icon } = req.body;

    if (!name || !description || !price || !category || !icon) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newService = await addService({
      name,
      description,
      price,
      category,
      icon,
    });

    io.emit("serviceCreated", newService);

    res.status(201).json(newService);
  } catch (error) {
    console.error("addServiceController error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteServiceController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const success = await deleteService(id);

    if (!success) {
      return res.status(404).json({ error: "Service not found" });
    }

    io.emit("serviceDeleted", { id });

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("deleteServiceController error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
