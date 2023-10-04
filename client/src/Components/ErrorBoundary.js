import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Display a fallback UI here
      return <div>An error occurred while generating QR code.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;