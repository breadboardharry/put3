import express from "express";
const router = express.Router();
import upload from "../storage/multer-config.js";
import Socket from "../socket/index.js";
import Utils from "../utils/utils.js";
import Storage from "../modules/storage/storage.js";

router.delete("/resources/images", (req, res) => {
    const files = req.body;

    if (!Utils.isArrayOf('string', files)) {
        return res.status(400).json({ success: false, message: "Invalid body parameters" });
    }

    const count = Storage.deleteFiles(files, 'images');

    res.json({
        success: true,
        message: "Success",
        affected: count.success,
        failed: count.failed
    });

    if (count.success > 0) {
        Socket.io.emit('event', {
            type: 'assets'
        });
    }
});

// Upload file
router.post("/upload", upload.file.array('file'), (req, res) => {
    res.json({ message: "File uploaded successfully!" });
    Socket.io.emit('event', {
        type: 'assets'
    });
});

// Get all images as json object
router.get("/images", (req, res) => {
    try {
        const images = Storage.getResources('images');
        res.status(200).json(images);
    } catch (err) {
        console.log("[!] Error getting images: " + err + "\n");
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
