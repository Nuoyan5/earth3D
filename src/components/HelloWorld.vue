<template>
  <div id="ele" class="hello"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import TWEEN from "@tweenjs/tween.js";
import { onMounted, reactive } from "vue";

let renderer: any;
let earth: any;
let controls: any;
const counter = 4;
const impacts = 0.03;
const imgData = require("@/assets/earth1.jpg");

// const ele: any = document.getElementById("ele");
// renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.shadowMap.enabled = true;

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.01,
  50
);
camera.position.set(0, 0, 15.5);
// 页面缩放监听并重新更新场景和相机
window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

const init = () => {
  const ele: any = document.getElementById("ele");
  renderer = new THREE.WebGLRenderer({
    // canvas: ele,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  ele.appendChild(renderer.domElement);
  initControl();

  initEarth();
  animate();

  // initMianbao();
  // initLightBox();
  // initFloor();
  // initEarth();
  // animate();
};

const initControl = () => {
  // 添加镜头轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
};

const initEarth = () => {
  // 创建球类坐标
  let sph = new THREE.Spherical();
  let dummyObj = new THREE.Object3D();
  let p = new THREE.Vector3();
  let geoms = [],
    rad = 5,
    r = 0;
  let dlong = Math.PI * (3 - Math.sqrt(5));
  let dz = 2 / counter;
  let long = 0;
  let z = 1 - dz / 2;
  let params = {
    colors: { base: "#f9f002", gradInner: "#8ae66e", gradOuter: "#03c03c" },
    reset: () => {
      controls.reset();
    },
  };
  let uniforms = {
    impacts: { value: impacts },
    // 陆地色块大小
    maxSize: { value: 0.04 },
    // 海洋色块大小
    minSize: { value: 0.025 },
    // 冲击波高度
    waveHeight: { value: 0.1 },
    // 冲击波范围
    scaling: { value: 1 },
    // 冲击波径向渐变内侧颜色
    gradInner: { value: new THREE.Color(params.colors.gradInner) },
    // 冲击波径向渐变外侧颜色
    gradOuter: { value: new THREE.Color(params.colors.gradOuter) },
  };

  // 创建10000个平面圆点网格并将其定位到球坐标
  for (let i = 0; i < 10000; i++) {
    r = Math.sqrt(Math.abs(1 - z * z));
    p.set(Math.cos(long) * r, z, -Math.sin(long) * r).multiplyScalar(rad);
    z = z - dz;
    long = long + dlong;
    sph.setFromVector3(p);
    dummyObj.lookAt(p);
    dummyObj.updateMatrix();
    let g = new THREE.PlaneGeometry(1, 1);
    g.applyMatrix4(dummyObj.matrix);
    g.translate(p.x, p.y, p.z);
    let centers = [p.x, p.y, p.z, p.x, p.y, p.z, p.x, p.y, p.z, p.x, p.y, p.z];
    let uv = new THREE.Vector2(
      (sph.theta + Math.PI) / (Math.PI * 2),
      1 - sph.phi / Math.PI
    );
    let uvs = [uv.x, uv.y, uv.x, uv.y, uv.x, uv.y, uv.x, uv.y];
    g.setAttribute("center", new THREE.Float32BufferAttribute(centers, 3));
    g.setAttribute("baseUv", new THREE.Float32BufferAttribute(uvs, 2));
    geoms.push(g);
  }
  // 将多个网格合并为一个网格
  // console.log(geoms, "------------------geoms");
  let g = mergeGeometries(geoms);
  let m: any = new THREE.MeshBasicMaterial({
    color: new THREE.Color(params.colors.base),
  });
  // m.onBeforeCompile = (shader: any) => {
  //   shader.uniforms.impacts = uniforms.impacts;
  //   shader.uniforms.maxSize = uniforms.maxSize;
  //   shader.uniforms.minSize = uniforms.minSize;
  //   shader.uniforms.waveHeight = uniforms.waveHeight;
  //   shader.uniforms.scaling = uniforms.scaling;
  //   shader.uniforms.gradInner = uniforms.gradInner;
  //   shader.uniforms.gradOuter = uniforms.gradOuter;
  //   // 将地球图片作为参数传递给shader
  //   shader.uniforms.tex = { value: new THREE.TextureLoader().load(imgData) };
  //   // shader.vertexShader = vertexShader;
  //   // shader.fragmentShader = fragmentShader;
  // };
  // 创建球体
  earth = new THREE.Mesh(g, m);
  earth.rotation.y = Math.PI;
  earth.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(4.9995, 72, 36),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x000333),
      })
    )
  );
  earth.position.set(0, -0.4, 0);
  scene.add(earth);
};

const animate = () => {
  controls.update();
  // 页面重绘动画
  renderer.setAnimationLoop((_: any) => {
    TWEEN.update();
    earth.rotation.y += 0.001;
    renderer.render(scene, camera);
  });
};

onMounted(init);

// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
