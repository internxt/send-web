const track = (eventName: string, dataToSend: Record<string, any>) => {
  window.rudderanalytics.track(eventName, dataToSend);
};

const analyticsService = {
  track,
};

export default analyticsService;
