import dontenv from "dotenv";

dontenv.config();

console.log(process.env.JWT_SECRET);


interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
//   MONGO_URI: string | undefined;
  JWT_SECRET: string | undefined
  EMAIL:string|undefined
  PASSWORD:string |undefined

}

interface Config {
  NODE_ENV: string;
  PORT: number;
//   MONGO_URI: string;
  JWT_SECRET: string;
  EMAIL:string;
  PASSWORD:string 
}


const getConfig = (): ENV => {
    return {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    //   MONGO_URI: process.env.MONGO_URI,
      JWT_SECRET:process.env.JWT_SECRET,
      EMAIL:process.env.EMAIL,
      PASSWORD:process.env.PASSWORD
    };
  };
  

  const getSanitzedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
      if (value === undefined) {
        throw new Error(`Missing key ${key} in config.env`);
      }
    }
    return config as Config;
  };
  
  const config = getConfig();
  
  const sanitizedConfig = getSanitzedConfig(config);
  
  export default sanitizedConfig;
