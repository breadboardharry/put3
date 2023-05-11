import express from "express";
const router = express.Router();
import fs from "fs";
import path from "path";
import upload from "../storage/multer-config.js";
import Utils from "../utils/utils.js"
import Paths from "../enums/paths.js"
import Response from "../enums/response.js";

/* --------------------------------- ROUTES --------------------------------- */

// Image upload
router.post("/set", upload.desktopImage.single("image"), async (req, res) => {
    const ip = Utils.ipv6ToIpv4(req.ip);
    console.log("IP: " + ip)

    // Upload via body
    if (req.body.image) {

        const base64Data = req.body.image.replace( /^data:image\/\w+;base64,/, "");

        const bufferData = Buffer.from(base64Data, "base64");
        const fileExt = Utils.getBase64FileExtension(base64Data);
        const now = new Date();
        const fileName = "desktop_" + now.getTime() + "." + fileExt;
        const filePath = path.join(Paths.DESKTOPS, fileName);

        // Write the file
        fs.writeFile(filePath, bufferData, (err) => {
            if (err) {
                return res.status(500).json(Response.ERROR.FILE_UPLOAD);
            }

            res.status(200).json({
                message: "Image uploaded successfully",
                filename: fileName,
            });
        });
    }
    else return res.status(400).json(Response.INVALID_PARAMS);
});

// Get the image
router.get("/get", async (req, res) => {
    const ip = Utils.ipv6ToIpv4(req.ip);
    console.log("IP: " + ip);

    const filename = Utils.getLastDesktopImage();
    res.sendFile(filename, { root: Paths.DESKTOPS });
});

export default router;
