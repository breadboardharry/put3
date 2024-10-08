const additionalCorsOrigins = process.env.ADDITIONAL_CORS_ORIGINS ? (process.env.ADDITIONAL_CORS_ORIGINS.split(',').map((origin: string) => origin.trim())) : [];

export const corsOptions = {
    origin: [process.env.CLIENT_ORIGIN!, ...additionalCorsOrigins],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};