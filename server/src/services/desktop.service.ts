import { Paths } from "../enums/paths";
import { getFilename } from "./file.service";
import { getFileList } from "./resource.service";

export function getLastDesktopImage() {
    let defaultImage;
    let image;
    const files = getFileList(Paths.DESKTOPS);

    for (const file of files) {
        // Get the filename
        const filename = getFilename(file);

        // Skip the default image
        if (filename === "default-desktop") {
            defaultImage = file;
            continue;
        }

        // Get the timestamp and check if it's the latest
        const timestamp = parseInt(filename.split("_")[1]);
        if (!image || timestamp > image.timestamp) image = {
            filename: file,
            timestamp
        }
    }

    // Return the latest image or the default image if no image was found
    return image ? image.filename : defaultImage;
};