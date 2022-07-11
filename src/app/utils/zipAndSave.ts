import {saveAs} from "file-saver";
import JSZip from "jszip";

const generateDateAndTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${year}-${month}-${day}T${hour}_${minute}_${second}`;
};

const download = (files: Array<File>) => {
    var zip = new JSZip();

    files.forEach(file => {
        zip.file(`${file.name}.webp`, file);
    });

    zip.generateAsync({type: "blob"}).then(content => {
        saveAs(content, `tinify-${generateDateAndTime()}.zip`);
    });
};

export default download;
