import type { NextFunction, Request, Response } from "express";

import { findSessionById, findUserById } from "./store.js";
import { verifyAccessToken } from "./security.js";
import type { AuthenticatedRequestUser } from "./types.js";

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthenticatedRequestUser;
    }
  }
}

function extractBearerToken(request: Request): string | null {
  const header = request.header("authorization");

  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

export function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const token = extractBearerToken(request);

  if (!token) {
    response.status(401).json({ error: "Missing or invalid Authorization header." });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const session = findSessionById(payload.sid);
    const user = findUserById(payload.sub);

    if (!session || !user || session.userId !== user.id) {
      response.status(401).json({ error: "Session is invalid or expired." });
      return;
    }

    request.authUser = {
      id: user.id,
      email: user.email,
      sessionId: session.id
    };

    next();
  } catch {
    response.status(401).json({ error: "Invalid or expired token." });
  }
}
