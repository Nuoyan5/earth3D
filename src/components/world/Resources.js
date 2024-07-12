"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resources = void 0;
/**
 * 资源管理和加载
 */
const three_1 = require("three");
const Assets_1 = require("./Assets");
class Resources {
    constructor(callback) {
        this.callback = callback; // 资源加载完成的回调
        this.textures = {}; // 贴图对象
        this.setLoadingManager();
        this.loadResources();
    }
    /**
     * 管理加载状态
     */
    setLoadingManager() {
        this.manager = new three_1.LoadingManager();
        // 开始加载
        this.manager.onStart = () => {
            console.log("开始加载资源文件");
        };
        // 加载完成
        this.manager.onLoad = () => {
            this.callback();
        };
        // 正在进行中
        this.manager.onProgress = (url) => {
            console.log(`正在加载：${url}`);
        };
        this.manager.onError = (url) => {
            console.log("加载失败：" + url);
        };
    }
    /**
     * 加载资源
     */
    loadResources() {
        var _a;
        this.textureLoader = new three_1.TextureLoader(this.manager);
        (_a = Assets_1.resources.textures) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
            this.textureLoader.load(item.url, (t) => {
                this.textures[item.name] = t;
            });
        });
    }
}
exports.Resources = Resources;
