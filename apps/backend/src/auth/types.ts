export type AuthUser = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type AuthSession = {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

export type AuthTokenPayload = {
  sub: string;
  sid: string;
  email: string;
  type: "access";
};

export type AuthenticatedRequestUser = {
  id: string;
  email: string;
  sessionId: string;
};
