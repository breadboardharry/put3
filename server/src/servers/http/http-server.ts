import { Express } from "express";
import express from "express";
import Routes from './routes/routes';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { corsOptions } from "../../config/cors";
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import UserMiddleware from "../../middlewares/user";

export class HTTPServer {

    private static servOptions = process.env.NODE_ENV == 'development' ? {
        key: fs.readFileSync(process.env.SSL_KEY!),
        cert: fs.readFileSync(process.env.SSL_CERT!),
    } : {};

    private static app: Express;
    private static server: http.Server | https.Server;

    public static init(app: Express): http.Server {
        this.app = app;
        app.use(cors(corsOptions));
        app.use(bodyParser.json({ limit: '10mb' }));
        app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
        app.use(cookieParser());
        app.use(UserMiddleware);
        app.use(express.static('public'));
        if (process.env.NODE_ENV === 'development') this.server = https.createServer(this.servOptions, app);
        else this.server = http.createServer(app);

        this.app.use('/api/', Routes);

        // Welcome message
        this.app.use('/', (req, res) => {
            res.status(200).send(
                `Welcome to PUT3 server!

                MODE: ${process.env.NODE_ENV}
                CORS Origin: ${process.env.CLIENT_ORIGIN}`
            );
        });

        this.listen();
        return this.server;
    }

    private static listen(): void {
        this.server.listen(process.env.PORT, () => {
            console.log(
                `[*] Server started on port ${process.env.PORT}
                ENV: ${process.env.NODE_ENV}
                ORIGIN: ${process.env.CLIENT_ORIGIN}`
            );
        });
    }
}