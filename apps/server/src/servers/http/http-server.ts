import { Express } from 'express';
import express from 'express';
import Routes from './routes/routes';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { corsOptions } from '../../config/cors';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import UserMiddleware from '../../middlewares/user';
import { ReqContext } from '../../providers/req-context';

export class HTTPServer {
    private static servOptions =
        process.env.NODE_ENV == 'development'
            ? {
                  key: fs.readFileSync(process.env.SSL_KEY!),
                  cert: fs.readFileSync(process.env.SSL_CERT!),
              }
            : {};

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

        this.server = https.createServer(this.servOptions, app);

        // Add a "context" object to the request that will be used to store data between middlewares
        this.app.use((req, _, next) => {
            req.context = new ReqContext();
            next();
        });

        this.app.use('/api/', Routes);

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
