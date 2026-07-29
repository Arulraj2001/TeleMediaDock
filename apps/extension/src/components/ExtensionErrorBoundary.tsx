import React from 'react';

interface State {
  error: Error | null;
}

export class ExtensionErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error): void {
    console.error('[MediaDock] Extension UI failed to render:', error);
  }

  override render() {
    if (!this.state.error) return this.props.children;

    return (
      <main
        style={{
          boxSizing: 'border-box',
          minHeight: '100vh',
          padding: 24,
          fontFamily: 'system-ui, sans-serif',
          background: '#f8fafc',
          color: '#0f172a',
        }}
      >
        <h1 style={{ margin: '0 0 8px', fontSize: 18 }}>MediaDock could not start</h1>
        <p style={{ margin: '0 0 16px', fontSize: 13, lineHeight: 1.5 }}>
          Reload the extension from the browser extensions page, then reopen Telegram Web.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            border: 0,
            borderRadius: 8,
            padding: '9px 14px',
            background: '#4f46e5',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Reload MediaDock
        </button>
      </main>
    );
  }
}
