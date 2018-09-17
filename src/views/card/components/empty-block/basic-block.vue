<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .card-detail__left {
    @include b(basic-module) {
      @include public-style();

      @include b(basic-block-panel) {
        @include b(info) {
          width: 100%;
          padding: 30px 16px 24px 16px;
          border-bottom: 1px solid #eee;
          &__layout_0 {
            .basic-block-panel__avatar {
              text-align: left;
            }
            display: flex;
          }
          &__layout_1 {
            .basic-block-panel__avatar {
              margin: auto;
            }
            text-align: center;
          }
          &__layout_2 {
            .basic-block-panel__avatar {
              float: right;
              text-align: right;
            }
            .basic-block-panel__desc {
              text-align: right;
            }
          }
        }
        @include e(avatar) {
          width: 100px;
          @include m(url) {
            width: 88px;
            height: 88px;
            box-shadow: 0 0 4px #747474;
            border-radius: 50%;
            background-color: #000;
            line-height: 88px;
            .ivu-avatar-string {
              line-height: inherit !important;
            }
          }
        }
        @include e(desc) {
          color: #fff;
          @include m(name) {
            font-size: 18px;
            margin-top: 5px;
          }
          @include m(job) {
            margin-top: 8px;
          }
          @include m(company) {
            margin-top: 8px;
          }
        }
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
  <div class="basic-block-panel">
    <div
      :class="[{'info__layout_0':basicBlock.layOut[0].value === 0},{'info__layout_1':basicBlock.layOut[0].value === 1},{'info__layout_2 clearfix':basicBlock.layOut[0].value === 2},'info']"
      :style="bgStyle">
      <div class="basic-block-panel__avatar">
        <Avatar class="basic-block-panel__avatar--url"
                :src="basicBlock.avatarImage.length && basicBlock.avatarImage[0].imageUrl">头像
        </Avatar>
      </div>
      <div class="basic-block-panel__desc">
        <p class="basic-block-panel__desc--name">{{basicBlock.fullName[0].value}}</p>
        <p class="basic-block-panel__desc--job">{{basicBlock.position[0].value}}</p>
        <p class="basic-block-panel__desc--company">{{basicBlock.company.departMentList[0].value}}</p>
      </div>
    </div>
    <div class="company">
      <ul class="l-list">
        <li class="l-list__item" v-for="(item,index) in basicBlock.company.departMentList" v-if="index !== 0">
          <span class="l-list__item--label">{{item.name}}</span>
          <span class="l-list__item--value">{{item.value}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "basic-block",
    props: {
      basicBlock: Object
    },
    computed: {
      bgStyle() {
        if (this.basicBlock.backGroundImage.length) {
          return {
            backgroundImage: `url(${this.basicBlock.backGroundImage[0].imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }
        }
      }
    }
  }
</script>
