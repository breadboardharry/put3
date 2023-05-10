import express from "express";
const router = express.Router();
import fs from "fs";
import path from "path";
import upload from "../storage/multer-config.js";
import utils from "../utils/utils.js"
import StorageUtils from "../modules/storage/utils.js";

/* --------------------------------- ROUTES --------------------------------- */

// Image upload
router.post("/set", upload.desktopImage.single("image"), async (req, res) => {
    // Upload via body
    if (req.body.image) {
        // Get the existing file name
        const existingFile = await utils.findDesktopImageName();

        const base64Data = req.body.image.replace(
            /^data:image\/\w+;base64,/,
            ""
        );
        const bufferData = Buffer.from(base64Data, "base64");
        const fileExt = utils.getBase64FileExtension(base64Data);
        const fileName = "desktop." + fileExt;
        const filePath = path.join("./public/assets", fileName);

        // Delete an already existing file with a different extension
        if (existingFile && StorageUtils.getFileExtension(existingFile) !== fileExt)
            fs.unlinkSync(path.join("./public/assets", existingFile));

        // Write the file
        fs.writeFile(filePath, bufferData, (err) => {
            if (err)
                return res.status(500).json({ error: "Error uploading image" });

            res.status(200).json({
                message: "Image uploaded successfully",
                filename: fileName,
            });
        });
    } else return res.status(400).json({ error: "No file uploaded" });
});

// Get the image
router.get("/get", async (req, res) => {
    const filename =
        (await utils.findDesktopImageName()) || "default-desktop.jpg";
    res.sendFile(filename, { root: "./public/images" });
});

export default router;
