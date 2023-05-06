import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import paths from "../../enums/paths.js";
import StorageUtils from "../storage/utils.js";

const getData = {
    image: (filepath) => {
        const publicPath = path.join(paths.RESOURCES, "images", filepath);
        const dimensions = sizeOf(publicPath);

        return {
            name: StorageUtils.getLastPathElement(filepath),
            path: filepath,
            type: 'image',
            href: path.join("resources/images/", filepath),
            extension: dimensions.type,
            size: fs.statSync(publicPath).size,
            dimensions: {
                width: dimensions.width,
                height: dimensions.height,
                ratio: dimensions.width / dimensions.height,
                orientation: dimensions.width > dimensions.height ? "landscape" : "portrait",
            },
        };
    },

    video: (filepath) => {
        const publicPath = path.join(paths.RESOURCES, "videos", filepath);

        return {
            name: StorageUtils.getLastPathElement(filepath),
            path: filepath,
            type: 'video',
            href: path.join("resources/videos/", filepath),
            size: fs.statSync(publicPath).size,
        };
    },

    audio: (filepath) => {
        const publicPath = path.join(paths.RESOURCES, "audio", filepath);
        return {
            name: StorageUtils.getLastPathElement(filepath),
            path: filepath,
            type: 'audio',
            href: path.join("resources/audio/", filepath),
            size: fs.statSync(publicPath).size,
        };
    }
}

const ResourcesData = {
    getData
};

export default ResourcesData;
