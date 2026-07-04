export default function Toast({ message, actionLabel, onAction, onDismiss }) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{message}</span>
      {actionLabel && (
        <button type="button" className="toast-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
      <button type="button" className="toast-close" aria-label="Dismiss" onClick={onDismiss}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
