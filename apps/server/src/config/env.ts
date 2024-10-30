import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';

export class Env {

    public static init(): void {
        this.useEnvLocal();
        process.env.SERVER_PORT = process.env.SERVER_PORT || '3000';
    }

    private static useEnvLocal(): void {
        if (!fs.existsSync(path.resolve(__dirname, '../../.env.local'))) return;
        const envLocalConfig = dotenv.parse(fs.readFileSync('.env.local'));
        for (const key in envLocalConfig) {
            process.env[key] = envLocalConfig[key];
        }
    }

}