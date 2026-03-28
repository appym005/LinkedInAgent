import type { FormEvent } from "react";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import type { ChatMessage } from "../types/chat";

type ChatWindowProps = {
  draft: string;
  error: string | null;
  isSending: boolean;
  messages: ChatMessage[];
  onDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ChatWindow({
  draft,
  error,
  isSending,
  messages,
  onDraftChange,
  onSubmit
}: ChatWindowProps) {
  return (
    <section className="chat-window">
      <header className="chat-header">
        <div>
          <p className="eyebrow">LinkedIn Agent</p>
          <h1>Chat Workspace</h1>
        </div>
        <p className="chat-status">
          {isSending ? "Assistant is replying..." : "Connected to backend API"}
        </p>
      </header>

      <MessageList messages={messages} />

      <MessageInput
        draft={draft}
        error={error}
        isSending={isSending}
        onDraftChange={onDraftChange}
        onSubmit={onSubmit}
      />
    </section>
  );
}
