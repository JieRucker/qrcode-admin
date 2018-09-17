<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__left {
    @include b(weixin-module) {
      @include public-style(80px);

      @include b(weixin-block-panel) {
        @include m(title) {
          padding: 10px;
          margin: 0 10px;
          font-size: 16px;
          color: #323232;
        }
        @include m(icon) {
          color: #56a848;
          position: absolute;
          border-radius: 3px;
          padding: 1px 6px;
          font-size: 22px;
          font-weight: 700;
          right: 8px;
          top: 12px;
          font-style: normal;
        }
      }
    }
  }
</style>

<template>
  <div class="weixin-block-panel">
    <p class="weixin-block-panel--title">{{weixinBlock.moduleTitle}}</p>
    <Icon class="weixin-block-panel--icon" type="ios-heart-outline"></Icon>
  </div>
</template>

<script>
  export default {
    name: "weixin-block",
    props: {
      moduleLayer: Array,
      weixinBlock: Object,
    }
  }
</script>

