<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .qrcode-detail__left {
    @include b(record-module) {
      @include public-style(80px);

      @include b(record-block-panel) {
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
  <div class="record-block-panel">
    <p class="record-block-panel--title">{{recordBlock.moduleTitle}}</p>
    <i class="record-block-panel--icon">功能模块</i>
  </div>
</template>

<script>
  export default {
    name: "record-block",
    props: {
      moduleLayer: Array,
      recordBlock: Object,
    }
  }
</script>
