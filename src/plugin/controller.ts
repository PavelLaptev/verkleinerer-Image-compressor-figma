figma.skipInvisibleInstanceChildren = true;

// Show UI

const pluginFrameSize = {
    width: 340,
    height: 240,
};

figma.showUI(__html__, pluginFrameSize);

figma.ui.onmessage = async msg => {
    // Create img and fill
    if (msg.type === 'add-to-queue') {
        if (figma.currentPage.selection.length > 0) {
            const selection = figma.currentPage.selection;

            console.log(selection);

            const previewsBase64 = await Promise.all(
                selection.map(async item => {
                    return await item
                        .exportAsync({
                            format: 'PNG',
                            constraint: {
                                type: 'WIDTH',
                                value: 200,
                            },
                        })
                        .then(data => {
                            return figma.base64Encode(data);
                        });
                })
            );

            console.log(previewsBase64);

            // const selectedItems = figma.currentPage.selection[0];

            // await selectedItems
            //     .exportAsync({
            //         format: 'PNG',
            //         constraint: {type: 'SCALE', value: 2},
            //     })
            //     .then(data => {
            //         const base64 = figma.base64Encode(data);

            //         figma.ui.postMessage({
            //             type: 'add-to-queue',
            //             base64: base64,
            //     });

            // console.log(bytes);

            figma.notify('Added to queue', {
                timeout: 2000,
            });
        } else {
            figma.notify('📌 Select something', {
                timeout: 2000,
            });
        }
    }
};

figma.currentPage.setRelaunchData({open: ''});
