import { Express } from "express";
import { env } from '../../config/env';
import Routes from './routes/routes';
import http from 'http';
import https from 'https';
import fs from 'fs';

export class HTTPServer {

    private static servOptions = env.NODE_ENV == 'development' ? {
        key: fs.readFileSync(env.SSL_KEY!),
        cert: fs.readFileSync(env.SSL_CERT!),
    } : {};

    private static app: Express;
    private static server: http.Server | https.Server;

    public static init(app: Express): http.Server {
        this.app = app;
        if (env.NODE_ENV === 'development') this.server = https.createServer(this.servOptions, app);
        else this.server = http.createServer(app);

        // Welcome message
        this.app.use('/', (req, res) => {
            res.status(200).send(
                `Welcome to PUT3 server!

                MODE: ${env.NODE_ENV}
                CORS Origin: ${env.CLIENT_ORIGIN}`
            );
        });

        app.use('/api/', Routes);

        this.listen();
        return this.server;
    }

    private static listen(): void {
        this.server.listen(env.PORT, () => {
            console.log(
                `[*] Server started on port ${env.PORT}
                ENV: ${env.NODE_ENV}`
            );
        });
    }
}