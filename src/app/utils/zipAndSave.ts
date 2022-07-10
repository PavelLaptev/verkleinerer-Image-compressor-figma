import {saveAs} from 'file-saver';
import JSZip from 'jszip';

const download = (files: Array<File>) => {
    var zip = new JSZip();

    files.forEach(file => {
        zip.file(`${file.name}.webp`, file);
    });

    zip.generateAsync({type: 'blob'}).then(content => {
        saveAs(content, `my.zip`);
    });
};

export default download;
