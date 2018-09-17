<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__left {
    @include b(video-module) {
      @include public-style();

      @include b(video-block-panel) {
        @include m(title) {
          padding: 10px;
          margin: 0 10px;
          font-size: 16px;
          color: #323232;
        }
        @include b(l-list) {
          padding: 0 10px;
          color: #666;
          font-size: 12px;
          @include e(item) {
            padding: 8px 10px;
            border-bottom: 1px solid #e4e4e4;
            @include m(name) {
              width: 210px;
              @include text-overflow;
            }
            @include m(icon) {
              float: right;
              font-size: 20px;
              margin-top: -20px;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="video-block-panel">
    <p class="video-block-panel--title">{{videoBlock.moduleTitle}}</p>
    <div class="video-block-panel__section">
      <ul class="l-list">
        <li class="l-list__item">
          <p class="l-list__item--name">
            <span>{{videoBlock.moduleObject.videoName}}</span>
          </p>
          <Icon class="l-list__item--icon download-outline" type="ios-download-outline"></Icon>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "video-block",
    props: {
      moduleLayer: Array,
      videoBlock: Object,
    },
  }
</script>

<style scoped>

</style>
