import fs from "fs";
import path from "path";
import sizeOf from "image-size";

const getFileData = (type, file, dirpath) => {
    let data = {};

    switch (type) {
        case "image":
            const filePath = path.join(dirpath, file);
            const dimensions = sizeOf(filePath);

            data = {
                name: file,
                url: `images/${file}`,
                type: dimensions.type,
                size: fs.statSync(filePath).size,
                dimensions: {
                    width: dimensions.width,
                    height: dimensions.height,
                    ratio: dimensions.width / dimensions.height,
                    orientation:
                        dimensions.width > dimensions.height ? "landscape" : "portrait",
                },
            };
            break;
    }

    return data;
};

const StorageUtils = {
    getFileData
};

export default StorageUtils;
