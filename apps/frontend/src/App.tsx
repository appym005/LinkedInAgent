import { FormEvent, useState } from "react";
import { ChatWindow } from "./components/ChatWindow";
import type { ChatMessage } from "./types/chat";

const CHAT_ENDPOINT = "/api/chat";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Ask a question to start the conversation. Messages are sent to the backend chat API."
    }
  ]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = draft.trim();
    if (!message || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setDraft("");
    setError(null);
    setIsSending(true);

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = (await response.json()) as { error?: string; reply?: string };

      if (!response.ok || typeof data.reply !== "string") {
        throw new Error(data.error ?? "The chat service returned an invalid response.");
      }

      const reply = data.reply;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply
        }
      ]);
    } catch (submitError) {
      const nextError =
        submitError instanceof Error
          ? submitError.message
          : "The message could not be delivered.";

      setError(nextError);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="app-shell">
      <ChatWindow
        draft={draft}
        error={error}
        isSending={isSending}
        messages={messages}
        onDraftChange={setDraft}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
