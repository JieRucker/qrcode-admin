<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .qrcode-detail__left {
    @include b(imgs-module) {
      @include public-style();

      @include b(imgs-block-panel) {
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
      }
    }
  }
</style>

<template>
  <div class="imgs-block-panel">
    <p class="imgs-block-panel--title">{{imgsBlock.moduleTitle}}</p>
    <p class="imgs-block-panel--upload" v-if="imgsBlock.moduleObject && imgsBlock.moduleObject.imageUrl !== ''">
      <img class="imgs-block-panel--img" :src="imgsBlock.moduleObject.imageUrl">
    </p>
  </div>
</template>

<script>
  export default {
    name: "imgs-block",
    props: {
      imgsBlock: Object,
      index: Number,
    }
  }
</script>



