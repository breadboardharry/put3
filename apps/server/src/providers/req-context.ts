import { FileRef } from './file-reference.js';

type Storage = FileRef[];
type ReqContextVariables = { [key: string]: any } & { storage?: Storage };

export class ReqContext {
    public variables: ReqContextVariables = {};

    constructor() {}

    public get storage(): Storage | undefined {
        return this.variables.storage;
    }

    public set storage(storage: Storage) {
        this.variables.storage = storage;
    }
}

declare global {
    namespace Express {
        interface Request {
            context: ReqContext;
        }
    }
}
