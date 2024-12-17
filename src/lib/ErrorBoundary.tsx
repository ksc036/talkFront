import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  // componentDidCatch(error, errorInfo): void {
  //   // TODO: Error Logging
  // }

  render(): ReactNode {
    const { hasError } = this.state;
    if (hasError) {
      return null;
    }

    const { children } = this.props;
    return children;
  }
}
