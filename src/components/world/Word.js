("use strict");
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// interfaces
// import { IWord } from "../interfaces/IWord";
const Basic_1 = require("./Basic");
const Sizes_1 = __importDefault(require("../Utils/Sizes"));
const Resources_1 = require("./Resources");
// earth
const Earth_1 = __importDefault(require("./Earth"));
const Data_1 = __importDefault(require("./Data"));
const THREE = __importDefault(require("three"));

class World {
  constructor(option) {
    /**
     * 加载资源
     */
    this.option = option;
    this.basic = new Basic_1.Basic(option.dom);
    this.scene = this.basic.scene;
    this.renderer = this.basic.renderer;
    this.controls = this.basic.controls;
    this.camera = this.basic.camera;
    this.sizes = new Sizes_1.default({ dom: option.dom });
    this.sizes.$on("resize", () => {
      this.renderer.setSize(
        Number(this.sizes.viewport.width),
        Number(this.sizes.viewport.height)
      );
      this.camera.aspect =
        Number(this.sizes.viewport.width) / Number(this.sizes.viewport.height);
      this.camera.updateProjectionMatrix();
    });
    this.resources = new Resources_1.Resources(() =>
      __awaiter(this, void 0, void 0, function* () {
        yield this.createEarth();
        // 开始渲染
        this.render();
      })
    );

    // this.scene.background = new THREE.Color("#000000");
  }
  createEarth() {
    return __awaiter(this, void 0, void 0, function* () {
      // 资源加载完成，开始制作地球，注释在new Earth()类型里面
      this.earth = new Earth_1.default({
        data: Data_1.default,
        dom: this.option.dom,
        textures: this.resources.textures,
        earth: {
          radius: 50,
          rotateSpeed: 0.002,
          isRotation: true,
        },
        satellite: {
          show: true,
          rotateSpeed: -0.01,
          size: 1,
          number: 2,
        },
        punctuation: {
          circleColor: 0x3892ff,
          lightColumn: {
            startColor: 0xe4007f, // 起点颜色
            endColor: 0xffffff, // 终点颜色
          },
        },
        // flyLine: {
        //   color: 0xf3ae76, // 飞线的颜色
        //   flyLineColor: 0xff7714, // 飞行线的颜色
        //   speed: 0.004, // 拖尾飞线的速度
        // }
      });
      this.scene.add(this.earth.group);
      yield this.earth.init();
      // 隐藏dom
      const loading = document.querySelector("#loading");
      loading.classList.add("out");
    });
  }
  /**
   * 渲染函数
   */
  render() {
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls && this.controls.update();
    this.earth && this.earth.render();
  }
}
exports.default = World;
