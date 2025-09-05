// Suppress benign ResizeObserver loop errors in Chromium-based browsers
if (typeof window !== "undefined") {
  const resizeObserverErrHandler = (e: ErrorEvent) => {
    const msg = e?.message || "";
    if (
      msg.includes("ResizeObserver loop limit exceeded") ||
      msg.includes(
        "ResizeObserver loop completed with undelivered notifications",
      )
    ) {
      e.stopImmediatePropagation();
    }
  };
  window.addEventListener("error", resizeObserverErrHandler);
  window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
    const reason: any = e?.reason;
    const msg = reason?.message || "";
    if (
      msg.includes("ResizeObserver loop limit exceeded") ||
      msg.includes(
        "ResizeObserver loop completed with undelivered notifications",
      )
    ) {
      e.preventDefault();
    }
  });
}
