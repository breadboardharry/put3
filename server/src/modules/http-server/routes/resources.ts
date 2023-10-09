import express from "express";
import { upload } from "../../../services/multer";
import { Response } from "../../../services/response.service";
import { getData, rename, unlink } from "../../resources/resources";
import { UserModule } from "../../users/users";
const router = express.Router();

router.get("/", (req, res) => {
    try {
        // Return the data from all directories
        const data = getData();
        res.json(data);
    }
    catch (err: any) {
        res.status(err.status || 500).json(err);
    }
});

router.get("/:dir", (req, res) => {
    try {
        // Return the data from the specified directory
        const data = getData(req.params.dir);
        res.json(data);
    }
    catch (err: any) {
        res.status(err.status || 500).json(err);
    }
});

router.delete("/", (req, res) => {
    const filespath = req.body;

    try {
        const data = unlink(filespath);
        res.json(data);

        // Alert clients that the resources have been updated
        if (data.success) UserModule.emitUpdate.resources();
    }
    catch (err: any) {
        res.status(err.status || 500).json(err);
    }
});

router.post("/rename", (req, res) => {
    const { currentName, newName, dirpath } = req.body;

    try {
        const success = rename(currentName, newName, dirpath);
        res.json(success);

        // Alert clients that the resources have been updated
        if (success) UserModule.emitUpdate.resources();
    }
    catch (err: any) {
        console.log(err);
        res.status(err.status || 500).json(err);
    }
});

// Upload file
router.post("/upload", upload.file.array('file'), (req, res) => {
    res.json(Response.SUCCESS.UPLOAD);

    UserModule.emitUpdate.resources();
});

export default router;
