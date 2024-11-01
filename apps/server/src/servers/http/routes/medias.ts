import express, { Router } from 'express';
import { upload } from '../../../services/multer';
import {
    SUCCESS,
    internalError,
    reply,
} from '../../../services/response.service';
import * as Resources from '../../../modules/resources/resources';
import UserModule from '../../../modules/users/users';
import IsAdminMiddleware from '../../../middlewares/admin';
const router: Router = express.Router();

router.get('/', (_, res) => {
    try {
        // Return the data from all directories
        const data = Resources.getData();
        reply(res, { ...SUCCESS.DEFAULT, data });
    } catch (err: any) {
        internalError(res, err);
    }
});

router.get('/:dir', (req, res) => {
    try {
        // Return the data from the specified directory
        const data = Resources.getData(req.params.dir);
        reply(res, { ...SUCCESS.DEFAULT, data });
    } catch (err: any) {
        internalError(res, err);
    }
});

router.delete('/', IsAdminMiddleware, (req, res) => {
    const filesdata = req.body;

    try {
        const data = Resources.unlink(filesdata);
        reply(res, { ...SUCCESS.DEFAULT, data });

        // Alert clients that the resources have been updated
        if (data.success) UserModule.emitUpdate.resources();
    } catch (err: any) {
        internalError(res, err);
    }
});

router.post('/rename', IsAdminMiddleware, (req, res) => {
    const { currentName, newName, dirpath } = req.body;

    try {
        const success = Resources.rename(currentName, newName, dirpath);
        reply(res, { ...SUCCESS.DEFAULT, success, message: '' });

        // Alert clients that the resources have been updated
        if (success) UserModule.emitUpdate.resources();
    } catch (err: any) {
        console.error(err);
        internalError(res, err);
    }
});

// Upload file
router.post('/upload', upload.file.array('file'), (req, res) => {
    try {
        const fileRefs = req.context.storage || [];
        req.context.storage = [];

        const data = fileRefs.map((ref) =>
            Resources.getFileData(ref.type, ref.filename)
        );

        reply(res, { ...SUCCESS.UPLOAD, data });

        UserModule.emitUpdate.resources();
    } catch (err: any) {
        internalError(res, err);
    }
});

export default router;
