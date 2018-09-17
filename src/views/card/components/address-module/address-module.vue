<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .card-detail__right {
    .address-module-popup {
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
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose">
    <a href="javascript:;" class="module-title">地址</a>
    <Form label-position="left" :label-width="100" class="form">
      <FormItem :label="key === 0 && '地址'" class="form__item" v-for="(item,key) in initial.addressList" :key="key">
        <Input class="form__item--title" v-model="item.name" v-if="key !== 0"></Input>
        <Input style="width: 250px" v-model="item.address"></Input>
        <Icon type="location" class="form__item--icon" v-if="key === 0"></Icon>
        <a href="javascript:;" @click="swMarkerMdl(key)" v-if="key === 0">标注地址</a>
        <Icon type="plus-circled" class="form__item--icon" @click.native="onPlus({type:0})" v-if="key === 0"></Icon>
        <Icon type="ios-trash" class="form__item--icon form__item--trash" @click.native="onTrash({type:0,key:key})"
              v-if="key !== 0"></Icon>
      </FormItem>
    </Form>

    <loader :dataSourceList="getDataSourceList" :confirmfunc="confirmfunc"></loader>
  </popup-modal>
</template>

<script>
  import loader from '@/components/launch/loader.vue';
  import popupModal from '../popup-modal/modal.vue';

  export default {
    name: "address-module",
    components: {
      popupModal,
      loader
    },
    computed: {
      getDataSourceList() {
        return this.$store.getters.getDataSourceList()
      }
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
      /**
       * 显示地图
       */
      swMarkerMdl(index) {
        let address = this.initial.addressList[index];
        this.$store.dispatch('setDataSourceList', {
          compName: 'qMapMdl',
          dataSource: {
            showModal: true,
            templateObj: {
              currentIndex: index,
              address: address.address,
              longitude: address.longitude,
              dimension: address.dimension
            }
          }
        });
      },
      /**
       * 回调函数callback
       */
      confirmfunc(value) {
        this.initial.addressList[value.currentIndex].address = value.address;
        this.initial.addressList[value.currentIndex].longitude = value.position.lng;
        this.initial.addressList[value.currentIndex].dimension = value.position.lat;
      },
      onClose() {
        this.$emit('update:cardType', null);
      },
      onPlus(param) {
        switch (param.type) {
          case 0:
            this.initial.addressList.push({
              name: '地址',
              longitude: '', // 经度
              dimension: '', // 维度
              address: '', // 中文地址
            });
            break;
        }
      },
      onTrash(param) {
        switch (param.type) {
          case 0:
            this.initial.addressList.splice(param.key, 1);
            break;
        }
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

      // 地址
      target.addressList = res.address ? res.address : (() => {
        return new Array({
          name: '地址',
          longitude: '', // 经度
          dimension: '', // 维度
          address: '', // 中文地址
        });
      })();

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);

      // 地址
      target.address = this.tis.initial.addressList;
      return target;
    }
  }
</script>

