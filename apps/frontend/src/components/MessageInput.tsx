import type { FormEvent } from "react";

type MessageInputProps = {
  draft: string;
  error: string | null;
  isSending: boolean;
  onDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function MessageInput({
  draft,
  error,
  isSending,
  onDraftChange,
  onSubmit
}: MessageInputProps) {
  return (
    <form className="message-form" onSubmit={onSubmit}>
      <label className="input-label" htmlFor="chat-message">
        Your message
      </label>
      <div className="input-row">
        <textarea
          id="chat-message"
          className="message-input"
          name="message"
          placeholder="Type a message for the assistant..."
          rows={3}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          disabled={isSending}
        />
        <button className="send-button" type="submit" disabled={isSending || !draft.trim()}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
      <div className="form-footer">
        <p className="helper-text">Messages are posted to `/api/chat`.</p>
        {error ? <p className="error-text">{error}</p> : null}
      </div>
    </form>
  );
}
