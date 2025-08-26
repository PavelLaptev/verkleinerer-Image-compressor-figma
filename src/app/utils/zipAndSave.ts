import { saveAs } from "file-saver";
import JSZip from "jszip";

const generateDateAndTime = () => {
  const date = new Date();
  // Get local timezone offset in minutes
  const timezoneOffset = date.getTimezoneOffset();
  // Adjust for timezone offset to get local time
  const localDate = new Date(date.getTime() - (timezoneOffset * 60000));
  
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const hour = String(localDate.getHours()).padStart(2, '0');
  const minute = String(localDate.getMinutes()).padStart(2, '0');
  const second = String(localDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}_${minute}_${second}`;
};

const makeNamesUnique = (array) => {
  const nameCount = new Map();

  return array.map((name) => {
    if (!nameCount.has(name)) {
      nameCount.set(name, 1);
    } else {
      const count = nameCount.get(name);
      nameCount.set(name, count + 1);
      name = `${name}-${count}`;
    }
    return name;
  });
};

const download = (
  files: Array<File>,
  format: PluginFormatTypes,
  scale: number,
  setScale: boolean
) => {
  // console.log(scale, setScale);

  var zip = new JSZip();

  const fileNames = files.map((file) => file.name);
  const uniqueFileNames = makeNamesUnique(fileNames);

  //   console.log(uniqueFileNames);

  const generateFileName = (index: number) => {
    return `${uniqueFileNames[index]}${
      setScale ? `@${scale}x` : ""
    }.${format.toLowerCase()}`;
  };

  files.forEach((file, index) => {
    zip.file(generateFileName(index), file);
  });

  if (files.length > 1) {
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `tinify-${generateDateAndTime()}.zip`, { binary: true });
    });
  } else {
    saveAs(files[0], `${generateFileName(0)}`, {
      binary: true,
    });
  }
};

export default download;
