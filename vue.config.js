const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    module: {
      // 指定要加载的规则
      rules: [
        // Shaders
        {
          test: /\.(glsl|vs|fs)$/,
          loader: "ts-shader-loader",
        },
      ],
    },
  },
});
