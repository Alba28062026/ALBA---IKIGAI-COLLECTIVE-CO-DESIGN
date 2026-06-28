"use client";

import { useEffect } from "react";

const RECOVERY_WINDOW_MS = 15_000;
const STORAGE_KEY = "alba-chunk-recovery-ts";

function shouldRecover(message: string) {
  return [
    "ChunkLoadError",
    "Loading chunk",
    "Failed to fetch dynamically imported module",
  ].some((token) => message.includes(token));
}

function reloadOncePerWindow() {
  if (typeof window === "undefined") {
    return;
  }

  const lastAttempt = Number(window.sessionStorage.getItem(STORAGE_KEY) ?? "0");
  const now = Date.now();

  if (now - lastAttempt < RECOVERY_WINDOW_MS) {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, String(now));
  window.location.reload();
}

export function ChunkRecovery() {
  useEffect(() => {
    function onError(event: ErrorEvent) {
      const message = event.error?.message ?? event.message ?? "";

      if (shouldRecover(message)) {
        reloadOncePerWindow();
      }
    }

    function onUnhandledRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      const message =
        typeof reason === "string"
          ? reason
          : reason && typeof reason.message === "string"
            ? reason.message
            : "";

      if (shouldRecover(message)) {
        reloadOncePerWindow();
      }
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
