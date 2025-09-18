import { Request, Response } from "express";
import {
  getAllUsers,
  getUserByMsisdn,
  deleteUser,
} from "../services/userService";

export async function getUsersController(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("getUserController error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUserController(req: Request, res: Response) {
  try {
    const { msisdn } = req.params;
    const user = await getUserByMsisdn(msisdn);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("getUserController error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteUserController(req: Request, res: Response) {
  try {
    const { msisdn } = req.params;
    const success = await deleteUser(msisdn);
    if (!success) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUserController error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
