import * as Sentry from "@sentry/react";

export function reportError(exception: any, extra: Record<string, any>) {
  Sentry.captureException(exception, { extra });
}
