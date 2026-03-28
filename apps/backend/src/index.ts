import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());

app.get("/", (_request, response) => {
  response.send("Hello World");
});

app.post("/api/chat", (request, response) => {
  const { message } = request.body as { message?: unknown };

  if (typeof message !== "string" || message.trim().length === 0) {
    response.status(400).json({
      error: "The request body must include a non-empty message field."
    });
    return;
  }

  response.json({
    reply: `Mock response: ${message}`
  });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
