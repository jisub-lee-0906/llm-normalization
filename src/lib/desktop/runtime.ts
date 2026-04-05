"use client";

export type DesktopRuntimeInfo = {
  mode: "web" | "desktop";
  modelPath: string | null;
  modelExists: boolean;
  resourceDir: string | null;
  llamaCliPath: string | null;
  llmAvailable: boolean;
};

export type DesktopCleanupResult = {
  output: string;
  durationMs: number;
  backend: string;
};

const WEB_RUNTIME_INFO: DesktopRuntimeInfo = {
  mode: "web",
  modelPath: null,
  modelExists: false,
  resourceDir: null,
  llamaCliPath: null,
  llmAvailable: false,
};

export async function getDesktopRuntimeInfo(): Promise<DesktopRuntimeInfo> {
  if (!isTauriRuntime()) {
    return WEB_RUNTIME_INFO;
  }

  try {
    const { invoke } = await import("@tauri-apps/api/core");
    return await invoke<DesktopRuntimeInfo>("get_runtime_info");
  } catch {
    return WEB_RUNTIME_INFO;
  }
}

export function isTauriRuntime() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export async function runDesktopCleanup(input: string): Promise<DesktopCleanupResult | null> {
  if (!isTauriRuntime() || !input.trim()) {
    return null;
  }

  try {
    const { invoke } = await import("@tauri-apps/api/core");
    return await invoke<DesktopCleanupResult>("run_llm_cleanup", { input });
  } catch {
    return null;
  }
}
