import express from "express";
const router = express.Router();
import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import upload from "../storage/multer-config.js";
import Socket from "../socket/index.js";

// Upload file
router.post("/upload", upload.file.array('file'), (req, res) => {
    res.json({ message: "File uploaded successfully!" });
    Socket.io.emit('event', {
        type: 'assets'
    });
});

// Get all images as json object
router.get("/images", (req, res) => {
    const imagesPath = "./public/images";

    try {
        if (!fs.existsSync(imagesPath)) return res.status(200).json([]);

        const files = fs.readdirSync(imagesPath);

        const images = files.map((file) => {
            const filePath = path.join(imagesPath, file);
            const dimensions = sizeOf(filePath);

            return {
                name: file,
                url: `images/${file}`,
                type: dimensions.type,
                size: fs.statSync(filePath).size,
                dimensions: {
                    width: dimensions.width,
                    height: dimensions.height,
                    ratio: dimensions.width / dimensions.height,
                    orientation:
                        dimensions.width > dimensions.height
                            ? "landscape"
                            : "portrait",
                },
            };
        });

        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
