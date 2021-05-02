import "dotenv-safe/config";

const port = process.env.PORT;
const mongo = {
  url: process.env.MONGO_URI
};
const env = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  isStaging: process.env.NODE_ENV === 'staging',
  isProduction: process.env.NODE_ENV === 'production',
};
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const resetTokenSecret = process.env.RESET_TOKEN_SECRET;

export { port, env, mongo, accessTokenSecret, resetTokenSecret };