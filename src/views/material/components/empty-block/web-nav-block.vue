<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__left {
    @include b(web-nav-module) {
      @include public-style();

      @include b(web-nav-block-panel) {
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
              margin-top: -18px;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="web-nav-block-panel">
    <p class="web-nav-block-panel--title">{{webNavBlock.moduleTitle}}</p>
    <div class="web-nav-block-panel__section">
      <ul class="l-list">
        <li class="l-list__item" v-for="(item,index) in webNavBlock.moduleObject.navigationList">
          <p class="l-list__item--name">
            <span>{{item.navigationName}}</span>
          </p>
          <Icon class="l-list__item--icon arrow-outline" type="ios-arrow-right"></Icon>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "web-nav-block",
    props: {
      moduleLayer: Array,
      webNavBlock: Object,
    },
  }
</script>


