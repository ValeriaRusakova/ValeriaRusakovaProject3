// Tiny reusable component — shows a red error message under a form field.
// Returns null when message is empty so you can always render it safely.

interface Props {
  message?: string;
}

export default function FieldError({ message }: Props) {
  if (!message) return null;
  return <span className="field-error">{message}</span>;
}
