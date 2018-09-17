<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .qrcode-detail__left {
    @include b(card-module) {
      @include public-style();

      @include b(card-block-panel) {
        @include m(title) {
          padding: 10px;
          margin: 0 10px;
          font-size: 16px;
          color: #323232;
        }
        @include e(box) {
          position: relative;
          padding: 20px;
          @include m(img) {
            width: 70px;
            display: inline-block;
            vertical-align: middle;
            max-width: 100%;
          }
        }

        @include e(info) {
          display: inline-block;
          width: 180px;
          vertical-align: middle;
          margin-left: 20px;
          @include m(name) {
            font-size: 14px;
            margin-bottom: 2px;
            color: #666;
            line-height: 20px;
            font-weight: 400;
            @include text-overflow;
          }
          @include m(job) {
            color: #666;
            font-weight: 400;
            line-height: 20px;
            font-size: 12px;
          }
          @include m(company) {
            color: #666;
            font-weight: 400;
            line-height: 20px;
            font-size: 12px;
          }
          @include m(icon) {
            position: absolute;
            right: 20px;
            top: 50%;
            font-size: 20px;
            margin-top: -10px;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="card-block-panel">
    <p class="card-block-panel--title">{{cardBlock.moduleTitle}}</p>
    <div class="card-block-panel__box">
      <img class="card-block-panel__box--img" :src="card.cardBaseInfo.avatarImage.imageUrl"
           v-if="card.cardBaseInfo.avatarImage.imageUrl !== ''">
      <img class="card-block-panel__box--img" :src="avatar" v-else>
      <div class="card-block-panel__info">
        <h3 class="card-block-panel__info--name">{{card.cardBaseInfo.fullName}}</h3>
        <p class="card-block-panel__info--job">
          <span v-if="card.cardBaseInfo.position !== ''">{{card.cardBaseInfo.position}}</span>
          <span v-else>职位</span>
        </p>
        <p class="card-block-panel__info--company">
          <span v-if="card.cardBaseInfo.company.departMentList.length">
            {{card.cardBaseInfo.company.departMentList[0].value}}
          </span>
          <span v-else>公司</span>
        </p>
      </div>
      <Icon class="card-block-panel__info--icon" type="ios-arrow-right"></Icon>
    </div>
  </div>
</template>

<script>
  export default {
    name: "card-block",
    props: {
      moduleLayer: Array,
      cardBlock: Object,
    },
    computed: {
      // 头像
      avatar() {
        return `${process.env.api.staticUrl}static/images/card/avatar_default.png`
      },
      // 名片数据
      card(){
        return JSON.parse(this.cardBlock.moduleObject.cardJson)
      }
    }
  }
</script>

