import { saveAs } from "file-saver";
import JSZip from "jszip";

const generateDateAndTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

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
    const now = new Date();
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    zip.file(generateFileName(index), file, { date: localDate });
  });

  if (files.length > 1) {
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `tinify-${timestamp}.zip`, { binary: true });
    });
  } else {
    saveAs(files[0], `${generateFileName(0)}`, {
      binary: true,
    });
  }
};

export default download;
