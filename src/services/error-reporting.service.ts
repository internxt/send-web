import * as Sentry from '@sentry/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reportError(exception: any, extra: Record<string, any>) {
  Sentry.captureException(exception, { extra });
}
