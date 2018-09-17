<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__left {
    @include b(file-module) {
      @include public-style();

      @include b(file-block-panel) {
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
  }
</style>

<template>
  <div class="file-block-panel">
    <p class="file-block-panel--title">{{fileBlock.moduleTitle}}</p>
    <div class="file-block-panel__section">
      <ul class="l-list">
        <li class="l-list__item" v-for="(item,index) in fileBlock.moduleObject.fileList">
          <p class="l-list__item--name">
            <span>{{item.fileName}}</span>
          </p>
          <Icon class="l-list__item--icon download-outline" type="ios-download-outline"></Icon>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "file-block",
    props: {
      moduleLayer: Array,
      fileBlock: Object,
    },
  }
</script>

<style scoped>

</style>
