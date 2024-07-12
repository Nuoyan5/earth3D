"use strict";
/**
 * 创建 threejs 四大天王
 * 场景、相机、渲染器、控制器
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basic = void 0;
const THREE = __importStar(require("three"));
const OrbitControls_1 = require("three/examples/jsm/controls/OrbitControls");
class Basic {
    constructor(dom) {
        this.dom = dom;
        this.initScenes();
        this.setControls();
    }
    /**
     * 初始化场景
     */
    initScenes() {
        console.log(this.dom.offsetWidth, "--------------------------dom");
        const dom = this.dom;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 
        // window.innerWidth / window.innerHeight,
        dom.offsetWidth / dom.offsetHeight, 1, 100000);
        this.camera.position.set(0, 30, -250);
        this.renderer = new THREE.WebGLRenderer({
            alpha: true, // 透明
            antialias: true, // 抗锯齿
        });
        this.renderer.setPixelRatio(window.devicePixelRatio); // 设置屏幕像素比
        // this.renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器宽高
        this.renderer.setSize(dom.offsetWidth, dom.offsetHeight); // 设置渲染器宽高
        this.dom.appendChild(this.renderer.domElement); // 添加到dom中
    }
    /**
     * 设置控制器
     */
    setControls() {
        // 鼠标控制      相机，渲染dom
        this.controls = new OrbitControls_1.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotateSpeed = 3;
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        this.controls.enableDamping = true;
        // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
        this.controls.dampingFactor = 0.05;
        // 是否可以缩放
        this.controls.enableZoom = true;
        // 设置相机距离原点的最远距离
        this.controls.minDistance = 100;
        // 设置相机距离原点的最远距离
        this.controls.maxDistance = 300;
        // 是否开启右键拖拽
        this.controls.enablePan = false;
    }
}
exports.Basic = Basic;
