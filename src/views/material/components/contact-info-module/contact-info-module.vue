<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__right {
    .contact-info-module-popup {
      @include module-popup;
      .popup-close {
        @include popup-close;
      }
      .popup-arrow {
        @include popup-arrow;
      }
      .module-title {
        @include module-title;
      }
      .module-group {
        margin-bottom: 15px;
        .module-control-label {
          @include module-control-label;
        }
        .module-control-content {
          float: left;
          width: 75%;
          .ios-location {
            margin-left: 10px;
          }
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveContactInfoModulePopup">
    <a href="javascript:;" class="module-title">联系模块操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">模块标题</label>
      <div class="module-control-content">
        <Input style="width: 400px" v-model="block.moduleTitle"></Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">描述</label>
      <div class="module-control-content">
        <Input style="width: 400px" v-model="initial.moduleDesc"></Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">详细地址</label>
      <div class="module-control-content">
        <Input style="width: 300px" v-if="initial.address" v-model="initial.address.address"></Input>
        <span class="ios-location">
          <Icon type="ios-location" size="14"></Icon>&nbsp;
          <a href="javascript:;">点击标注</a>
        </span>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">联系方式</label>
      <div class="module-control-content">
        <div v-for="(item,index) in initial.contactWayList"
             v-if="initial.contactWayList.length" style="margin-bottom: 10px">
          <Input style="width: 100px" v-model="item.name" placeholder="请输入名称"></Input>
          <Select v-model="item.type" style="width:100px;margin-left:5px;">
            <Option v-for="data in initial.typeList" :value="data.key" :key="data.key">
              {{data.value}}
            </Option>
          </Select>
          <Input style="width: 150px;margin-left:5px;" v-model="item.content" placeholder="请输入联系内容"></Input>
          <Icon type="trash-a" size="18" @click.native="deleteIcon(index)"
                style="margin-left:5px;cursor: pointer;vertical-align: middle"></Icon>
        </div>
        <Button @click="addContactInfo">
          <Icon type="plus-round" size="12"></Icon>&nbsp;添加联系信息
        </Button>
      </div>
    </div>

    <loader :dataSourceList="getDataSourceList" :confirmfunc="confirmfunc"></loader>
  </popup-modal>
</template>

<script>
  import loader from '@/components/launch/loader.vue';
  import popupModal from '../popup-modal/modal.vue';

  export default {
    name: "contact-info-module",
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
      currentTab: String,
      block: Object,
    },
    data() {
      return {
        initial: new Object(null)
      }
    },
    mounted() {
      this.initial = new Object(null);

      this.$api.qrcodeInterface.getModule({
        moduleId: this.block.moduleId
      }).then(res => {
        if (res.data.success) {
          new ToolFunctor(this)._get({...res.data.data});
        }
      }).catch(err => {
        console.error(err)
      });
    },
    methods: {
      /**
       * 显示地图
       */
      swMarkerMdl() {
        this.$store.dispatch('setDataSourceList', {
          compName: 'qMapMdl',
          dataSource: {
            showModal: true,
            templateObj: {
              address: this.initial.address.address,
              longitude: this.initial.address.longitude,
              dimension: this.initial.address.dimension
            }
          }
        });
      },
      /**
       * 回调函数callback
       */
      confirmfunc(value) {
        this.initial.address.address = value.address;
        this.initial.address.longitude = value.position.lng;
        this.initial.address.dimension = value.position.lat;
      },
      /**
       * 添加联系信息
       */
      addContactInfo() {
        this.initial.contactWayList.push({
          name: '',
          content: '',
          type: 0
        })
      },
      /**
       * 移除联系信息
       * @param index
       */
      deleteIcon(index) {
        this.initial.contactWayList.splice(index, 1)
      },
      /**
       * 保存联系信息
       */
      saveContactInfoModulePopup() {
        let param = new ToolFunctor(this)._set();
        this.$api.qrcodeInterface.updateModule(param).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
          }
        }).catch(err => {
          console.error(err)
        })
      },
      onClose() {
        this.$emit('update:currentTab', this.$Global.setValue(null));
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

    equal(fn) {
      return (...args) => {
        return fn.apply(this, args);
      }
    }

    _get(res) {
      let target = new Object(null);
      target.typeList = this._JSON().typeList;
      target.contactWayList = (() => {
        let a = null;

        if (res.moduleObject) {
          a = res.moduleObject.contactWayList
        } else {
          a = []
        }

        return a;
      })();

      // 模块描述
      target.moduleDesc = res.moduleObject ? res.moduleObject.moduleDesc : '';
      // 地址
      target.address = res.moduleObject ? res.moduleObject.address : {};

      return this.tis.initial = target;
    }

    _JSON() {
      let typeList = [{
        key: 0,
        value: '电话'
      },
        {
          key: 1,
          value: '手机'
        },
        {
          key: 2,
          value: '邮箱'
        },
        {
          key: 3,
          value: 'QQ号'
        },
        {
          key: 4,
          value: '其他'
        }];

      return {
        typeList
      }
    }

    _set() {
      let target = new Object(null);
      target.isFold = this.tis.block.isFold;
      target.isUsed = this.tis.block.isUsed;
      target.hasNew = true;
      target.moduleId = this.tis.block.moduleId; // 模块编号
      target.moduleTitle = this.tis.block.moduleTitle;
      target.moduleType = this.tis.block.moduleType;
      target.sortId = this.tis.block.sortId;
      target.templateId = this.tis.$route.query.templateId;
      target.uploadId = '';
      target.moduleVOJson = (() => {
        let options = {
          moduleId: this.tis.block.moduleId,
          moduleTitle: this.tis.block.moduleTitle,
          moduleType: this.tis.block.moduleType,
          templateId: this.tis.$route.query.templateId,
          isFold: this.tis.block.isFold,
          sortId: this.tis.block.sortId,
          isUsed: this.tis.block.isUsed,
          hasNew: true,
          moduleObject: {
            contactWayList: this.tis.initial.contactWayList,
            moduleDesc: this.tis.initial.moduleDesc,
            address: (() => {
              let a = {};
              a.longitude = this.tis.initial.address.longitude;
              a.dimension = this.tis.initial.address.dimension;
              a.address = this.tis.initial.address.address;

              return a;
            })()
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>


