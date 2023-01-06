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

const download = (files: Array<File>, format: PluginFormatTypes, scale: number, setScale: boolean) => {
    // console.log(scale, setScale);

    var zip = new JSZip();

    const fileNames = files.map(file => file.name);

    let count = 0;
    let previousFileName = "";

    const uniqueFileNames = fileNames.map(fileName => {
        if (fileName === previousFileName) {
            count++;
        } else {
            count = 0;
        }

        previousFileName = fileName;

        return `${fileName}${count !== 0 ? `-${count}` : ""}`;
    });

    console.log(files);

    files.forEach((file, index) => {
        zip.file(
            `tinify-${generateDateAndTime()}/${uniqueFileNames[index]}${
                setScale ? `@${scale}x` : ""
            }.${format.toLowerCase()}`,
            file
        );
    });

    if (files.length > 1) {
        zip.generateAsync({type: "blob"}).then(content => {
            saveAs(content, `tinify-${generateDateAndTime()}.zip`, {binary: true});
        });
    } else {
        saveAs(files[0], `${uniqueFileNames[0]}${setScale ? `@${scale}x` : ""}.${format.toLowerCase()}`, {
            binary: true,
        });
    }
};

export default download;
