declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    MONGO_URI: string;
    PORT: string;
    ACCESS_TOKEN_SECRET: string;
    RESET_TOKEN_SECRET: string;
  }
}