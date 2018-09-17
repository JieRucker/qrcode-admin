<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .qrcode-detail__left {
    @include b(product-setting-module) {
      @include public-style();
      @include m(title) {
        padding: 10px;
        margin: 0 10px;
        font-size: 16px;
        color: #323232;
      }
      @include b(l-list) {
        padding-top: 5px;
        @include e(item) {
          padding: 8px 10px;
          border-bottom: 1px solid #e4e4e4;
          @include m(name) {

          }
          @include m(type) {
            float: right;
          }
        }
      }

    }
  }
</style>

<template>
  <div class="product-setting-block-panel">
    <ul class="l-list">
      <li class="l-list__item" v-for="(item,index) in productSettingBlock.moduleObject.productParameterList">
        <span class="l-list__item--name">{{item.paramName}}</span>
        <span class="l-list__item--type" v-if="item.type == 0">文本</span>
        <span class="l-list__item--type" v-if="item.type == 1">图片</span>
        <span class="l-list__item--type" v-if="item.type == 2">链接</span>
        <span class="l-list__item--type" v-if="item.type == 3">多行文本</span>
        <span class="l-list__item--type" v-if="item.type == 4">分组名称</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "product-setting-block",
    props: {
      moduleLayer: Array,
      productSettingBlock: Object,
    }
  }
</script>


