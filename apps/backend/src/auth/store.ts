import { randomUUID } from "node:crypto";

import type { AuthSession, AuthUser } from "./types.js";

const usersById = new Map<string, AuthUser>();
const usersByEmail = new Map<string, AuthUser>();
const sessionsById = new Map<string, AuthSession>();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function findUserByEmail(email: string): AuthUser | null {
  return usersByEmail.get(normalizeEmail(email)) ?? null;
}

export function findUserById(userId: string): AuthUser | null {
  return usersById.get(userId) ?? null;
}

export function createUser(email: string, passwordHash: string): AuthUser {
  const normalizedEmail = normalizeEmail(email);
  const user: AuthUser = {
    id: randomUUID(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  usersById.set(user.id, user);
  usersByEmail.set(normalizedEmail, user);

  return user;
}

export function createSession(userId: string, ttlMs: number): AuthSession {
  const createdAt = Date.now();
  const session: AuthSession = {
    id: randomUUID(),
    userId,
    createdAt: new Date(createdAt).toISOString(),
    expiresAt: new Date(createdAt + ttlMs).toISOString()
  };

  sessionsById.set(session.id, session);

  return session;
}

export function findSessionById(sessionId: string): AuthSession | null {
  const session = sessionsById.get(sessionId);

  if (!session) {
    return null;
  }

  if (Date.parse(session.expiresAt) <= Date.now()) {
    sessionsById.delete(sessionId);
    return null;
  }

  return session;
}

export function deleteSession(sessionId: string): void {
  sessionsById.delete(sessionId);
}
