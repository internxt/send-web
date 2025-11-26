const envService = {
  getVariable,
};
const variableList = {
  nodeEnv: 'NODE_ENV',
  sendUser: 'REACT_APP_SEND_USER',
  sendPass: 'REACT_APP_SEND_PASS',
  magicIv: 'REACT_APP_MAGIC_IV',
  magicSalt: 'REACT_APP_MAGIC_SALT',
  gaId: 'REACT_APP_GA_ID',
  networkUrl: 'REACT_APP_NETWORK_URL',
  sendEncryptionKey: 'REACT_APP_SEND_ENCRYPTION_KEY',
  sendBucketId: 'REACT_APP_SEND_BUCKET_ID',
  stripePublicKey: 'REACT_APP_STRIPE_PK',
  stripeTestPublicKey: 'REACT_APP_STRIPE_TEST_PK',
  sendApiUrl: 'REACT_APP_SEND_API_URL',
  recaptchaV3: 'REACT_APP_RECAPTCHA_V3',
};

function getVariable(variable: keyof typeof variableList): string {
  const envKey = variableList[variable];
  if (!envKey) {
    throw new Error(`Unknown variable name: "${variable}"`);
  }
  const value = import.meta.env[envKey];
  return value;
}

export default envService;
