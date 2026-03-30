import { Router } from "express";

import { requireAuth } from "./middleware.js";
import { createAccessToken, getSessionTtlMs, hashPassword, verifyPassword } from "./security.js";
import {
  createSession,
  createUser,
  deleteSession,
  findSessionById,
  findUserByEmail
} from "./store.js";

const authRouter = Router();

type CredentialsBody = {
  email?: unknown;
  password?: unknown;
};

function readCredentials(body: CredentialsBody): { email: string; password: string } | null {
  if (typeof body.email !== "string" || typeof body.password !== "string") {
    return null;
  }

  const email = body.email.trim().toLowerCase();
  const password = body.password.trim();

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

function formatAuthResponse(user: { id: string; email: string }, sessionId: string, token: string) {
  const session = findSessionById(sessionId);

  return {
    token,
    user: {
      id: user.id,
      email: user.email
    },
    session: session
      ? {
          id: session.id,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt
        }
      : null
  };
}

function formatSessionResponse(user: { id: string; email: string }, sessionId: string) {
  const authResponse = formatAuthResponse(user, sessionId, "");

  return {
    user: authResponse.user,
    session: authResponse.session
  };
}

authRouter.post("/register", async (request, response) => {
  const credentials = readCredentials(request.body as CredentialsBody);

  if (!credentials) {
    response.status(400).json({
      error: "The request body must include non-empty email and password fields."
    });
    return;
  }

  if (credentials.password.length < 8) {
    response.status(400).json({
      error: "Password must be at least 8 characters long."
    });
    return;
  }

  if (findUserByEmail(credentials.email)) {
    response.status(409).json({
      error: "A user with that email already exists."
    });
    return;
  }

  const passwordHash = await hashPassword(credentials.password);
  const user = createUser(credentials.email, passwordHash);
  const session = createSession(user.id, getSessionTtlMs());
  const token = createAccessToken(user, session);

  response.status(201).json(formatAuthResponse(user, session.id, token));
});

authRouter.post("/login", async (request, response) => {
  const credentials = readCredentials(request.body as CredentialsBody);

  if (!credentials) {
    response.status(400).json({
      error: "The request body must include non-empty email and password fields."
    });
    return;
  }

  const user = findUserByEmail(credentials.email);

  if (!user || !(await verifyPassword(credentials.password, user.passwordHash))) {
    response.status(401).json({
      error: "Invalid email or password."
    });
    return;
  }

  const session = createSession(user.id, getSessionTtlMs());
  const token = createAccessToken(user, session);

  response.json(formatAuthResponse(user, session.id, token));
});

authRouter.get("/session", requireAuth, (request, response) => {
  const authUser = request.authUser;

  if (!authUser) {
    response.status(500).json({ error: "Authenticated user context is missing." });
    return;
  }

  response.json(
    formatSessionResponse(
      {
        id: authUser.id,
        email: authUser.email
      },
      authUser.sessionId
    )
  );
});

authRouter.post("/logout", requireAuth, (request, response) => {
  const authUser = request.authUser;

  if (!authUser) {
    response.status(500).json({ error: "Authenticated user context is missing." });
    return;
  }

  deleteSession(authUser.sessionId);
  response.status(204).send();
});

export { authRouter };
