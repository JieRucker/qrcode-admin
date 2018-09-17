<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__left {
    @include b(imgs-txt-module) {
      @include public-style();

      @include b(imgs-txt-block-panel) {
        @include m(title) {
          padding: 10px;
          margin: 0 10px;
          font-size: 16px;
          color: #323232;
        }
        @include m(upload) {
          width: 100%;
          height: 145px;
          border-radius: 0;
          background-size: 60px;
          padding: 0;
          color: #333;
          font-size: 16px;
          line-height: 20px;
          font-weight: 400;
          position: static;
          bottom: 0;
          top: auto;
          left: 0;
          text-align: left;
          @include text-overflow;
        }
        @include m(img) {
          object-fit: cover;
          width: 100%;
          height: 145px;
        }
        @include e(text) {
          width: 100%;
          padding: 10px 15px;
          color: #333;
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          text-align: left;
          @include text-overflow;
        }
      }
    }
  }
</style>
<template>
  <div class="imgs-txt-block-panel">
    <p class="imgs-txt-block-panel--title">{{imgsTxtBlock.moduleTitle}}</p>
    <p class="imgs-txt-block-panel--upload">
      <img class="imgs-txt-block-panel--img"
           :src="imgsTxtBlock.moduleObject && imgsTxtBlock.moduleObject.image && imgsTxtBlock.moduleObject.image.imageUrl">
    </p>
    <p class="imgs-txt-block-panel--text"
       v-html="imgsTxtBlock.moduleObject && imgsTxtBlock.moduleObject.textContent"></p>
  </div>
</template>

<script>
  export default {
    name: "imgs-txt-block",
    props: {
      imgsTxtBlock: Object,
      index: Number
    }
  }
</script>
