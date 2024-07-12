<template>
  <div id="ele" class="hello"></div>

  <div id="loading">
    <!-- <div class="sk-chase">
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
    </div>
    <div>加载资源中...</div> -->
  </div>
  <div id="html2canvas" class="css3d-wapper">
    <div class="fire-div"></div>
  </div>
  <div id="earth-canvas"></div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import World from "./world/Word";

// earth-canvas
onMounted(() => {
  const dom: HTMLElement = document.querySelector(
    "#earth-canvas"
  ) as HTMLElement;
  new World({
    dom,
  });
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#earth-canvas {
  width: 300px;
  height: 300px;
}
</style>
