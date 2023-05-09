import express from "express";
const router = express.Router();
import upload from "../storage/multer-config.js";
import Socket from "../socket/index.js";
import Resources from "../modules/resources/resources.js";

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
    try {
        // Return the data from the specified directory
        const data = Resources.unlink(req.body);
        res.json(data);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// Upload file
router.post("/upload", upload.file.array('file'), (req, res) => {
    res.json({ message: "File uploaded successfully!" });
    Socket.io.emit('event', {
        type: 'assets'
    });
});

export default router;
