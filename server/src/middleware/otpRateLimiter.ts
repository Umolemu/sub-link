import { Request, Response, NextFunction } from "express";

type Entry = {
  count: number;
  firstAt: number; // ms since epoch
  blockedUntil?: number; // ms since epoch
};

// For prod we use Redis or similar.
const store = new Map<string, Entry>();

// Defaults: 3 attempts in windowMs, then block for blockMs
const WINDOW_MS_DEFAULT = 60_000; // 1 minute window for counting attempts
const BLOCK_MS_DEFAULT = 180_000; // 3 minutes block
const MAX_ATTEMPTS_DEFAULT = 3;

export function otpRateLimiter(options?: {
  windowMs?: number;
  blockMs?: number;
  maxAttempts?: number;
  getKey?: (req: Request) => string | null; // to key per user (msisdn)
}) {
  const windowMs = options?.windowMs ?? WINDOW_MS_DEFAULT;
  const blockMs = options?.blockMs ?? BLOCK_MS_DEFAULT;
  const maxAttempts = options?.maxAttempts ?? MAX_ATTEMPTS_DEFAULT;
  const getKey =
    options?.getKey ??
    ((req: Request) => {
      const msisdn = (req.body?.msisdn ?? "").toString().trim();
      return msisdn || null;
    });

  return function (req: Request, res: Response, next: NextFunction) {
    const key = getKey(req);
    if (!key) {
      // If no msisdn provided, let the controller validate and handle 400.
      return next();
    }

    const now = Date.now();
    let entry = store.get(key);

    if (entry?.blockedUntil && now < entry.blockedUntil) {
      const retryAfterSec = Math.ceil((entry.blockedUntil - now) / 1000);
      res.setHeader("Retry-After", retryAfterSec.toString());
      return res
        .status(429)
        .json({
          error: `Too many OTP requests. Try again in ${retryAfterSec}s`,
        });
    }

    if (!entry || now - entry.firstAt > windowMs) {
      // start a new window
      entry = { count: 1, firstAt: now };
      store.set(key, entry);
      return next();
    }

    entry.count += 1;

    if (entry.count >= maxAttempts) {
      entry.blockedUntil = now + blockMs;
      const retryAfterSec = Math.ceil(blockMs / 1000);
      res.setHeader("Retry-After", retryAfterSec.toString());
      return res
        .status(429)
        .json({
          error: `Too many OTP requests. Try again in ${retryAfterSec}s`,
        });
    }

    return next();
  };
}

export function __resetOtpRateLimiterStore() {
  store.clear();
}
