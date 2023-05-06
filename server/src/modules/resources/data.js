import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import paths from "../../enums/paths.js";
import StorageUtils from "../storage/utils.js";

const getData = {
    image: (filename) => {
        const filePath = path.join(paths.RESOURCES, "images", filename);
        const dimensions = sizeOf(filePath);

        return {
            name: StorageUtils.getLastPathElement(filename),
            type: 'image',
            href: path.join("resources/images/", filename),
            extension: dimensions.type,
            size: fs.statSync(filePath).size,
            dimensions: {
                width: dimensions.width,
                height: dimensions.height,
                ratio: dimensions.width / dimensions.height,
                orientation: dimensions.width > dimensions.height ? "landscape" : "portrait",
            },
        };
    },

    video: (filename) => {
        const filePath = path.join(paths.RESOURCES, "videos", filename);

        return {
            name: StorageUtils.getLastPathElement(filename),
            type: 'video',
            href: path.join("resources/videos/", filename),
            size: fs.statSync(filePath).size,
        };
    },

    audio: (filename) => {
        const filePath = path.join(paths.RESOURCES, "audio", filename);
        return {
            name: StorageUtils.getLastPathElement(filename),
            type: 'audio',
            href: path.join("resources/audio/", filename),
            size: fs.statSync(filePath).size,
        };
    }
}

const ResourcesData = {
    getData
};

export default ResourcesData;
