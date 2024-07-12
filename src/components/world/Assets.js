"use strict";
/**
 * 资源文件
 * 把模型和图片分开进行加载
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resources = void 0;
const filePath = "./images/earth/";
const fileSuffix = [
    "gradient",
    "redCircle",
    "label",
    "aperture",
    "glow",
    "light_column",
    "aircraft",
];
const textures = fileSuffix.map((item) => {
    return {
        name: item,
        url: filePath + item + ".png",
    };
});
textures.push({
    name: "earth",
    url: filePath + "earth.jpg",
});
const resources = {
    textures,
};
exports.resources = resources;
