import express from "express";

import { authRouter } from "./auth/routes.js";
import {
  createVertexAgentChatResult,
  createVertexAgentDefinition
} from "./vertexAgent.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());
app.use("/api/auth", authRouter);

app.get("/", (_request, response) => {
  response.send("LinkedInAgent backend is running.");
});

app.get("/api/agent", (_request, response) => {
  response.json({
    agent: createVertexAgentDefinition()
  });
});

app.post("/api/chat", (request, response) => {
  const { message } = request.body as { message?: unknown };

  if (typeof message !== "string" || message.trim().length === 0) {
    response.status(400).json({
      error: "The request body must include a non-empty message field."
    });
    return;
  }

  response.json(createVertexAgentChatResult(message));
});

app.listen(port, () => {
  const agent = createVertexAgentDefinition();

  console.log(
    `Backend listening on http://localhost:${port} with Vertex agent '${agent.name}' using model '${agent.model}'.`
  );
});
