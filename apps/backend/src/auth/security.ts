import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import type { AuthSession, AuthTokenPayload, AuthUser } from "./types.js";

const DEFAULT_JWT_SECRET = "development-auth-secret";
const DEFAULT_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function getJwtSecret(): string {
  return process.env.JWT_SECRET?.trim() || DEFAULT_JWT_SECRET;
}

export function getSessionTtlMs(): number {
  const rawValue = process.env.AUTH_SESSION_TTL_MS;
  const parsed = rawValue ? Number(rawValue) : Number.NaN;

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return DEFAULT_SESSION_TTL_MS;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function createAccessToken(user: AuthUser, session: AuthSession): string {
  const expiresInSeconds = Math.max(
    1,
    Math.floor((Date.parse(session.expiresAt) - Date.now()) / 1000)
  );

  return jwt.sign(
    {
      sid: session.id,
      email: user.email,
      type: "access"
    } satisfies Omit<AuthTokenPayload, "sub">,
    getJwtSecret(),
    {
      subject: user.id,
      expiresIn: expiresInSeconds
    }
  );
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.sub !== "string" ||
    typeof decoded.sid !== "string" ||
    typeof decoded.email !== "string" ||
    decoded.type !== "access"
  ) {
    throw new Error("Invalid token payload.");
  }

  return {
    sub: decoded.sub,
    sid: decoded.sid,
    email: decoded.email,
    type: decoded.type
  };
}
