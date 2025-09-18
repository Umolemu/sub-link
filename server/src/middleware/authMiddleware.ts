import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface AuthRequest extends Request {
  user?: { msisdn: string; isAdmin?: boolean };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      msisdn: string;
      isAdmin?: boolean;
    };
    req.user = { msisdn: decoded.msisdn, isAdmin: decoded.isAdmin };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
