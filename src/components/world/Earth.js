"use strict";
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
const three_1 = require("three");
const html2canvas_1 = __importDefault(require("html2canvas"));
const vertex_vs_1 = __importDefault(require("../../shaders/earth/vertex.vs"));
const fragment_fs_1 = __importDefault(
  require("../../shaders/earth/fragment.fs")
);
const common_1 = require("../Utils/common");
const gsap_1 = __importDefault(require("gsap"));
class earth {
  constructor(options) {
    this.options = options;
    this.group = new three_1.Group();
    this.group.name = "group";
    this.group.scale.set(0, 0, 0);
    this.earthGroup = new three_1.Group();
    this.group.add(this.earthGroup);
    this.earthGroup.name = "EarthGroup";
    // 标注点效果
    this.markupPoint = new three_1.Group();
    this.markupPoint.name = "markupPoint";
    this.waveMeshArr = [];
    // 卫星和标签
    this.circleLineList = [];
    this.circleList = [];
    this.x = 0;
    this.n = 0;
    // 地球自转
    this.isRotation = this.options.earth.isRotation;
    // 扫光动画 shader
    this.timeValue = 100;
    this.uniforms = {
      glowColor: {
        value: new three_1.Color(0x0cd1eb),
      },
      scale: {
        type: "f",
        value: -1.0,
      },
      bias: {
        type: "f",
        value: 1.0,
      },
      power: {
        type: "f",
        value: 3.3,
      },
      time: {
        type: "f",
        value: this.timeValue,
      },
      isHover: {
        value: false,
      },
      map: {
        value: new three_1.Texture(),
      },
    };
  }
  init() {
    return __awaiter(this, void 0, void 0, function* () {
      return new Promise((resolve) =>
        __awaiter(this, void 0, void 0, function* () {
          this.createEarth(); // 创建地球
          this.createStars(); // 添加星星
          this.createEarthGlow(); // 创建地球辉光
          this.createEarthAperture(); // 创建地球的大气层
          // await this.createMarkupPoint() // 创建柱状点位
          // await this.createSpriteLabel() // 创建标签
          // this.createAnimateCircle(); // 创建环绕卫星
          // this.createFlyLine() // 创建飞线
          this.show();
          resolve();
        })
      );
    });
  }
  createEarth() {
    const earth_geometry = new three_1.SphereBufferGeometry(
      this.options.earth.radius,
      50,
      50
    );
    const earth_border = new three_1.SphereBufferGeometry(
      this.options.earth.radius + 10,
      60,
      60
    );
    const pointMaterial = new three_1.PointsMaterial({
      color: 0x81ffff, //设置颜色，默认 0xFFFFFF
      transparent: true,
      sizeAttenuation: true,
      opacity: 0.1,
      vertexColors: false, //定义材料是否使用顶点颜色，默认false ---如果该选项设置为true，则color属性失效
      size: 0.01, //定义粒子的大小。默认为1.0
    });
    const points = new three_1.Points(earth_border, pointMaterial); //将模型添加到场景
    this.earthGroup.add(points);
    this.uniforms.map.value = this.options.textures.earth;
    const earth_material = new three_1.ShaderMaterial({
      // wireframe:true, // 显示模型线条
      uniforms: this.uniforms,
      vertexShader: vertex_vs_1.default,
      fragmentShader: fragment_fs_1.default,
    });
    earth_material.needsUpdate = true;
    this.earth = new three_1.Mesh(earth_geometry, earth_material);
    this.earth.name = "earth";
    this.earthGroup.add(this.earth);
  }
  createStars() {
    const vertices = [];
    const colors = [];
    for (let i = 0; i < 500; i++) {
      const vertex = new three_1.Vector3();
      vertex.x = 800 * Math.random() - 300;
      vertex.y = 800 * Math.random() - 300;
      vertex.z = 800 * Math.random() - 300;
      vertices.push(vertex.x, vertex.y, vertex.z);
      colors.push(new three_1.Color(1, 1, 1));
    }
    // 星空效果
    this.around = new three_1.BufferGeometry();
    this.around.setAttribute(
      "position",
      new three_1.BufferAttribute(new Float32Array(vertices), 3)
    );
    this.around.setAttribute(
      "color",
      new three_1.BufferAttribute(new Float32Array(colors), 3)
    );
    const aroundMaterial = new three_1.PointsMaterial({
      size: 2,
      sizeAttenuation: true, // 尺寸衰减
      color: 0x4d76cf,
      transparent: true,
      opacity: 1,
      map: this.options.textures.gradient,
    });
    this.aroundPoints = new three_1.Points(this.around, aroundMaterial);
    this.aroundPoints.name = "星空";
    this.aroundPoints.scale.set(1, 1, 1);
    this.group.add(this.aroundPoints);
  }
  createEarthGlow() {
    const R = this.options.earth.radius; //地球半径
    // TextureLoader创建一个纹理加载器对象，可以加载图片作为纹理贴图
    const texture = this.options.textures.glow; // 加载纹理贴图
    // 创建精灵材质对象SpriteMaterial
    const spriteMaterial = new three_1.SpriteMaterial({
      map: texture, // 设置精灵纹理贴图
      color: 0x4390d1,
      transparent: true, //开启透明
      opacity: 0.7, // 可以通过透明度整体调节光圈
      depthWrite: false, //禁止写入深度缓冲区数据
    });
    // 创建表示地球光圈的精灵模型
    const sprite = new three_1.Sprite(spriteMaterial);
    sprite.scale.set(R * 3.0, R * 3.0, 1); //适当缩放精灵
    this.earthGroup.add(sprite);
  }
  createEarthAperture() {
    const vertexShader = [
      "varying vec3	vVertexWorldPosition;",
      "varying vec3	vVertexNormal;",
      "varying vec4	vFragColor;",
      "void main(){",
      "	vVertexNormal	= normalize(normalMatrix * normal);", //将法线转换到视图坐标系中
      "	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;", //将顶点转换到世界坐标系中
      "	// set gl_Position",
      "	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
      "}",
    ].join("\n");
    //大气层效果
    const AeroSphere = {
      uniforms: {
        coeficient: {
          type: "f",
          value: 1.0,
        },
        power: {
          type: "f",
          value: 3,
        },
        glowColor: {
          type: "c",
          value: new three_1.Color(0x4390d1),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: [
        "uniform vec3	glowColor;",
        "uniform float	coeficient;",
        "uniform float	power;",
        "varying vec3	vVertexNormal;",
        "varying vec3	vVertexWorldPosition;",
        "varying vec4	vFragColor;",
        "void main(){",
        "	vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;", //世界坐标系中从相机位置到顶点位置的距离
        "	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;", //视图坐标系中从相机位置到顶点位置的距离
        "	viewCameraToVertex= normalize(viewCameraToVertex);", //规一化
        "	float intensity	= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);",
        "	gl_FragColor = vec4(glowColor, intensity);",
        "}",
      ].join("\n"),
    };
    //球体 辉光 大气层
    const material1 = new three_1.ShaderMaterial({
      uniforms: AeroSphere.uniforms,
      vertexShader: AeroSphere.vertexShader,
      fragmentShader: AeroSphere.fragmentShader,
      blending: three_1.NormalBlending,
      transparent: true,
      depthWrite: false,
    });
    const sphere = new three_1.SphereBufferGeometry(
      this.options.earth.radius + 0,
      50,
      50
    );
    const mesh = new three_1.Mesh(sphere, material1);
    this.earthGroup.add(mesh);
  }
  createMarkupPoint() {
    return __awaiter(this, void 0, void 0, function* () {
      yield Promise.all(
        this.options.data.map((item) =>
          __awaiter(this, void 0, void 0, function* () {
            const radius = this.options.earth.radius;
            const lon = item.startArray.E; //经度
            const lat = item.startArray.N; //纬度
            this.punctuationMaterial = new three_1.MeshBasicMaterial({
              color: this.options.punctuation.circleColor,
              map: this.options.textures.label,
              transparent: true, //使用背景透明的png贴图，注意开启透明计算
              depthWrite: false, //禁止写入深度缓冲区数据
            });
            const mesh = (0, common_1.createPointMesh)({
              radius,
              lon,
              lat,
              material: this.punctuationMaterial,
            }); //光柱底座矩形平面
            this.markupPoint.add(mesh);
            const LightPillar = (0, common_1.createLightPillar)({
              radius: this.options.earth.radius,
              lon,
              lat,
              index: 0,
              textures: this.options.textures,
              punctuation: this.options.punctuation,
            }); //光柱
            this.markupPoint.add(LightPillar);
            const WaveMesh = (0, common_1.createWaveMesh)({
              radius,
              lon,
              lat,
              textures: this.options.textures,
            }); //波动光圈
            this.markupPoint.add(WaveMesh);
            this.waveMeshArr.push(WaveMesh);
            yield Promise.all(
              item.endArray.map((obj) => {
                const lon = obj.E; //经度
                const lat = obj.N; //纬度
                const mesh = (0, common_1.createPointMesh)({
                  radius,
                  lon,
                  lat,
                  material: this.punctuationMaterial,
                }); //光柱底座矩形平面
                this.markupPoint.add(mesh);
                const LightPillar = (0, common_1.createLightPillar)({
                  radius: this.options.earth.radius,
                  lon,
                  lat,
                  index: 1,
                  textures: this.options.textures,
                  punctuation: this.options.punctuation,
                }); //光柱
                this.markupPoint.add(LightPillar);
                const WaveMesh = (0, common_1.createWaveMesh)({
                  radius,
                  lon,
                  lat,
                  textures: this.options.textures,
                }); //波动光圈
                this.markupPoint.add(WaveMesh);
                this.waveMeshArr.push(WaveMesh);
              })
            );
            this.earthGroup.add(this.markupPoint);
          })
        )
      );
    });
  }
  createSpriteLabel() {
    return __awaiter(this, void 0, void 0, function* () {
      yield Promise.all(
        this.options.data.map((item) =>
          __awaiter(this, void 0, void 0, function* () {
            let cityArry = [];
            cityArry.push(item.startArray);
            cityArry = cityArry.concat(...item.endArray);
            yield Promise.all(
              cityArry.map((e) =>
                __awaiter(this, void 0, void 0, function* () {
                  const p = (0, common_1.lon2xyz)(
                    this.options.earth.radius * 1.001,
                    e.E,
                    e.N
                  );
                  const div = `<div class="fire-div">${e.name}</div>`;
                  const shareContent = document.getElementById("html2canvas");
                  shareContent.innerHTML = div;
                  const opts = {
                    backgroundColor: null, // 背景透明
                    scale: 6,
                    dpi: window.devicePixelRatio,
                  };
                  const canvas = yield (0, html2canvas_1.default)(
                    document.getElementById("html2canvas"),
                    opts
                  );
                  const dataURL = canvas.toDataURL("image/png");
                  const map = new three_1.TextureLoader().load(dataURL);
                  const material = new three_1.SpriteMaterial({
                    map: map,
                    transparent: true,
                  });
                  const sprite = new three_1.Sprite(material);
                  const len = 5 + (e.name.length - 2) * 2;
                  sprite.scale.set(len, 3, 1);
                  sprite.position.set(p.x * 1.1, p.y * 1.1, p.z * 1.1);
                  this.earth.add(sprite);
                })
              )
            );
          })
        )
      );
    });
  }
  // createAnimateCircle() {
  //   // 创建 圆环 点
  //   const list = getCirclePoints({
  //     radius: this.options.earth.radius + 15,
  //     number: 150, //切割数
  //     closed: true, // 闭合
  //   });
  //   const mat = new MeshBasicMaterial({
  //     color: "#0c3172",
  //     transparent: true,
  //     opacity: 0.4,
  //     side: DoubleSide,
  //   });
  //   const line = createAnimateLine({
  //     pointList: list,
  //     material: mat,
  //     number: 100,
  //     radius: 0.1,
  //   });
  //   this.earthGroup.add(line);
  //   // 在clone两条线出来
  //   const l2 = line.clone();
  //   l2.scale.set(1.2, 1.2, 1.2);
  //   l2.rotateZ(Math.PI / 6);
  //   this.earthGroup.add(l2);
  //   const l3 = line.clone();
  //   l3.scale.set(0.8, 0.8, 0.8);
  //   l3.rotateZ(-Math.PI / 6);
  //   this.earthGroup.add(l3);
  //   /**
  //    * 旋转的球
  //    */
  //   const ball = new Mesh(
  //     new SphereBufferGeometry(this.options.satellite.size, 32, 32),
  //     new MeshBasicMaterial({
  //       color: "#e0b187", // 745F4D
  //     })
  //   );
  //   const ball2 = new Mesh(
  //     new SphereBufferGeometry(this.options.satellite.size, 32, 32),
  //     new MeshBasicMaterial({
  //       color: "#628fbb", // 324A62
  //     })
  //   );
  //   const ball3 = new Mesh(
  //     new SphereBufferGeometry(this.options.satellite.size, 32, 32),
  //     new MeshBasicMaterial({
  //       color: "#806bdf", //6D5AC4
  //     })
  //   );
  //   this.circleLineList.push(line, l2, l3);
  //   ball.name = ball2.name = ball3.name = "卫星";
  //   for (let i = 0; i < this.options.satellite.number; i++) {
  //     const ball01 = ball.clone();
  //     // 一根线上总共有几个球，根据数量平均分布一下
  //     const num = Math.floor(list.length / this.options.satellite.number);
  //     ball01.position.set(
  //       list[num * (i + 1)][0] * 1,
  //       list[num * (i + 1)][1] * 1,
  //       list[num * (i + 1)][2] * 1
  //     );
  //     line.add(ball01);
  //     const ball02 = ball2.clone();
  //     const num02 = Math.floor(list.length / this.options.satellite.number);
  //     ball02.position.set(
  //       list[num02 * (i + 1)][0] * 1,
  //       list[num02 * (i + 1)][1] * 1,
  //       list[num02 * (i + 1)][2] * 1
  //     );
  //     l2.add(ball02);
  //     const ball03 = ball2.clone();
  //     const num03 = Math.floor(list.length / this.options.satellite.number);
  //     ball03.position.set(
  //       list[num03 * (i + 1)][0] * 1,
  //       list[num03 * (i + 1)][1] * 1,
  //       list[num03 * (i + 1)][2] * 1
  //     );
  //     l3.add(ball03);
  //   }
  // }
  createFlyLine() {
    this.flyLineArcGroup = new Group();
    this.flyLineArcGroup.userData["flyLineArray"] = [];
    this.earthGroup.add(this.flyLineArcGroup);
    this.options.data.forEach((cities) => {
      cities.endArray.forEach((item) => {
        // 调用函数flyArc绘制球面上任意两点之间飞线圆弧轨迹
        // const arcline = flyArc(
        //   this.options.earth.radius,
        //   cities.startArray.E,
        //   cities.startArray.N,
        //   item.E,
        //   item.N,
        //   this.options.flyLine
        // );
        this.flyLineArcGroup.add(arcline); // 飞线插入flyArcGroup中
        this.flyLineArcGroup.userData["flyLineArray"].push(
          arcline.userData["flyLine"]
        );
      });
    });
  }
  show() {
    gsap_1.default.to(this.group.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2,
      ease: "Quadratic",
    });
  }
  render() {
    // this.flyLineArcGroup?.userData['flyLineArray']?.forEach(fly => {
    //   fly.rotation.z += this.options.flyLine.speed; // 调节飞线速度
    //   if (fly.rotation.z >= fly.flyEndAngle) fly.rotation.z = 0;
    // })
    if (this.isRotation) {
      this.earthGroup.rotation.y += this.options.earth.rotateSpeed;
    }
    this.circleLineList.forEach((e) => {
      e.rotateY(this.options.satellite.rotateSpeed);
    });
    this.uniforms.time.value =
      this.uniforms.time.value < -this.timeValue
        ? this.timeValue
        : this.uniforms.time.value - 1;
    if (this.waveMeshArr.length) {
      this.waveMeshArr.forEach((mesh) => {
        mesh.userData["scale"] += 0.007;
        mesh.scale.set(
          mesh.userData["size"] * mesh.userData["scale"],
          mesh.userData["size"] * mesh.userData["scale"],
          mesh.userData["size"] * mesh.userData["scale"]
        );
        if (mesh.userData["scale"] <= 1.5) {
          mesh.material.opacity = (mesh.userData["scale"] - 1) * 2; //2等于1/(1.5-1.0)，保证透明度在0~1之间变化
        } else if (
          mesh.userData["scale"] > 1.5 &&
          mesh.userData["scale"] <= 2
        ) {
          mesh.material.opacity = 1 - (mesh.userData["scale"] - 1.5) * 2; //2等于1/(2.0-1.5) mesh缩放2倍对应0 缩放1.5被对应1
        } else {
          mesh.userData["scale"] = 1;
        }
      });
    }
  }
}
exports.default = earth;
