<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__left {
    @include b(contact-info-module) {
      @include public-style();

      @include b(contact-info-block-panel) {
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
          @include e(address) {
            position: relative;
            padding: 10px;
            border-bottom: 1px solid #eaeaea;
            @include m(name) {
              color: #666;
              font-weight: 400;
              font-size: 12px;
              width: 230px;
              @include text-overflow;
            }
            @include m(map) {
              position: absolute;
              color: #56a848;
              border: 1px solid #56a848;
              padding: 2px 10px;
              right: 10px;
              left: inherit;
              top: -5px;
              font-size: 12px;
            }
          }

          @include e(item) {
            padding: 8px 10px;
            border-bottom: 1px solid #e4e4e4;
            @include m(desc) {
              width: 210px;
              @include text-overflow;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="contact-info-block-panel">
    <p class="contact-info-block-panel--title">{{contactInfoBlock.moduleTitle}}</p>
    <div class="contact-info-block-panel__section">
      <ul class="l-list">
        <li class="l-list__address">
          <p class="l-list__address--name">{{contactInfoBlock.moduleObject.address.address}}</p>
          <span class="l-list__address--map">地图</span>
        </li>
        <li class="l-list__item li-list" v-for="(item,index) in contactInfoBlock.moduleObject.contactWayList">
          <p class="l-list__item--desc">
            <span>{{item.name}}：</span>
            <span>{{item.content}}</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "contact-info-block",
    props: {
      moduleLayer: Array,
      contactInfoBlock: Object,
    },
  }
</script>

