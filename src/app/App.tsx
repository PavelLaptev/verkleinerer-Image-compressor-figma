import * as React from "react";
import styles from "./app.module.scss";

import imageCompression from "browser-image-compression";

import {zipAndSave} from "./utils";

import Input from "./components/Input";
import ResizeKnob from "./components/ResizeKnob";
import QueueItem from "./components/QueueItem";
import Button from "./components/Button";

const resizeFile = async (file: File) => {
    return await imageCompression(file, {
        fileType: "image/webp",
    })
        .then(compressedFile => {
            return compressedFile as File;
        })
        .catch(error => {
            console.error(error.message);
        });
};

const PlaceHolderImage: React.FC = () => {
    return (
        <div className={styles.placeholder}>
            <svg width="106" height="76" viewBox="0 0 106 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="45" height="36" fill="white" stroke="black" stroke-width="2" />
                <rect x="55" y="14" width="25" height="23" fill="white" stroke="black" stroke-width="2" />
                <rect x="15" y="46" width="45" height="23" fill="white" stroke="black" stroke-width="2" />
                <rect
                    x="32"
                    y="26"
                    width="55"
                    height="29"
                    fill="#3686FF"
                    fill-opacity="0.24"
                    stroke="#3687FF"
                    stroke-width="2"
                />
                <path
                    d="M89.9508 58.8906C89.8559 58.0256 90.8346 57.4605 91.5363 57.9752L103.094 66.4537C103.835 66.9967 103.513 68.1667 102.599 68.2553L96.7427 68.8238L93.3221 73.6116C92.7884 74.3586 91.6145 74.0519 91.5144 73.1394L89.9508 58.8906Z"
                    fill="black"
                />
            </svg>
            <span>Select things you want to export</span>
        </div>
    );
};

// Application
const App = ({}) => {
    const scaleOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const formatTypes = ["WEBP", "PNG", "JPG"];

    const [scaleRatio, setScaleRatio] = React.useState(scaleOptions[1]);
    const [formatType, setFormatType] = React.useState(formatTypes[0]);
    const [quality, setQuality] = React.useState(80);

    const [imageDataArray, setImageDataArray] = React.useState([]);

    React.useEffect(() => {
        onmessage = async e => {
            if (e.data.pluginMessage?.type === "imageData") {
                // console.log(imageData, e.data.pluginMessage.imageData.id);
                // console.log(imageData);

                // add to the state array
                setImageDataArray(prevStae => {
                    // if the image is already in the state, update it
                    const index = prevStae.findIndex(item => item.id === e.data.pluginMessage.imageData.id);
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

            if (e.data.pluginMessage?.type === "exported-img-data") {
                const exportedData = e.data.pluginMessage.exportedData;

                const compresssedFiles = await Promise.all(
                    exportedData.map(async img => {
                        const blob = new Blob([img.data], {type: "image/png"}) as Blob;
                        const file = new File([blob], img.name, {type: "image/png"}) as File;

                        // console.log(await resizeFile(file));
                        return (await resizeFile(file)) as File;
                    }) as Array<File>
                );

                zipAndSave(compresssedFiles);
                // console.log(compresssedFiles);
            }
        };
    }, []);

    const addToQueue = () => {
        parent.postMessage({pluginMessage: {type: "add-to-queue"}}, "*");
    };

    const handleRemove = id => {
        setImageDataArray(prevState => prevState.filter(item => item.id !== id));
    };

    const sendIds = () => {
        parent.postMessage(
            {pluginMessage: {type: "send-ids", scaleRatio: scaleRatio, ids: imageDataArray.map(item => item.id)}},
            "*"
        );
    };

    const handleQalityChange = value => {
        // allow only numbers
        if (value.match(/^[0-9]*$/)) {
            setQuality(value);
        }
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
                            onChange={value => {
                                setFormatType(value);
                            }}
                        />
                        <Input
                            type="dropdown"
                            label="Scale:"
                            value={`@${scaleRatio}x`}
                            options={scaleOptions.map(item => `@${item}x`)}
                            minWidth="90px"
                            onChange={value => {
                                const ratio = Number(value.replace(/[@x]/g, ""));
                                setScaleRatio(ratio);
                            }}
                        />
                        <Input type="input" label="Quality:" value={`${quality}`} onChange={handleQalityChange} />
                        <Input type="input" label="Max (kb):" value={`${quality}`} />
                    </section>

                    <Button onClick={addToQueue} label="Add to queue" />
                    <Button onClick={sendIds} label="Convert to WebP" />
                </section>

                <section className={styles.queueSection}>
                    <PlaceHolderImage />
                    <section className={styles.queue}>
                        {imageDataArray.map(imageData => {
                            return (
                                <QueueItem
                                    key={imageData.id}
                                    imageData={imageData}
                                    onRemove={() => handleRemove(imageData.id)}
                                />
                            );
                        })}
                    </section>
                </section>
            </section>
            <ResizeKnob />
        </>
    );
};

export default App;
