import { CorsOptions } from "cors";

export const corsOptions: CorsOptions  = {
    origin: [process.env.ACCESS_ORIGIN!],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};