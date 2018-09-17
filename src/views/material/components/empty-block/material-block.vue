<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__left {
    @include b(material-module) {
      @include public-style(80px);

      @include b(material-block-panel) {
        @include m(title) {
          padding: 10px;
          margin: 0 10px;
          font-size: 16px;
          color: #323232;
        }
        @include m(icon) {
          color: #fff;
          position: absolute;
          background-color: #56a848;
          border-radius: 3px;
          padding: 1px 6px;
          font-size: 12px;
          right: 8px;
          top: 12px;
          font-style: normal;
        }
      }
    }
  }
</style>

<template>
  <div class="material-block-panel">
    <p class="material-block-panel--title">{{materialBlock.moduleTitle}}</p>
    <i class="material-block-panel--icon">素材</i>
  </div>
</template>

<script>
  export default {
    name: "material-block",
    props: {
      moduleLayer: Array,
      materialBlock: Object,
    }
  }
</script>
