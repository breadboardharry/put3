import express, { Router } from "express";
const router: Router = express.Router();
import fs from "fs";
import path from "path";
import { getBase64FileExtension } from "../../../services/file.service";
import { Paths } from "../../../enums/paths";
import { Response } from "../../../services/response.service";
import { upload } from "../../../services/multer";
import { getLastDesktopImage } from "../../../services/desktop.service";

/* --------------------------------- ROUTES --------------------------------- */

// Image upload
router.post("/set", upload.desktopImage.single("image"), (req, res) => {
    // Upload via body
    if (req.body.image) {

        const base64Data = req.body.image.replace( /^data:image\/\w+;base64,/, "");

        const bufferData = Buffer.from(base64Data, "base64");
        const fileExt = getBase64FileExtension(base64Data);
        const now = new Date();
        const fileName = "desktop_" + now.getTime() + "." + fileExt;
        const filePath = path.join(Paths.DESKTOPS, fileName);

        // Write the file
        fs.writeFile(filePath, bufferData, (err) => {
            if (err) {
                return res.status(500).json(Response.ERROR.FILE_UPLOAD);
            }

            return res.status(200).json({
                message: "Image uploaded successfully",
                filename: fileName,
            });
        });
        return;
    }
    else return res.status(400).json(Response.ERROR.INVALID_PARAMS);
});

// Get the image
router.get("/get", async (_r, res) => {
    const filename = getLastDesktopImage();
    res.sendFile(filename, { root: Paths.DESKTOPS });
});

export default router;
