<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__left {
    @include b(interact-module) {
      @include public-style();

      @include b(interact-block-panel) {
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
        }
      }
    }
  }
</style>

<template>
  <div class="interact-block-panel">
    <p class="interact-block-panel--title">{{interactBlock.moduleTitle}}</p>
    <img :src="interactBlock.imageUrl" class="interact-block-panel--img">
    <Button type="success" long class="interact-block-panel--button">进入问卷调查</Button>
  </div>
</template>

<script>
  export default {
    name: "interact-block",
    props: {
      moduleLayer: Array,
      interactBlock: Object,
    },
  }
</script>

