import type { ChatMessage } from "../types/chat";

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="message-list" aria-live="polite">
      {messages.map((message) => (
        <article
          key={message.id}
          className={`message message-${message.role}`}
        >
          <p className="message-role">
            {message.role === "assistant" ? "Assistant" : "You"}
          </p>
          <p className="message-content">{message.content}</p>
        </article>
      ))}
    </div>
  );
}
