<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .qrcode-detail__right {
    .header-module-popup {
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
          @include module-control-label(20%);
        }
        .module-control-content {
          float: left;
          width: 75%;
          padding: .344rem .75rem;
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveHeaderModulePopup">
    <a href="javascript:;" class="module-title">码信息设置操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">产品名称</label>
      <div class="module-control-content">
        <Input style="width: 300px"
               v-model="block.moduleTitle">
        </Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">状态设置</label>
      <div class="module-control-content" v-if="initial.templateRecordStateVO">
        <div>
          <Checkbox v-model="initial.templateRecordStateVO.isOpenRecordState">&nbsp;开启</Checkbox>
          <a href="javascript:;" @click="showStateMdl({type:0})"
             v-if="!initial.templateRecordStateVO.editRecordStateAuthGroup.length">编辑</a>
          <p style="color: #999;margin-top: 10px">开启后允许成员变更状态，还能接收异常消息提醒。</p>
        </div>
        <div v-if="initial.templateRecordStateVO.isOpenRecordState" style="margin-top: 5px">
          <div style="padding: 5px;background: #f2f2f2"
               v-if="initial.templateRecordStateVO.recordStateTemplateVO.recordStateTemplateId !== ''">
            <p style="display: inline-block">已选状态：</p>
            <ul style="display: inline-block;margin-left: 10px">
              <li style="display: inline-block;">
                {{initial.templateRecordStateVO.recordStateTemplateVO.recordStateTemplateName}}
              </li>
              <li style="display: inline-block"
                  v-for="item in initial.templateRecordStateVO.recordStateTemplateVO.stateCfgList">
                ({{item.itemName}})
              </li>
            </ul>
            <a href="javascript:;" @click="showStateMdl({type:1})"
               style="display: inline-block;float: right">修改</a>
          </div>
          <div style="padding: 5px;background: #f2f2f2"
               v-if="initial.templateRecordStateVO.editRecordStateAuthGroup.length">
            <p style="display: inline-block">谁能设置：</p>
            <ul style="display: inline-block;margin-left: 10px">
              <li v-for="(item,index) in initial.templateRecordStateVO.editRecordStateAuthGroup"
                  style="display: inline-block;margin-right: 5px">
                {{item.authGroupName}}
              </li>
            </ul>
          </div>
          <div v-if="initial.templateRecordStateVO.recordStateChangeRemindAuthGroup.length"
               style="padding: 5px;background: #f2f2f2">
            <p style="display: inline-block">状态变更提醒：</p>
            <ul style="display: inline-block;margin-left: 10px">
              <li style="display: inline-block;margin-right: 5px">
                {{initial.templateRecordStateVO.recordStateChangeRemindItemValue}}时
              </li>
              <li v-for="item in initial.templateRecordStateVO.recordStateChangeRemindAuthGroup"
                  style="display: inline-block;margin-right: 5px">
                {{item.authGroupName}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">基本信息设置</label>
      <div class="module-control-content" v-if="initial.templateInfoVO">
        <div>
          <Checkbox v-model="initial.templateInfoVO.isOpenTemplateInfo">&nbsp;开启</Checkbox>
          <a href="javascript:;" @click="showInfoMdl({type:0})"
             v-if="!initial.templateInfoVO.editTemplateInfoAuthGroup.length">编辑</a>
          <p style="color: #999;margin-top: 10px;">开启后允许成员扫码设置地理位置，现场照片等基本信息。</p>
        </div>
        <div v-if="initial.templateInfoVO.isOpenTemplateInfo" style="margin-top: 5px">
          <div style="padding: 5px;background: #f2f2f2;" v-if="initial.templateInfoVO.editTemplateInfoAuthGroup.length">
            <p style="display: inline-block">谁能设置：</p>
            <ul style="display: inline-block">
              <li v-for="(item,index) in initial.templateInfoVO.editTemplateInfoAuthGroup"
                  style="display: inline-block;margin-right: 5px">
                {{item.authGroupName}}
              </li>
            </ul>
            <a href="javascript:;" @click="showInfoMdl({type:1})"
               style="display: inline-block;float: right">修改</a>
          </div>
        </div>
      </div>
    </div>

    <loader :dataSourceList="getDataSourceList" :confirmfunc="confirmfunc"></loader>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';
  import loader from '@/components/launch/loader.vue';
  import stateSettingNature from './modal/state-setting-nature.vue';
  import infoSettingNature from './modal/info-setting-nature.vue';

  export default {
    name: "header-module",
    components: {
      popupModal,
      loader,
      stateSettingNature,
      infoSettingNature
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
        headerModuleItem: {
          checkbox: {
            state: false,
            info: false
          }
        }
      }
    },
    mounted() {
      this.initial = new Object(null);

      this.$api.qrcodeInterface.getTemplateInfo({
        templateId: this.$route.query.templateId
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
        console.log(value);
        if (value.isInfoSetting) {
          this.initial.templateInfoVO.editTemplateInfoAuthGroup = value.editTemplateInfoAuthGroup;
        } else if (value.isStateSetting) {
          this.initial.templateRecordStateVO.recordStateTemplateVO = value.recordStateTemplateVO;
          this.initial.templateRecordStateVO.editRecordStateAuthGroup = value.editRecordStateAuthGroup;
          this.initial.templateRecordStateVO.isOpenRecordStateChangeRemind = value.isOpenRecordStateChangeRemind;
          this.initial.templateRecordStateVO.recordStateChangeRemindAuthGroup = value.recordStateChangeRemindAuthGroup;
          this.initial.templateRecordStateVO.recordStateChangeRemindItemValue = value.recordStateChangeRemindItemValue;
        }
      },
      /**
       * 显示状态设置
       * @param param
       */
      showStateMdl(param) {
        this.initial.templateRecordStateVO.isOpenRecordState = true;
        this.$store.dispatch('setDataSourceList', {
          compName: 'qStateSettingMdl',
          dataSource: {
            showModal: true,
            templateObj: {
              recordStateTemplateVO: this.initial.templateRecordStateVO.recordStateTemplateVO,
              editRecordStateAuthGroup: param.type === 0 ? [] : this.initial.templateRecordStateVO.editRecordStateAuthGroup,
              recordStateChangeRemindAuthGroup: param.type === 0 ? [] : this.initial.templateRecordStateVO.recordStateChangeRemindAuthGroup,
              isOpenRecordStateChangeRemind: param.type === 0 ? false : this.initial.templateRecordStateVO.isOpenRecordStateChangeRemind,
              recordStateChangeRemindItemValue: param.type === 0 ? '' : this.initial.templateRecordStateVO.recordStateChangeRemindItemValue,
            },
            initial: this.initial
          }
        });
      },
      /**
       * 显示基本信息
       * @param param
       */
      showInfoMdl(param) {
        this.initial.templateInfoVO.isOpenTemplateInfo = true;
        this.$store.dispatch('setDataSourceList', {
          compName: 'qInfoSettingMdl',
          dataSource: {
            showModal: true,
            templateObj: {
              tagList: param.type === 0 ? [] : this.initial.templateInfoVO.editTemplateInfoAuthGroup
            }
          }
        });
      },
      /**
       * 保存基本信息
       */
      saveHeaderModulePopup() {
        let param = new ToolFunctor(this)._set();
        console.log(param);
        this.$api.qrcodeInterface.updateSingleTemplate(param).then(res => {
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

    _get(res) {

      let target = new Object(null);
      target.templateFoldId = res.templateFoldId ? res.templateFoldId : '';
      target.templateId = res.templateId ? res.templateId : '';
      target.templateName = res.templateName ? res.templateName : '';
      target.templateInfoVO = res.templateInfoVO ? (() => {
        return res.templateInfoVO
      })() : {
        address: '',
        editTemplateInfoAuthGroup: [],
        isOpenTemplateInfo: false,
        templateId: res.templateId,
        templateImageList: [],
        templateInfoDesc: ''
      };
      target.templateRecordStateVO = res.templateRecordStateVO ? (() => {
        return res.templateRecordStateVO;
      })() : {
        recordStateTemplateVO: {
          recordStateTemplateId: '',
          recordStateTemplateName: '',
          stateCfgList: []
        },
        isOpenRecordState: false,
        editRecordStateAuthGroup: [],
        isOpenRecordStateChangeRemind: false,
        recordStateChangeRemindItemValue: '', // 选中状态变更提醒颜色
        recordStateChangeRemindAuthGroup: [], // 状态变更提醒人员组
        templateId: res.templateId,
        recordStateResultId: '',
        itemValue: '暂无状态',
        itemColor: '-',
        lastItemValue: ''
      };

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);
      target.templateFoldId = this.tis.initial.templateFoldId;
      target.templateId = this.tis.initial.templateId;
      target.templateName = this.tis.block.moduleTitle;
      target.recordResultJson = null;
      target.templateInfoListJson = (() => {
        return JSON.stringify(this.tis.initial.templateInfoVO)
      })();
      target.templateRecordStateInfoJson = (() => {
        return JSON.stringify(this.tis.initial.templateRecordStateVO)
      })();

      return target;
    }
  }
</script>
