import * as React from "react";
import styles from "./app.module.scss";

import imageCompression from "browser-image-compression";

import { zipAndSave } from "./utils";

import Input from "./components/Input";
import ResizeKnob from "./components/ResizeKnob";
import QueueItem from "./components/QueueItem";
import Button from "./components/Button";
import Checkbox from "./components/Checkbox";

const resizeFile = async (
  file: File,
  type: "image/jpeg" | "image/png" | "image/webp",
  maxFileSize: string,
  quality: number,
  iterations: number
) => {
  return await imageCompression(file, {
    fileType: type,
    maxSizeMB: parseFloat(maxFileSize),
    alwaysKeepResolution: true,
    initialQuality: quality * 0.01,
    maxIteration: iterations,
  })
    .then((compressedFile) => {
      return compressedFile as File;
    })
    .catch((error) => {
      console.error(error.message);
    });
};

const useEffectAfterMount = (cb, dependencies) => {
  const mounted = React.useRef(true);

  React.useEffect(() => {
    if (!mounted.current) {
      return cb();
    }
    mounted.current = false;
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

const PlaceHolderImage: React.FC = () => {
  return (
    <section className={styles.placeholderWrap}>
      <div className={styles.placeholder}>
        <svg
          width="106"
          height="76"
          viewBox="0 0 106 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1"
            y="1"
            width="45"
            height="36"
            fill="white"
            stroke="black"
            strokeWidth="2"
          />
          <rect
            x="55"
            y="14"
            width="25"
            height="23"
            fill="white"
            stroke="black"
            strokeWidth="2"
          />
          <rect
            x="15"
            y="46"
            width="45"
            height="23"
            fill="white"
            stroke="black"
            strokeWidth="2"
          />
          <rect
            x="32"
            y="26"
            width="55"
            height="29"
            fill="#3686FF"
            fillOpacity="0.24"
            stroke="#3687FF"
            strokeWidth="2"
          />
          <path
            d="M89.9508 58.8906C89.8559 58.0256 90.8346 57.4605 91.5363 57.9752L103.094 66.4537C103.835 66.9967 103.513 68.1667 102.599 68.2553L96.7427 68.8238L93.3221 73.6116C92.7884 74.3586 91.6145 74.0519 91.5144 73.1394L89.9508 58.8906Z"
            fill="black"
          />
        </svg>
        <span>Select things you want to export</span>
      </div>
    </section>
  );
};

const selectFormat = (format: PluginFormatTypes) => {
  switch (format) {
    case "WEBP":
      return "image/webp";
    case "PNG":
      return "image/png";
    case "JPEG":
      return "image/jpeg";
  }
};

// Application
const App = ({}) => {
  const scaleOptions = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10];
  const formatTypes = ["WEBP", "PNG", "JPEG"];

  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const [scaleRatio, setScaleRatio] = React.useState(scaleOptions[1]);
  const [formatType, setFormatType] = React.useState(
    formatTypes[0] as PluginFormatTypes
  );
  const [quality, setQuality] = React.useState(80 as any);
  const [maxFileSize, setMaxFileSize] = React.useState(10 as any);
  const [iterations, setIterations] = React.useState(30 as any);
  const [addScaleSuffix, setAddScaleSuffix] = React.useState(false);

  const [isDataLoading, setIsDataLoading] = React.useState(false);

  const [imageDataArray, setImageDataArray] = React.useState([]);

  React.useEffect(() => {
    console.log("imageDataArray", imageDataArray);
    onmessage = async (e) => {
      const message = e.data.pluginMessage;

      if (message?.type === "imageData") {
        // console.log(imageData, e.data.pluginMessage.imageData.id);
        // console.log(imageData);

        // add to the state array
        setImageDataArray((prevStae) => {
          // if the image is already in the state, update it
          const index = prevStae.findIndex(
            (item) => item.id === e.data.pluginMessage.imageData.id
          );
          if (index !== -1) {
            return [
              ...prevStae.slice(0, index),
              {
                ...prevStae[index],
                ...e.data.pluginMessage.imageData,
              },
              ...prevStae.slice(index + 1),
            ];
          }

          return [...prevStae, e.data.pluginMessage.imageData];
        });

        //
      }

      if (message?.type === "exported-img-data") {
        const exportedData = e.data.pluginMessage.exportedData;

        // console.log("UI", formatType);

        const compresssedFiles = await Promise.all(
          exportedData.map(async (img) => {
            const blob = new Blob([img.data], { type: "image/png" }) as Blob;
            const file = new File([blob], img.name, {
              type: "image/png",
            }) as File;

            // console.log(await resizeFile(file));
            return (await resizeFile(
              file,
              selectFormat(formatType),
              maxFileSize,
              quality,
              iterations
            )) as File;
          }) as Array<File>
        );

        zipAndSave(compresssedFiles, formatType, scaleRatio, addScaleSuffix);
        // console.log(compresssedFiles);
        setIsDataLoading(false);
      }

      if (message?.type === "recieve-settings") {
        const settings = message.settings;

        setScaleRatio(settings.scaleRatio);
        setFormatType(settings.formatType);
        setQuality(settings.quality);
        setMaxFileSize(settings.maxFileSize);
        setIterations(settings.iterations);
        setAddScaleSuffix(settings.addScaleSuffix);
      }
    };
  }, [formatType, scaleRatio, quality, maxFileSize, addScaleSuffix]);

  useEffectAfterMount(() => {
    // send plugin settings to the plugin
    parent.postMessage(
      {
        pluginMessage: {
          type: "update-settings",
          settings: {
            scaleRatio: scaleRatio,
            formatType: formatType,
            quality: quality,
            maxFileSize: maxFileSize,
            iterations: iterations,
            addScaleSuffix: addScaleSuffix,
          },
        },
      },
      "*"
    );
  }, [
    scaleRatio,
    formatType,
    quality,
    maxFileSize,
    iterations,
    addScaleSuffix,
  ]);

  React.useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "get-settings" } }, "*");
  }, []);

  const addToQueue = () => {
    parent.postMessage({ pluginMessage: { type: "add-to-queue" } }, "*");
  };

  const handleRemove = (id) => {
    setImageDataArray((prevState) =>
      prevState.filter((item) => item.id !== id)
    );
  };

  const sendIds = () => {
    setIsDataLoading(true);

    parent.postMessage(
      {
        pluginMessage: {
          type: "send-ids",
          scaleRatio: scaleRatio,
          ids: imageDataArray.map((item) => item.id),
        },
      },
      "*"
    );
  };

  const handleQalityChange = (value: string) => {
    // allow only numbers
    if (value.match(/^[0-9]*$/)) {
      const valNumber = Number(value);

      if (valNumber < 101) {
        setQuality(valNumber);
      }
    }

    if (value === "") {
      setQuality("");
    }
  };

  const handleMaxFileSizeChange = (value: string) => {
    // allow only numbers
    if (value.match(/^[0-9]*\.?[0-9]*$/)) {
      setMaxFileSize(value);
    }

    if (value === "") {
      setMaxFileSize("");
    }
  };

  const handleIterationsChange = (value: string) => {
    // allow only numbers
    if (value.match(/^[0-9]*$/)) {
      const valNumber = Number(value);

      if (valNumber < 1001) {
        setIterations(valNumber);
      }
    }

    if (value === "") {
      setIterations("");
    }
  };

  const clearQueue = () => {
    setImageDataArray([]);
  };

  return (
    <>
      <section className={styles.wrap}>
        <section className={styles.settings}>
          <section className={styles.inputs}>
            <Input
              type="dropdown"
              label="Format:"
              value={formatType}
              options={formatTypes}
              minWidth="90px"
              onChange={(value) => {
                // console.log(value);
                setFormatType(value as PluginFormatTypes);
              }}
            />
            <Input
              type="dropdown"
              label="Scale:"
              value={`@${scaleRatio}x`}
              options={scaleOptions.map((item) => `@${item}x`)}
              minWidth="90px"
              onChange={(value) => {
                const ratio = parseFloat(value.replace(/[@x]/g, ""));
                setScaleRatio(ratio);
              }}
            />
            <Input
              type="input"
              label="Quality:"
              value={`${quality}`}
              onChange={handleQalityChange}
            />
          </section>

          <section className={styles.advancedWrap}>
            <section
              className={styles.advancedTogglerWrap}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <svg
                width="42"
                height="24"
                viewBox="0 0 42 24"
                className={styles.advancedTogglerButton}
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="42" height="24" />
                <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" />
                <path d="M23 12C23 13.1046 22.1046 14 21 14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10C22.1046 10 23 10.8954 23 12Z" />
                <path d="M32 12C32 13.1046 31.1046 14 30 14C28.8954 14 28 13.1046 28 12C28 10.8954 28.8954 10 30 10C31.1046 10 32 10.8954 32 12Z" />
              </svg>
            </section>

            <section
              className={styles.advancedControls}
              style={{
                display: showAdvanced ? "flex" : "none",
              }}
            >
              <section className={`${styles.inputs} ${styles.advancedInputs}`}>
                <Input
                  type="input"
                  label="Max (MB):"
                  value={`${maxFileSize}`}
                  onChange={handleMaxFileSizeChange}
                />
                <Input
                  type="input"
                  label="iterations:"
                  value={`${iterations}`}
                  onChange={handleIterationsChange}
                />
              </section>
              <section className={styles.checkboxGroup}>
                <Checkbox
                  label="Add a scale suffix to the filename"
                  onChange={(val) => setAddScaleSuffix(val)}
                />
              </section>
            </section>
          </section>
        </section>

        <section className={styles.queueSection}>
          {imageDataArray.length === 0 ? (
            <PlaceHolderImage />
          ) : (
            <section className={styles.queue}>
              {imageDataArray.map((imageData) => {
                return (
                  <QueueItem
                    key={imageData.id}
                    imageData={imageData}
                    scaleRatio={scaleRatio}
                    onRemove={() => handleRemove(imageData.id)}
                  />
                );
              })}
            </section>
          )}

          <section className={styles.controlGroups}>
            <section className={styles.controlButtons}>
              <Button
                onClick={addToQueue}
                className={styles.button}
                label="Add to queue"
              />
              {imageDataArray.length > 1 ? (
                <Button
                  onClick={clearQueue}
                  className={styles.removeAllButton}
                  label="Clear all"
                  outline
                />
              ) : null}
            </section>

            {imageDataArray.length !== 0 ? (
              <Button
                className={styles.button}
                onClick={sendIds}
                label={!isDataLoading ? "Convert" : "Working…"}
                disabled={isDataLoading}
                accent
              />
            ) : null}
          </section>
        </section>
      </section>
      <ResizeKnob />
    </>
  );
};

export default App;
