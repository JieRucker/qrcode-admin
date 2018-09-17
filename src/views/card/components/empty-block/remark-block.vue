<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .card-detail__left {
    @include b(remark-module) {
      @include public-style(48px);

      @include b(remark-block-panel) {
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
  <div class="remark-block-panel">
    <ul class="l-list">
      <li class="l-list__item" v-for="item in remarkBlock.selfIntro">
        <span class="l-list__item--label">{{item.name}}</span>
        <span class="l-list__item--value">{{item.value}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "remark-block",
    props: {
      remarkBlock: Object,
      index: Number,
    }
  }
</script>

