<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__right {
    .interact-module-popup {
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
            @include module-main-panel;
            .mobile-visible-panel {
              .inline {
                vertical-align: middle;
                margin-right: 15px
              }
            }
            .mobile-userGroup-panel {
              margin-top: 10px;
              .inline {
                vertical-align: middle;
                margin-right: 15px
              }
            }
            .mobile-password-panel {
              margin-top: 10px;
              .inline {
                vertical-align: middle;
                margin-right: 15px
              }
            }
            .mobile-editable-panel {
              margin-top: 10px;
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
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveInteractModulePopup">
    <a href="javascript:;" class="module-title">问卷调查操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">模块标题</label>
      <div class="module-control-content">
        <Input style="width: 300px"
               v-model="block.moduleTitle">
        </Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">描述</label>
      <div class="module-control-content">
        <Input style="width: 300px"
               v-model="initial.moduleDesc">
        </Input>
      </div>
    </div>
    <div slot="footer">
      <div class="module-group clearfix">
        <label class="module-control-label"></label>
        <div class="module-control-content">
          <Button size="large" class="edit-content-btn" @click="editInteractModulePopup">编辑问卷调查</Button>
          <Button type="primary" size="large" @click="saveInteractModulePopup">保存</Button>
        </div>
      </div>
    </div>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';

  export default {
    name: "interact-module",
    components: {
      popupModal
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
      this.$api.qrcodeInterface.getModule({
        moduleId: this.block.moduleId
      }).then(res => {
        res = res.data;
        if (res.success) {
          new ToolFunctor(this)._get({...res.data});
        }
      }).catch(err => console.error(err));
    },
    methods: {
      /**
       * 编辑问卷调查
       */
      editInteractModulePopup() {
        this.$router.push({
          name: "interact-detail",
          query: {
            templateId: this.$route.query.templateId,
            moduleId: this.block.moduleId,
          }
        })
      },
      /**
       * 保存问卷调查
       */
      saveInteractModulePopup() {
        let param = new ToolFunctor(this)._set();

        this.$api.qrcodeInterface.updateModule(param).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
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

      target.moduleInteractInfoList = res.moduleObject ? res.moduleObject.moduleInteractInfoList : [];
      // 启用名额限制 false 不启用 true 启用
      target.isOpenUserSubmitCountLimit = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.isOpenUserSubmitCountLimit : false;
      // 用户名额
      target.userSubmitCount = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.userSubmitCount : '';
      // 用户数据提交成功的提示信息成功
      target.userSubmitSuccessHint = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.userSubmitSuccessHint : '';
      // 是否选中用户数据提交成功后触发选择项;
      target.isOpenUserSubmitSuccessSelItem = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.isOpenUserSubmitSuccessSelItem : false;
      target.mapType = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.mapType : 0; // 0：单选 1：多选
      target.mapList = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.mapList : [];
      target.moduleDesc = res.moduleObject ? res.moduleObject.moduleDesc : ''; // 模块描述
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
      target.uploadId = '';
      target.moduleVOJson = (() => {
        let options;
        options = {
          moduleId: this.tis.block.moduleId,
          moduleTitle: this.tis.block.moduleTitle,
          moduleType: this.tis.block.moduleType,
          templateId: this.tis.$route.query.templateId,
          isFold: this.tis.block.isFold,
          sortId: this.tis.block.sortId,
          isUsed: this.tis.block.isUsed,
          hasNew: true,
          moduleObject: {
            moduleInteractInfoList: this.tis.initial.moduleInteractInfoList,
            moduleInteractInfoUserSubmitSuccessCfg: {
              isOpenUserSubmitCountLimit: this.tis.initial.isOpenUserSubmitCountLimit, // 启用名额限制 false 不启用 true 启用
              userSubmitCount: this.tis.initial.userSubmitCount, // 用户名额
              userSubmitSuccessHint: this.tis.initial.userSubmitSuccessHint,// 用户数据提交成功的提示信息成功
              isOpenUserSubmitSuccessSelItem: this.tis.initial.isOpenUserSubmitSuccessSelItem, // 是否选中用户数据提交成功后触发选择项;
              mapType: this.tis.initial.mapType,
              mapList: this.tis.initial.mapList
            },
            moduleDesc: this.tis.initial.moduleDesc
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>

