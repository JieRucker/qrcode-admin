<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .card-detail__right {
    .remark-module-popup {
      @include module-popup;
      .module-title {
        @include module-title;
      }
      @include b(form) {
        @include e(item) {
          @include m(plus) {
            font-size: 18px;
            vertical-align: middle;
            margin-left: 5px;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose">
    <a href="javascript:;" class="module-title">个人说明</a>
    <Form label-position="left" :label-width="100" class="form">
      <FormItem label="个人说明" class="form__item" v-for="(item,index) in initial.selfIntro" :key="index">
        <Input type="textarea" :rows="5" style="width: 400px" v-model="item.value"></Input>
      </FormItem>
    </Form>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';

  export default {
    name: "remark-module",
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
      }
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

      // 传真
      target.selfIntro = res.selfIntro ? res.selfIntro : '';

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);

      // 地址
      target.cardIntroInfo = (() => {
        let options;
        options = {
          selfIntro: this.tis.$Global.isArray(this.tis.initial.selfIntro) ? this.tis.initial.selfIntro[0].value : this.tis.initial.selfIntro
        };

        return options
      })();

      return target;
    }
  }
</script>

