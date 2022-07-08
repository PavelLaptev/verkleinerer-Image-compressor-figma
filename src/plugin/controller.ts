figma.skipInvisibleInstanceChildren = true;

// Show UI

const pluginFrameSize = {
    width: 240,
    height: 240,
};

figma.showUI(__html__, {width: 240, height: 250});

console.log((figma.currentPage.selection[0] as ComponentNode));

figma.ui.onmessage = msg => {
    // Create img and fill
    if (msg.type === 'rasterFromUI') {
        figma.notify('📌 Select something to raster', {
            timeout: 2000,
        });
    }

    

    // CHANGE SIZE
    if (msg.type === 'change-size' || msg.type === 'reset') {
        figma.ui.resize(pluginFrameSize.width, Math.round(msg.frameHeight));
    }
    if (msg.type === 'manual-resize') {
        figma.ui.resize(Math.round(msg.size.width), Math.round(msg.size.height));
    }
};

figma.currentPage.setRelaunchData({open: ''});
