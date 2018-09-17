<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .card-detail__left {
    @include b(address-module) {
      @include public-style(48px);

      @include b(address-block-panel) {
        @include b(l-list) {
          @include e(item) {
            padding: 13px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            @include m(label) {
              color: #999;
              width: 100px;
              text-align: left;
            }
            @include m(value) {
              text-align: left;
              margin-left: 100px;
              display: block;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="address-block-panel">
    <ul class="l-list">
      <li class="l-list__item" v-for="(item,index) in addressBlock.address">
        <span class="l-list__item--label">{{item.name}}</span>
        <span class="l-list__item--value">{{item.address}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "address-block",
    props: {
      addressBlock: Object,
      index: Number,
    }
  }
</script>


