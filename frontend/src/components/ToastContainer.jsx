import { useEffect } from "react";

function ToastContainer({ message, type, onDismiss }) {
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => onDismiss(""), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [message, onDismiss]);

  if (!message) {
    return null;
  }

  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`} role={type === "error" ? "alert" : "status"}>
        <span>{message}</span>
        <button
          type="button"
          className="toast-dismiss"
          aria-label="Dismiss notification"
          onClick={() => onDismiss("")}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default ToastContainer;
