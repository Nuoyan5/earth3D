<template>
  <div id="ele" class="about"></div>
  <div class="btn">
    <button @click="toggle">toggle</button>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { onMounted, reactive } from "vue";

import { labelRenderer as labelRenderer2D, tag as tag2D } from "./core/tag2D";

let renderer: any;
let control: any;
let css2dRender: any;

const ele: any = document.getElementById("ele");
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const init = () => {
  const ele: any = document.getElementById("ele");
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  ele.appendChild(renderer.domElement);
  css2dRender = labelRenderer2D(renderer.domElement.parentElement);
  initControl();

  initMianbao();
  initLightBox();
  initFloor();
  initEarth();
  animate();
};

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 0, 10000);
scene.background = new THREE.CubeTextureLoader()
  .setPath("/img/")
  .load(["bg3.jpg", "bg3.jpg", "bg3.jpg", "bg3.jpg", "bg3.jpg", "bg3.jpg"]);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 30;
camera.position.y = 10;

//辅助坐标线
const axes = new THREE.AxesHelper(10);

// 环境光
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

//点光源
const light1 = new THREE.PointLight(0xffffff, 800);
light1.castShadow = true;
light1.position.set(5, 18, 20);
scene.add(light1);

const initControl = () => {
  //轨道控制器
  control = new OrbitControls(camera, renderer.domElement);
  control.mouseButtons = {
    LEFT: null,
    MIDDLE: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE,
  };
  // control.autoRotate = true;
  control.enableDamping = true;
  control.dampingFactor = 0.07;
};

interface Label2D {
  showName: string;
  realName: string;
  parentCube: THREE.Object3D;
}
const initLabel2D = ({ showName, realName, parentCube }: Label2D) => {
  // 添加CSS 2DObject标签
  const label2D = tag2D(showName); //设置标签名称

  label2D.name = realName;
  const posE = new THREE.Vector3();
  parentCube.getWorldPosition(posE); //获取obj世界坐标、
  if (realName === "EARTH_LABEL") {
    posE.y += 80;
  } else {
    posE.y += 20;
  }
  label2D.position.copy(posE); //标签标注在obj世界坐标
  parentCube.children.push(label2D);
  scene.add(label2D);
};

const initMianbao = () => {
  const geometry = new THREE.TorusGeometry(7, 3, 15, 100);

  const texture = new THREE.TextureLoader().load("mianbao.webp");
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    shininess: 10000,
    // wireframe: true,
  });

  // 网格
  const cube = new THREE.Mesh(geometry, material);

  cube.receiveShadow = true;
  cube.castShadow = true;
  cube.position.x = 1;
  cube.position.y = 8;
  cube.position.z = 1;
  cube.rotation.set(0, Math.PI / 4, 0);
  cube.name = "MIANBAO";

  initLabel2D({
    showName: "甜甜圈",
    realName: "MIANBAO_LABEL",
    parentCube: cube,
  });
  scene.add(cube); //标签插入场景
};

let cubeLight: any;
let labelLight: any;
const initLightBox = () => {
  const lightGeo = new THREE.BoxGeometry(1, 1, 1);
  const materiaLight = new THREE.MeshBasicMaterial({
    color: 0x666666,
  });
  cubeLight = new THREE.Mesh(lightGeo, materiaLight);
  cubeLight.position.set(5, 18, 20);
  scene.add(cubeLight);

  labelLight = tag2D("点光源"); //设置标签名称

  labelLight.name = "posLight_LABEL";
  const posE = new THREE.Vector3();
  cubeLight.getWorldPosition(posE); //获取obj世界坐标、
  posE.y += 5;
  labelLight.position.copy(posE); //标签标注在obj世界坐标
  cubeLight.children.push(labelLight);
  scene.add(labelLight);
};

const initFloor = () => {
  // 地面
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshPhongMaterial({
      color: 0x1b5e20,
      side: THREE.DoubleSide,
    })
  );
  floor.name = "FLOOR";
  floor.rotation.x -= Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
};

let cubeEarth: any;
const initEarth = () => {
  //光
  const light1 = new THREE.DirectionalLight(0x55b1ac, 8);
  light1.castShadow = true;
  light1.position.set(-400, 400, -50);
  scene.add(light1);

  // 地球
  const earth = new THREE.SphereGeometry(50, 64, 32);
  // const earthMaterial = new THREE.ShaderMaterial();
  //   material = new THREE.MeshBasicMaterial({
  //     map: transparentTexture, // 设置纹理
  //     transparent: true,       // 定义材质为透明
  //     opacity: 0.5             // 设置材质的透明度，0.0 完全透明, 1.0 完全不透明
  // })
  // const earthMaterial = new THREE.MeshBasicMaterial({
  //   transparent: true, // 定义材质为透明
  //   opacity: 0.5, // 设置材质的透明度，0.0 完全透明, 1.0 完全不透明
  // });
  const earthMaterial = new THREE.MeshPhongMaterial();
  earthMaterial.map = new THREE.TextureLoader().load(
    require("@/assets/earth1.jpg")
  );
  // earthMaterial.color.set(0xff0000); // 修改材质颜色
  cubeEarth = new THREE.Mesh(earth, earthMaterial);

  // const color: any = new THREE.Color(0xff0000);
  // earthMaterial.map.offset.copy(color);
  earthMaterial.map.repeat.set(1, 1);

  cubeEarth.name = "EARTH";
  // cubeEarth.position.set(100, 20, 20);
  cubeEarth.position.set(-400, 200, -200);

  initLabel2D({
    showName: "地球",
    realName: "EARTH_LABEL",
    parentCube: cubeEarth,
  });
  scene.add(cubeEarth);
};

const cubeAnimate = () => {
  cubeEarth.rotation.y += 0.01;
  if (light1.position.y < 30) {
    light1.position.y += 0.1;
    labelLight.position.y += 0.1;
  } else {
    light1.position.y = 10;
    labelLight.position.y = 15;
  }
  if (cubeLight.position.y < 30) {
    cubeLight.position.y += 0.1;
  } else {
    cubeLight.position.y = 10;
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  cubeAnimate();
  control.update();
  renderer.render(scene, camera);
  css2dRender.render(scene, camera);

  try {
    // 放在 TWEEN.js未加载完成导致报错
    TWEEN.update();
  } catch (error) {}
};

const toggle = () => {
  scene.children.forEach((item: any) => {
    if (item.name.split("_")[1] === "LABEL") {
      item.visible = !item.visible;
    }
  });
};

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  css2dRender.setSize(window.innerWidth, window.innerHeight);
});

let point: THREE.Vector3 = new THREE.Vector3();

const onClick = (event: any) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  // 计算鼠标或触摸点的位置
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // 更新射线   注意——> this.camera 是相机   定义到data里的
  raycaster.setFromCamera(mouse, camera);
  // 计算与所有对象的交点
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    // 处理点击事件
    // intersects[0] 包含了第一个交点
    const clickedObject: any = intersects[0].object;
    point.copy(intersects[0].point.clone());

    //通过点击到该模型用名字匹配
    if (clickedObject.name === clickedObject.name) {
      // console.log(
      //   "获取的当前模型信息:",
      //   clickedObject,
      //   "-------------场景",
      //   scene
      // );
      // clickedObject.material.color.set(0xff0000);
      if (clickedObject.children.length) {
        clickedObject.children[0].element.innerHTML += "点击了";
      }
      fly(clickedObject);
    }
  }
};

window.addEventListener("click", onClick, false);

const fly = (A: any) => {
  const pos = new THREE.Vector3();
  A.getWorldPosition(pos); //获取三维场景中某个对象世界坐标
  // 相机飞行到的位置和观察目标拉开一定的距离
  let pos2; //向量的x、y、z坐标分别在pos基础上增加30
  // const pos2 = pos.clone().addScalar(30); //向量的x、y、z坐标分别在pos基础上增加30

  if (A.name === "EARTH") {
    pos2 = pos.clone().set(pos.x + 30, pos.y + 30, pos.z - 150);
  } else {
    pos2 = pos.clone().addScalar(30);
  }
  // 相机从当前位置camera.position飞行三维场景中某个世界坐标附近
  const tween = new TWEEN.Tween({
    // 相机开始坐标
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
    // 相机开始指向的目标观察点
    tx: 0,
    ty: 0,
    tz: 0,
  });
  tween.to(
    {
      // 相机结束坐标
      x: pos2.x,
      y: pos2.y,
      z: pos2.z,
      // 相机结束指向的目标观察点
      tx: pos.x,
      ty: pos.y,
      tz: pos.z,
    },
    2000
  );
  tween.onUpdate(function (obj) {
    // 动态改变相机位置
    camera.position.set(obj.x, obj.y, obj.z);
    control.target.copy(point.clone());
    // 动态计算相机视线
  });
  tween.start();
};

onMounted(init);
</script>

<style lang="scss" scoped>
.about {
  position: fixed;
  top: 0;
  left: 0;
}

.btn {
  position: fixed;
  right: 30px;
  top: 40%;
}

:deep(.tag) {
  color: white;
  border: 1px solid cyan;
  padding: 15px 30px;
}
</style>
