import express from "express";
const router = express.Router();
import upload from "../storage/multer-config.js";
import Socket from "../socket/index.js";
import Resources from "../modules/resources/resources.js";
import Response from "../enums/response.js";

router.get("/", (req, res) => {
    try {
        // Return the data from all directories
        const data = Resources.getData();
        res.json(data);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:dir", (req, res) => {
    try {
        // Return the data from the specified directory
        const data = Resources.getData(req.params.dir);
        res.json(data);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.delete("/", (req, res) => {
    const filesname = req.body;

    try {
        const data = Resources.unlink(filesname);
        res.json(data);

        // Alert clients that the resources have been updated
        if (data.success) Socket.io.emit('event', { type: 'resources' });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.post("/rename", (req, res) => {
    const { currentName, newName } = req.body;

    try {
        const result = Resources.rename(currentName, newName);
        res.json(result);

        // Alert clients that the resources have been updated
        if (result.success) Socket.io.emit('event', { type: 'resources' });
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// Upload file
router.post("/upload", upload.file.array('file'), (req, res) => {
    res.json(Response.SUCCESS.UPLOAD);

    Socket.io.emit('event', { type: 'resources' });
});

export default router;
