<script setup>
import { watchEffect, ref } from "vue";
import { OrbitControls } from "@tresjs/cientos";
import { Fog } from "three";
import { initCountryPosition, addImgEarth, XRayearth } from "./earth/earthUtil";
import { TresCanvas } from "@tresjs/core";

const gl = {
  alpha: true,
  useLegacyLights: true,
  antialias: true, //开启锯齿
  logarithmicDepthBuffer: true,
};
const TresCanvasRef = ref();
let scene = null;
const moveMesh = [];
watchEffect(() => {
  if (TresCanvasRef.value && TresCanvasRef.value.context) {
    scene = TresCanvasRef.value.context.scene.value; // 背景动效
    scene.fog = new Fog(0xfff, 100, 1000);
    initCountryPosition(scene);
    addImgEarth(scene);
    moveMesh[1] = XRayearth(scene); // 外层遮罩
  }
});
</script>

<template>
  <div class="bg-img">
    <div class="w-120 h-120 pos-relative">
      <div class="css_globe_halo1"></div>
      <div class="css_globe_halo1"></div>
      <div class="main">
        <TresCanvas ref="TresCanvasRef" v-bind="gl">
          <TresPerspectiveCamera
            :position="[0, 0, 365]"
            :fov="45"
            :near="1"
            :far="10000"
          />
          <OrbitControls
            :autoRotate="true"
            :autoRotateSpeed="2"
            :enableZoom="false"
            :enablePan="false"
          />
        </TresCanvas>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-img {
  height: 100%;
  position: fixed;
  top: 0;
  background: url("@/assets/bg-img.png");
  background-size: cover;
  top: 100px;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.main {
  width: 680px;
  height: 680px;
}

.css_globe_halo1 {
  position: absolute;
  background: url("@/assets/css_globe_halo1.png");
  background-size: cover;
  filter: hue-rotate(1deg);
  width: 680px;
  height: 680px;
}
</style>
