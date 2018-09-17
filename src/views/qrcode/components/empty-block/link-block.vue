<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .qrcode-detail__left {
    @include b(link-module) {
      @include public-style();

      @include b(link-block-panel) {
        @include m(title) {
          padding: 10px;
          margin: 0 10px;
          font-size: 16px;
          color: #323232;
        }
        @include e(section) {
          padding: 0 10px;
          color: #666;
          font-size: 12px;
        }

        @include b(l-list) {
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
  <div class="link-block-panel">
    <p class="link-block-panel--title">{{linkBlock.moduleTitle}}</p>
    <div class="link-block-panel__section">
      <ul class="l-list">
        <li class="l-list__item" v-for="(item,index) in linkBlock.moduleObject.linkList">
          <p class="l-list__item--name">
            <span>{{item.linkName}}</span>
          </p>
          <Icon class="l-list__item--icon link-outline" type="link"></Icon>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "link-block",
    props: {
      moduleLayer: Array,
      linkBlock: Object,
    },
  }
</script>
