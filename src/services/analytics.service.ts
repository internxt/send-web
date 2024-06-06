const CONTEXT_APP_NAME = "send-web";

const track = (eventName: string, dataToSend: Record<string, any>) => {
  window.rudderanalytics.track(eventName, dataToSend, {
    context: {
      app: {
        name: CONTEXT_APP_NAME,
      },
    },
  });
};

const analyticsService = {
  track,
};

export default analyticsService;
