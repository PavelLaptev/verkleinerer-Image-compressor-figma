figma.skipInvisibleInstanceChildren = true;

// Show UI

const pluginFrameSize = {
    width: 340,
    height: 240,
};

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

figma.showUI(__html__, pluginFrameSize);

figma.ui.onmessage = async msg => {
    // Create img and fill
    if (msg.type === 'add-to-queue') {
        if (figma.currentPage.selection.length > 0) {
            const selectedItems = figma.currentPage.selection[0];

            await selectedItems
                .exportAsync({
                    format: 'PNG',
                    constraint: {type: 'SCALE', value: 2},
                })
                .then(data => {
                    const base64 = figma.base64Encode(data);

                    figma.ui.postMessage({
                        type: 'add-to-queue',
                        base64: base64,
                });

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
