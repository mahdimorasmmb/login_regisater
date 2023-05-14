

namespace NodeJs {
  interface ProcessEnv {
    PORT: number;
    JWT_SECRET: string;
    NODE_ENV: string;
    MONGO_URI: string;
  }
}
