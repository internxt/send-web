import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import notificationsService, { ToastType } from './services/notifications.service';
import throttle from 'lodash.throttle';
import envService from './services/env.service';

Sentry.init({
  dsn: envService.getVariable('sentryDsn'),
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  debug: envService.getVariable('nodeEnv') !== 'production',
  environment: envService.getVariable('nodeEnv'),
});

function onUnhandledException(e: ErrorEvent | PromiseRejectionEvent) {
  // eslint-disable-next-line no-console
  console.error(e);

  notificationsService.show({
    type: ToastType.Error,
    text: 'Something went wrong, our team has been notified',
  });
}

const throttledOnUnhandledException = throttle(onUnhandledException, 2000);

window.addEventListener('error', throttledOnUnhandledException);
window.addEventListener('unhandledrejection', throttledOnUnhandledException);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
