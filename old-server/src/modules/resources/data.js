import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import StorageUtils from "../storage/utils.js";
import Resources from "../../enums/resources.js";

const getData = (filepath, type = undefined) => {
    type = type ? type : StorageUtils.getPathElem(filepath, 0);

    switch (type) {
        case Resources.TYPE.Image:
            return getImageData(filepath);

        case Resources.TYPE.Video:
            return getVideoData(filepath);

        case Resources.TYPE.Audio:
            return getAudioData(filepath);
    }
};

/**
 * Get general data from a resource file
 * @param {string} filepath File path (relative to the resources directory) e.g. "images/../image.jpg"
 */
const getGeneralData = (filepath) => {
    const publicPath = path.join("resources", filepath);
    const absolutePath = path.join("public", publicPath);

    return {
        name: StorageUtils.getLastPathElement(filepath),
        href: publicPath,
        path: filepath,
        dirpath: StorageUtils.getDirPath(filepath),
        size: fs.statSync(absolutePath).size
    };
};

/**
* Get resource data from an image file
* @param {string} filepath File path (relative to the resources directory) e.g. "images/../image.jpg"
*/
const getImageData = (filepath) => {
    const generalData = getGeneralData(filepath);
    const dimensions = sizeOf(path.join("public", generalData.href));

    return {
        ...generalData,
        type: 'image',
        extension: dimensions.type,
        dimensions: {
            width: dimensions.width,
            height: dimensions.height,
            ratio: dimensions.width / dimensions.height,
            orientation: dimensions.width > dimensions.height ? "landscape" : "portrait",
        },
    };
};

/**
 * Get resource data from a video file
 * @param {string} filepath File path (relative to the resources directory) e.g. "videos/../video.mp4"
 */
const getVideoData = (filepath) => {
    return {
        ...getGeneralData(filepath),
        type: 'video'
    };
};

/**
 * Get resource data from an audio file
 * @param {string} filepath File path (relative to the resources directory) e.g. "audio/../audio.mp3"
 */
const getAudioData = (filepath) => {
    return {
        ...getGeneralData(filepath),
        type: 'audio'
    };
}

const ResourcesData = {
    getData,
    getGeneralData,
    getImageData,
    getVideoData,
    getAudioData
};

export default ResourcesData;
