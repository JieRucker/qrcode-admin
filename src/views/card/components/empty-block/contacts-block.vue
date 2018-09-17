<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .card-detail__left {
    @include b(contacts-module) {
      @include public-style();

      @include b(contacts-block-panel) {
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
  <div class="contacts-block-panel">
    <ul class="l-list">
      <li class="l-list__item" v-for="item in contactsBlock.telephone">
        <span class="l-list__item--label">{{item.name}}</span>
        <span class="l-list__item--value">{{item.value}}</span>
      </li>
      <li class="l-list__item" v-for="item in contactsBlock.mobilePhone.familyPhoneList">
        <span class="l-list__item--label">{{item.name}}</span>
        <span class="l-list__item--value">{{item.value}}</span>
      </li>
      <li class="l-list__item" v-for="item in contactsBlock.faxList">
        <span class="l-list__item--label">{{item.name}}</span>
        <span class="l-list__item--value">{{item.value}}</span>
      </li>
      <li class="l-list__item" v-for="item in contactsBlock.emailList">
        <span class="l-list__item--label">{{item.name}}</span>
        <span class="l-list__item--value">{{item.value}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "contacts-block",
    props: {
      contactsBlock: Object,
      index: Number,
    }
  }
</script>



