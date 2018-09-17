<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .card-detail__right {
    .contacts-module-popup {
      @include module-popup;
      .module-title {
        @include module-title;
      }
      @include b(form) {
        @include e(item) {
          @include m(icon) {
            font-size: 18px;
            vertical-align: middle;
            width: 24px;
            text-align: center;
            cursor: pointer;
          }
          @include m(trash) {
            font-size: 22px;
          }
          @include m(title) {
            width: 80px;
            margin-right: 24px;
            margin-left: -107px;
          }
        }
        @include e(tip) {
          width: 400px;
          background-color: #f2f2f2;
          padding: 5px 10px;
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose">
    <a href="javascript:;" class="module-title">联系信息</a>
    <Form label-position="left" :label-width="100" class="form">
      <FormItem label="固定电话" v-for="(item,index) in initial.telephone" :key="index">
        <Input style="width: 400px" v-model="item.value"></Input>
      </FormItem>
      <FormItem :label="key === 0 && '移动电话'" class="form__item" v-for="(item,key) in initial.familyPhoneList" :key="key">
        <Input class="form__item--title" v-model="item.name" v-if="key !== 0"></Input>
        <Input style="width: 400px" v-model="item.value"></Input>
        <Icon type="plus-circled" class="form__item--icon" @click.native="onPlus({type:0})" v-if="key === 0"></Icon>
        <Icon type="ios-trash" class="form__item--icon form__item--trash" @click.native="onTrash({type:0,key:key})"
              v-if="key !== 0"></Icon>
      </FormItem>
      <FormItem :label="key === 0 && '传真'" class="form__item" v-for="(item,key) in initial.faxList" :key="key">
        <Input class="form__item--title" v-model="item.name" v-if="key !== 0"></Input>
        <Input style="width: 400px" v-model="item.value"></Input>
        <Icon type="plus-circled" class="form__item--icon" @click.native="onPlus({type:1})" v-if="key === 0"></Icon>
        <Icon type="ios-trash" class="form__item--icon form__item--trash" @click.native="onTrash({type:1,key:key})"
              v-if="key !== 0"></Icon>
      </FormItem>
      <FormItem :label="key === 0 && '电子邮箱'" class="form__item" v-for="(item,key) in initial.emailList" :key="key">
        <Input class="form__item--title" v-model="item.name" v-if="key !== 0"></Input>
        <Input style="width: 400px" v-model="item.value"></Input>
        <Icon type="plus-circled" class="form__item--icon" @click.native="onPlus({type:2})" v-if="key === 0"></Icon>
        <Icon type="ios-trash" class="form__item--icon form__item--trash" @click.native="onTrash({type:2,key:key})"
              v-if="key !== 0"></Icon>
      </FormItem>
      <FormItem label="" class="form__item">
        <div class="form__tip">
          <p>1.微信扫码识别后保存到通讯录，最多可保存三个号码。</p>
          <p>2.想要保存更多信息，可通过浏览器打开保存vcf文件。</p>
        </div>
      </FormItem>
    </Form>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';

  export default {
    name: "contacts-module",
    components: {
      popupModal
    },
    props: {
      cardType: String,
      block: Object,
    },
    data() {
      return {
        initial: new Object(null),
        toolFunctor: null,
      }
    },
    mounted() {
      this.toolFunctor = new ToolFunctor(this);
      this.toolFunctor._get({});
    },
    methods: {
      onClose() {
        this.$emit('update:cardType', null);
      },
      onPlus(param) {
        switch (param.type) {
          case 0:
            this.initial.familyPhoneList.push({
              name: '移动电话',
              value: ''
            });
            break;
          case 1:
            this.initial.faxList.push({
              name: '传真',
              value: ''
            });
            break;
          case 2:
            this.initial.emailList.push({
              name: '电子邮箱',
              value: ''
            });
            break;
        }
      },
      onTrash(param) {
        switch (param.type) {
          case 0:
            this.initial.familyPhoneList.splice(param.key, 1);
            break;
          case 1:
            this.initial.faxList.splice(param.key, 1);
            break;
          case 2:
            this.initial.emailList.splice(param.key, 1);
            break;
        }
      },
    }
  }

  class ToolFunctor {
    constructor(tis) {
      if (!tis) {
        throw new Error('[SKETCHPAD]: Missing parameters (tis)');
      }

      this.tis = typeof(tis) !== 'undefined' ? tis : null;
    }

    _get(res) {
      let target = new Object(null);
      // 固定电话
      target.telephone = res.telephone;
      // 移动电话
      target.familyPhoneList = res.mobilePhone ? res.mobilePhone.familyPhoneList : (() => {
        return new Array({
          name: '移动电话',
          value: ''
        });
      })();
      // 传真
      target.faxList = res.faxList ? res.faxList : (() => {
        return new Array({
          name: '传真',
          value: ''
        });
      })();
      // 邮箱
      target.emailList = res.emailList ? res.emailList : (() => {
        return new Array({
          name: '电子邮箱',
          value: ''
        });
      })();

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);

      target.cardLinkInfo = (() => {
        let options;
        options = {
          telephone: this.tis.$Global.isArray(this.tis.initial.telephone) ? this.tis.initial.telephone[0].value : this.tis.initial.telephone, // 固定电话
          mobilePhone: {// 移动电话
            familyPhoneList: this.tis.initial.familyPhoneList
          },
          faxList: this.tis.initial.faxList, // 传真
          emailList: this.tis.initial.emailList // 邮箱
        };

        return options
      })();

      return target;
    }
  }
</script>

