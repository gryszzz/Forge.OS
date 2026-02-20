import React from "react";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || "Unknown runtime error",
    };
  }

  componentDidCatch(error: Error) {
    console.error("ForgeOS runtime crash:", error);
  }

  resetApp = () => {
    if (typeof window === "undefined") return;
    const next = new URL(window.location.href);
    next.searchParams.set("_recover", Date.now().toString());
    window.location.replace(next.toString());
  };

  clearLocalStateAndReload = () => {
    if (typeof window === "undefined") return;
    try {
      const keys = Object.keys(window.localStorage);
      for (const key of keys) {
        if (key.startsWith("forgeos.")) {
          window.localStorage.removeItem(key);
        }
      }
    } catch {
      // Ignore storage failures and continue reload.
    }
    this.resetApp();
  };

  render() {
    if(!this.state.hasError) return this.props.children;

    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f5f5f5", padding: 24, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>ForgeOS runtime error</div>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 12 }}>The app encountered an unexpected error. Reload, then check console/network config if this continues.</div>
        <pre style={{ whiteSpace: "pre-wrap", background: "#111", border: "1px solid #222", padding: 12, borderRadius: 6 }}>{this.state.message}</pre>
        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={this.resetApp}
            style={{ border: "1px solid #3a4e66", background: "#111826", color: "#d7e4f7", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
          >
            Retry App
          </button>
          <button
            type="button"
            onClick={this.clearLocalStateAndReload}
            style={{ border: "1px solid #5a3340", background: "#241018", color: "#ffd5dc", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}
          >
            Clear ForgeOS Session
          </button>
        </div>
      </div>
    );
  }
}
