import 'dotenv/config';

const config = {
      port: process.env.PORT || 3000,
    icon: {
        url: process.env.ICON_URL,
        apiKey: process.env.ICON_API_KEY,
    },
    mongodbUri: process.env.MONGODB_URI,
    app: {
      secretKey: '8<5T$gN)-,t]3t?7}Fvr!$%4+C6R%A2!T2y(2nZj*vXg',
  }
}

export const jph = {
    url: process.env.JPH_URL,
}

export default config;
