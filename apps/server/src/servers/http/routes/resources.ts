import express, { Router } from 'express';
import { upload } from '../../../services/multer';
import { Response } from '../../../services/response.service';
import * as Resources from '../../../modules/resources/resources';
import UserModule from '../../../modules/users/users';
import IsAdminMiddleware from '../../../middlewares/admin';
const router: Router = express.Router();

router.get('/', (_r, res) => {
    try {
        // Return the data from all directories
        const data = Resources.getData();
        res.json(data);
    } catch (err: any) {
        res.status(err.status || 500).json(err);
    }
});

router.get('/:dir', (req, res) => {
    try {
        // Return the data from the specified directory
        const data = Resources.getData(req.params.dir);
        res.json(data);
    } catch (err: any) {
        res.status(err.status || 500).json(err);
    }
});

router.delete('/', IsAdminMiddleware, (req, res) => {
    const filespath = req.body;

    try {
        const data = Resources.unlink(filespath);
        res.json(data);

        // Alert clients that the resources have been updated
        if (data.success) UserModule.emitUpdate.resources();
    } catch (err: any) {
        res.status(err.status || 500).json(err);
    }
});

router.post('/rename', IsAdminMiddleware, (req, res) => {
    const { currentName, newName, dirpath } = req.body;

    try {
        const success = Resources.rename(currentName, newName, dirpath);
        res.json(success);

        // Alert clients that the resources have been updated
        if (success) UserModule.emitUpdate.resources();
    } catch (err: any) {
        console.error(err);
        res.status(err.status || 500).json(err);
    }
});

// Upload file
router.post('/upload', upload.file.array('file'), (req, res) => {
    const fileRefs = req.context.storage || [];
    req.context.storage = [];

    const data = fileRefs.map((ref) =>
        Resources.getFileData(ref.type, ref.filename)
    );

    res.json({ ...Response.SUCCESS.UPLOAD, data });

    UserModule.emitUpdate.resources();
});

export default router;
