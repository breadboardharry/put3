import dotenv from 'dotenv';
dotenv.config({path: process.env.NODE_ENV == 'development' ? '.env.dev' : '.env'});

const env = process.env as { [key: string]: any };
env.PORT = env.PORT || 3000;

export { env };