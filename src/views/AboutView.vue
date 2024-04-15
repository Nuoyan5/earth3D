<template>
  <div id="ele" class="about"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import { onMounted } from "vue";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 500 / 300, 0.1, 1000);
// scene.overrideMaterial = new THREE.MeshDepthMaterial();
onMounted(() => {
  const ele: any = document.getElementById("ele");
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(500, 300);
  ele.appendChild(renderer.domElement);

  const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const material = new THREE.MeshDepthMaterial();
  const torus = new THREE.Mesh(geometry, material);
  scene.add(torus);

  function animate() {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.05;
    renderer.render(scene, camera);
  }
  animate();

  camera.position.z = 30;
});
</script>

<style lang="scss" scoped>
.about {
  width: 80vw;
  height: 60vh;
  margin: 0 auto;
}
</style>
