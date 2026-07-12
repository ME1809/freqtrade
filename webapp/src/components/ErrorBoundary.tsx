import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Dashboard view crashed:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-2xl border border-critical/30 bg-surface p-8 text-center">
          <p className="font-medium text-critical">Diese Ansicht ist abgestürzt.</p>
          <p className="max-w-md text-sm text-ink-muted">{this.state.error.message}</p>
          <button
            onClick={() => this.setState({ error: null })}
            className="mt-2 rounded-lg border border-border px-3 py-1.5 text-sm text-ink-secondary hover:text-ink"
          >
            Erneut versuchen
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
