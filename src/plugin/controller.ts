figma.skipInvisibleInstanceChildren = true;

// Show UI

const pluginFrameSize = {
    width: 360,
    height: 540,
};

figma.showUI(__html__, pluginFrameSize);

figma.ui.onmessage = async msg => {
    if (figma.currentPage.selection.length > 0) {
        // SEND SELECTED NODES TO UI
        if (msg.type === "add-to-queue") {
            const selection = figma.currentPage.selection;

            // console.log(selection);

            selection.map(async item => {
                return await item
                    .exportAsync({
                        format: "PNG",
                        constraint: {
                            type: "WIDTH",
                            value: 100,
                        },
                    })
                    .then(data => {
                        figma.ui.postMessage({
                            type: "imageData",
                            imageData: {
                                id: item.id,
                                name: item.name,
                                size: {
                                    width: item.width,
                                    height: item.height,
                                },
                                preview: figma.base64Encode(data),
                            },
                        });
                    });
            });

            figma.notify("Added to queue", {
                timeout: 2000,
            });
        }

        // RECIVE SELECTED NODES IDS FROM UI
        if (msg.type === "send-ids") {
            const selecteditems = msg.ids.map(id => {
                return figma.getNodeById(id);
            });

            // console.log(selecteditems);

            const exportedData = await Promise.all(
                selecteditems.map(async item => {
                    const data = await item.exportAsync({
                        format: "PNG",
                        constraint: {
                            type: "SCALE",
                            value: Number(msg.scaleRatio),
                        },
                    });

                    return {
                        name: item.name,
                        data: data,
                    };
                })
            );

            figma.ui.postMessage({
                type: "exported-img-data",
                exportedData: exportedData,
            });
        }
    } else {
        figma.notify("📌 Select something", {
            timeout: 2000,
        });
    }

    // CHANGE SIZE
    if (msg.type === "change-size" || msg.type === "reset") {
        figma.ui.resize(pluginFrameSize.width, Math.round(msg.frameHeight));
    }
    if (msg.type === "manual-resize") {
        figma.ui.resize(Math.round(msg.size.width), Math.round(msg.size.height));
    }
};

figma.currentPage.setRelaunchData({open: ""});
