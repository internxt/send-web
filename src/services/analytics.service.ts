const track = (eventName: string, dataToSend: Record<string, any>) => {
  window.rudderanalytics.track(eventName, dataToSend, {
    context: {
      app: {
        name: "send-web",
      },
    },
  });
};

const analyticsService = {
  track,
};

export default analyticsService;
