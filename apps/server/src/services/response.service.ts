import { APIResponse } from '@put3/types';
import { Response } from 'express';

export const ERROR: {
    [key: string]: APIResponse & { status: number };
} = {
    INTERNAL_SERVER: {
        status: 500,
        success: false,
        message: 'Internal server error',
    },
    INVALID_PARAMS: {
        status: 400,
        success: false,
        message: 'Invalid parameters',
    },
    INVALID_FILE_EXTENSION: {
        status: 400,
        success: false,
        message: 'Invalid file extension',
    },
    INVALID_DIRNAME: {
        status: 400,
        success: false,
        message: 'Invalid directory name',
    },
    FILE_ALREADY_EXISTS: {
        status: 400,
        success: false,
        message: 'File already exists',
    },
    FILE_UPLOAD: {
        status: 500,
        success: false,
        message: 'Error uploading file',
    },
};

export const SUCCESS: {
    [key: string]: APIResponse & { status: number };
} = {
    DEFAULT: { status: 200, success: true, message: 'Success' },
    UPLOAD: {
        status: 200,
        success: true,
        message: 'Uploaded successfully',
    },
};

export type ReplyData = APIResponse & { status: number };

export const reply = (res: Response, data: ReplyData) => {
    const { status, ...rest } = data;
    res.status(status).json(rest);
};

export const internalError = (res: Response, err: any) => {
    console.error(err);
    reply(res, ERROR.INTERNAL_SERVER);
};
