import dotenv from 'dotenv';
dotenv.config();

export class Env {

    public static init(): void {
        process.env.SERVER_PORT = process.env.SERVER_PORT || '3000';
    }
}