import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import paths from "../../enums/paths.js";

const getData = {
    image: (filename) => {
        const filePath = path.join(paths.RESOURCES, "images", filename);
        const dimensions = sizeOf(filePath);

        return {
            name: filename,
            url: `images/${filename}`,
            type: dimensions.type,
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
            name: filename,
            url: `videos/${filename}`,
            size: fs.statSync(filePath).size,
        };
    },

    audio: (filename) => {
        const filePath = path.join(paths.RESOURCES, "audio", filename);
        return {
            name: filename,
            url: `audio/${filename}`,
            size: fs.statSync(filePath).size,
        };
    }
}

const ResourcesData = {
    getData
};

export default ResourcesData;
