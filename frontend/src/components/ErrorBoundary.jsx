import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-[#fff6f6]">
          <div className="max-w-2xl w-full bg-white border border-red-200 rounded p-6">
            <h2 className="text-xl font-bold text-red-700">Render Error</h2>
            <pre className="mt-4 text-sm text-red-600 whitespace-pre-wrap">{String(this.state.error)}</pre>
            <p className="mt-4 text-sm text-slate-600">Check the browser console and dev server for stack trace.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
