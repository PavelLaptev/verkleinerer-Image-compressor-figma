declare module "*.scss" {
    const content: {[className: string]: string};
    export = content;
}

type PluginFormatTypes = "WEBP" | "PNG" | "JPEG";
