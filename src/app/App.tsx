import * as React from "react";
import styles from "./app.module.scss";

import imageCompression from "browser-image-compression";

import {zipAndSave} from "./utils";

import Input from "./components/Input";
import ResizeKnob from "./components/ResizeKnob";
import QueueItem from "./components/QueueItem";

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
                <h1>Hello World</h1>
                <section className={styles.inputs}>
                    <Input
                        type="dropdown"
                        label="Format:"
                        value={formatType}
                        options={formatTypes}
                        onChange={value => {
                            setFormatType(value);
                        }}
                    />
                    <Input
                        type="dropdown"
                        label="Scale:"
                        value={`@${scaleRatio}x`}
                        options={scaleOptions.map(item => `@${item}x`)}
                        onChange={value => {
                            const ratio = Number(value.replace(/[@x]/g, ""));
                            setScaleRatio(ratio);
                        }}
                    />
                    <Input type="input" label="Quality:" value={`${quality}`} onChange={handleQalityChange} />
                </section>

                <button onClick={addToQueue}>add to queue</button>
                <button onClick={sendIds}>convert to WebP</button>

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
            <ResizeKnob />
        </>
    );
};

export default App;
