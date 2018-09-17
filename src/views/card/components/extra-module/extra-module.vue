<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .card-detail__right {
    .extra-module-popup {
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
    <a href="javascript:;" class="module-title">附加内容</a>
    <Form label-position="left" :label-width="100" class="form">
      <FormItem label="附加内容" class="form__item">
        <Select v-model="initial.additionalType" style="width:100px;margin-left:5px;">
          <Option v-for="item in additionalTypeList" :value="item.additionalType" :key="item.additionalType">
            {{item.value}}
          </Option>
        </Select>
      </FormItem>
    </Form>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';

  export default {
    name: "extra-module",
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
        additionalTypeList: [
          {
            additionalType: 0,
            value: '素材'
          },
          {
            additionalType: 1,
            value: '企业码'
          },
        ]
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

      // 0 素材 1企业码.
      target.additionalType = res.additionalType ? res.additionalType : 0;
      // 素材或企业码 对应的主键
      target.templateId = res.templateId ? res.templateId : '';

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);

      // 附加内容
      target.cardAdditionInfo = (() => {
        let options;
        options = {
          additionalType: this.tis.initial.additionalType, // 0 素材 1企业码.
          templateId: this.tis.initial.templateId, // 素材或企业码 对应的主键
        };

        return options
      })();

      return target;
    }
  }
</script>

