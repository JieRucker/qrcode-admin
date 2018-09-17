<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__left {
    @include b(imgs-group-module) {
      @include public-style();

      @include b(imgs-group-block-panel) {
        @include m(title) {
          padding: 10px;
          margin: 0 10px;
          font-size: 16px;
          color: #323232;

          /*padding: 10px 15px;
          color: #333;
          font-size: 16px;*/
          @include e(image) {
            height: 125px;
            line-height: 125px;
            text-align: center;
            color: #fff;
            font-size: 20px;
            background: #506b9e;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="imgs-group-block-panel">
    <p class="imgs-group-block-panel--title">{{imgsGroupBlock.moduleTitle}}</p>
    <div class="imgs-group-block-panel__carousel">
      <Carousel
        v-model="carousel.currentIndex"
        :autoplay="carousel.autoplay"
        :autoplay-speed="carousel.autoplaySpeed"
        :dots="carousel.dots"
        :radius-dot="carousel.radiusDot"
        :trigger="carousel.trigger"
        :arrow="carousel.arrow">
        <CarouselItem v-for="(item,index) in imgsGroupBlock.moduleObject.imageList" :key="index">
          <div class="imgs-group-block-panel__image">
            <img :src="item.imageUrl">
          </div>
        </CarouselItem>
      </Carousel>
    </div>
  </div>
</template>

<script>
  export default {
    name: "imgs-group-block",
    props: {
      moduleLayer: Array,
      imgsGroupBlock: Object,
    },
    data() {
      return {
        carousel: {
          currentIndex: 0, // 当前索引
          autoplay: true, // 自动播放
          autoplaySpeed: 2000, // 播放速度
          dots: this.imgsGroupBlock.moduleObject && this.imgsGroupBlock.moduleObject.imageList && this.imgsGroupBlock.moduleObject.imageList.length > 1 ? 'inside' : 'none',
          radiusDot: true, // 显示指示器
          trigger: 'click', // 触发方式
          arrow: 'never'
        }
      }
    }
  }
</script>

