<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__left {
    @include b(classify-module) {
      @include public-style();

      @include b(classify-block-panel) {
        position: relative;
        min-height: 145px;
        @include m(title) {
          padding: 10px;
          margin: 0 10px;
          font-size: 16px;
          color: #323232;
        }
        @include m(button) {
          margin: 10px 18px;
          width: 285px;
          text-align: center;
          background-color: #56A848;
          color: #fff;
          cursor: pointer;
          position: absolute;
          bottom: 5px;
          left: 0;
          right: 0;
        }
      }
    }
  }
</style>

<template>
  <div class="classify-block-panel">
    <p class="classify-block-panel--title">{{classifyBlock.moduleTitle}}</p>
    <img :src="classifyBlock.imageUrl" class="classify-block-panel--img">
    <Button type="success" long class="classify-block-panel--button">进入嵌套</Button>
  </div>
</template>

<script>
  export default {
    name: "classify-block",
    props: {
      moduleLayer: Array,
      classifyBlock: Object,
    },
  }
</script>
