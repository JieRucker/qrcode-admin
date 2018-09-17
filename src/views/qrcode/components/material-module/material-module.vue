<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .qrcode-detail__right {
    .material-module-popup {
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
          .module-main-panel {
            @include module-main-panel(6px 0);
            .mobile-visible-panel {
              .inline {
                vertical-align: middle;
                margin-right: 15px
              }
            }
          }
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveMaterialModulePopup">
    <a href="javascript:;" class="module-title">素材模块操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">展示方式</label>
      <div class="module-control-content">
        <div class="module-main-panel">
          <div class="mobile-visible-panel" style="padding: 0 10px">
            <RadioGroup v-model="initial.showStyle">
              <Radio :label="item.key" v-for="(item,index) in label.openWayLabelList" :key="index">{{item.value}}</Radio>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">素材</label>
      <div class="module-control-content">
        <ul v-if="initial.selectMaterialList && initial.selectMaterialList.length">
          <li v-for="(item,index) in initial.selectMaterialList"
              style="padding: 10px 5px;background-color: #f8f8f8;">已选择素材名称:{{item.templateName}}
            <a href="javascript:;" @click="showMaterial">重新选择</a>
            <Icon type="close" @click.native="deleteIcon(index)"
                  style="float: right;padding: 3px 5px;cursor: pointer"></Icon>
          </li>
        </ul>
        <Button v-else @click="showMaterial">选择素材</Button>
      </div>
    </div>
    <div class="module-group clearfix" v-if="initial.showStyle === 1">
      <label class="module-control-label">链接名称</label>
      <div class="module-control-content">
        <Input style="width: 300px" v-model="initial.linkName">
        </Input>
      </div>
    </div>

    <loader :dataSourceList="getDataSourceList" :confirmfunc="confirmfunc"></loader>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';
  import loader from '@/components/launch/loader.vue';

  export default {
    name: "material-module",
    components: {
      popupModal,
      loader
    },
    props: {
      currentTab: String,
      block: Object,
    },
    computed: {
      getDataSourceList() {
        return this.$store.getters.getDataSourceList()
      }
    },
    data() {
      return {
        initial: new Object(null),
        label: {
          openWayLabelList: [
            {
              key: 0,
              value: '嵌入页面中显示'
            },
            {
              key: 1,
              value: '子页中打开'
            }
          ]
        }
      }
    },
    mounted() {
      this.initial = new Object(null);

      this.$api.qrcodeInterface.getModule({
        moduleId: this.block.moduleId
      }).then(res => {
        res = res.data;
        if (res.success) {
          new ToolFunctor(this)._get({...res.data});
        }
      }).catch(err => {
        console.error(err)
      });
    },
    methods: {
      /**
       * 修改维护模板回调函数callback
       */
      confirmfunc(value) {
        this.initial.selectMaterialList = new Array(value);
      },
      /**
       * 显示选择素材弹窗
       */
      showMaterial() {
        this.$store.dispatch('setDataSourceList', {
          compName: 'mMaterialMdl',
          dataSource: {
            showModal: true,
            templateObj: {
              templateId: this.initial.selectMaterialList.length && this.initial.selectMaterialList[0].templateId
            }
          }
        });
      },
      /**
       * 移除素材
       * @param index
       */
      deleteIcon(index) {
        this.initial.selectMaterialList.splice(index, 1)
      },
      /**
       * 保存素材
       */
      saveMaterialModulePopup() {
        let param = new ToolFunctor(this)._set();
        this.$api.qrcodeInterface.updateModule(param).then(res => {
          res = res.data;
          if (res.success) {
            return this.$Message.info('成功');
          }
        }).catch(err => console.error(err))
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

    _get(res) {
      let target = new Object(null);

      // 选择素材
      target.selectMaterialList = (() => {
        let a = [];
        if (!this.tis.$Global.isBlank(res.moduleObject.templateId)) {
          a.push({
            templateName: res.moduleObject.templateName,
            templateId: res.moduleObject.templateId
          })
        }

        return a;
      })();
      // 展示方式
      target.showStyle = res.moduleObject ? res.moduleObject.showStyle : 0;
      // 链接名称
      target.linkName = res.moduleObject ? res.moduleObject.linkName : '';

      return this.tis.initial = target;
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
      target.uploadId = this.tis.uploadId;
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
            templateId: this.tis.initial.selectMaterialList.length ? this.tis.initial.selectMaterialList[0].templateId : '',
            templateName: this.tis.initial.selectMaterialList.length ? this.tis.initial.selectMaterialList[0].templateName : '',
            showStyle: this.tis.initial.showStyle,
            linkName: this.tis.initial.linkName
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>

