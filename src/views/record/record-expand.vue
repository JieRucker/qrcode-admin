<style lang="scss">
  @include b(record-expand) {
    @include e(section) {
      @include b(table) {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
        @include b(header) {
          padding: 10px;
          background-color: #f8f8f8;
          border: 1px solid rgba(120, 130, 140, .13);
          border-bottom: 0;
        }
        @include b(body) {
          @include b(l-list) {
            display: table;
            border: 1px solid rgba(120, 130, 140, .13);
            width: 100%;
            @include e(item) {
              display: table-row;
            }

            @include e(name) {
              display: table-cell;
              padding: 8px;
              vertical-align: middle;
              border-top: 1px solid rgba(120, 130, 140, .13);
              &:first-child {
                border-right: 1px solid rgba(120, 130, 140, .13);
                color: #666;
                min-width: 100px;
              }
            }

            @include e(value) {
              display: table-cell;
              padding: 10px;
              vertical-align: middle;
              border-top: 1px solid rgba(120, 130, 140, .13);
            }
          }
        }

      }
    }

    @include e(footer) {
      text-align: right;
      padding-right: 10px;
      color: #999;
      @include m(btn) {
        width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        display: inline-block;
        text-align: center;
        cursor: pointer;
      }
    }
  }
</style>

<template>
  <div class="record-expand">
    <div class="record-expand__section" v-for="(item,index) in initial.recordGroupList">
      <div class="table" v-if="item.recodGroupType === 1">
        <div class="header">
          <span>{{item.recordGroupName}}</span>
        </div>
        <div class="body">
          <ul class="l-list">
            <!--0文本 1图片 2多项选择 3单项选择 4多行文本框 5日期 6时间 7录音 8位置定位-->
            <li class="l-list__item" v-for="(child,childIndex) in item.normalRecordGroupInfoList">
              <div class="l-list__name">{{child.normalRecordGroupInfoCfg.recordTitle}}</div>
              <div class="l-list__value">
                <div v-if="child.normalRecordGroupInfoCfg.recordType === 0">
                  <span v-if="child.normalRecordGroupInfoResult.textResult">
                    {{child.normalRecordGroupInfoResult.textResult}}
                  </span>
                </div>
                <div v-if="child.normalRecordGroupInfoCfg.recordType === 1">
                  <ul class="image-list" v-if="child.normalRecordGroupInfoResult.imageResultList">
                    <li class="image-list__item"
                        v-for="(img,imgIndex) in child.normalRecordGroupInfoResult.imageResultList">
                      <img :src="img.imageUrl">
                    </li>
                  </ul>
                </div>
                <div v-if="child.normalRecordGroupInfoCfg.recordType === 2">
                  <ul class="checkbox-list" v-if="child.normalRecordGroupInfoResult.checkBoxResultList">
                    <li class="checkbox-list__item"
                        v-for="(checkbox,checkboxIndex) in child.normalRecordGroupInfoResult.checkBoxResultList">
                      {{checkbox.value}}
                    </li>
                  </ul>
                </div>
                <div v-if="child.normalRecordGroupInfoCfg.recordType === 3">
                  <span v-if="child.normalRecordGroupInfoResult.radioResult">
                    {{child.normalRecordGroupInfoResult.radioResult}}
                  </span>
                </div>
                <div v-if="child.normalRecordGroupInfoCfg.recordType === 4">
                  <span v-if="child.normalRecordGroupInfoResult.textareaResult">
                    {{child.normalRecordGroupInfoResult.textareaResult}}
                  </span>
                </div>
                <div v-if="child.normalRecordGroupInfoCfg.recordType === 5">
                  <span v-if="child.normalRecordGroupInfoResult.dateResult">
                    {{child.normalRecordGroupInfoResult.dateResult}}
                  </span>
                </div>
                <div v-if="child.normalRecordGroupInfoCfg.recordType === 6">
                  <span v-if="child.normalRecordGroupInfoResult.timeResult">
                    {{child.normalRecordGroupInfoResult.timeResult}}
                  </span>
                </div>
                <div v-if="child.normalRecordGroupInfoCfg.recordType === 7">
                  <span
                    v-if="child.normalRecordGroupInfoResult.audioResult && child.normalRecordGroupInfoResult.audioResult.audioName">
                     {{child.normalRecordGroupInfoResult.audioResult.audioName}}
                  </span>
                </div>
                <div v-if="child.normalRecordGroupInfoCfg.recordType === 8">
                  <Icon type="location"
                        v-if="child.normalRecordGroupInfoResult.addressResult && child.normalRecordGroupInfoResult.addressResult.address"></Icon>
                  <span
                    v-if="child.normalRecordGroupInfoResult.addressResult && child.normalRecordGroupInfoResult.addressResult.address">
                    {{child.normalRecordGroupInfoResult.addressResult.address}}
                  </span>
                  <span
                    v-if="child.normalRecordGroupInfoResult.addressResult && child.normalRecordGroupInfoResult.addressResult.dimension">
                    {{child.normalRecordGroupInfoResult.addressResult.dimension}}
                  </span>
                  <span
                    v-if="child.normalRecordGroupInfoResult.addressResult && child.normalRecordGroupInfoResult.addressResult.longitude">
                    {{child.normalRecordGroupInfoResult.addressResult.longitude}}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="table" v-if="item.recodGroupType === 0">
        <div class="header">
          <span>{{item.recordGroupName}}</span>
        </div>
        <div class="body">
          <ul class="l-list">
            <li class="l-list__item" v-for="(child,childIndex) in item.checkRecordGroupInfoList">
              <div class="l-list__name">{{child.checkRecordGroupInfoCfg.value}}</div>
              <div class="l-list__value">
                <span v-if="child.checkRecordGroupInfoResult.itemResult === 0">×</span>
                <span v-if="child.checkRecordGroupInfoResult.itemResult === 1">√</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="record-expand__footer">
      <div class="record-expand__icon">
        <!--<Icon type="eye" class="record-expand__footer&#45;&#45;btn" @click.native="handleEye"></Icon>-->
        <Icon type="android-create" class="record-expand__footer--btn" @click.native="handleEdit"></Icon>
        <Icon type="ios-trash" class="record-expand__footer--btn" @click.native="handleTrash"></Icon>
      </div>
    </div>
    <edit-record-nature ref="editRecordNature"></edit-record-nature>
  </div>
</template>

<script>
  import editRecordNature from './modal/edit-record-nature.vue';

  export default {
    name: "record-expand",
    components: {
      editRecordNature
    },
    props: {
      detail: Object
    },
    data() {
      return {
        initial: new Object(null)
      }
    },
    mounted() {
      this.$Global.timeout(300).then(() => {
        new ToolFunctor(this)._get({...this.detail});
      })
    },
    methods: {
      handleEye() {
        console.log(this.initial)
      },
      handleEdit() {
        this.$refs.editRecordNature.modal.editRecordModal.detail = this.initial;
        this.$refs.editRecordNature.modal.editRecordModal.recordResultId = this.initial.recordResultId;
        this.$refs.editRecordNature.modal.editRecordModal.show = true;
      },
      handleTrash() {
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除？',
          onOk: () => {
            this.$api.recordInterface.removeRecordResult({
              recordResultId: this.initial.recordResultId,
            }).then(res => {
              if (res.data.success) {
                this.$Message.info('成功');
                this.$parent.$parent.$parent._getRecordStateList();
              }
            }).catch(err => {
              console.error(err)
            })
          }
        })
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

      target.radioBoxList = res.radioBoxList ? res.radioBoxList : [];
      target.radioResult = res.radioResult ? res.radioResult : '';
      target.recordGroupList = res.recordGroupList ? (() => {
        let a = [];
        [...res.recordGroupList].forEach(m => {

          if (m.recodGroupType === 1) {
            a.push({
              normalRecordGroupInfoList: (() => {
                let b = [];
                [...m.normalRecordGroupInfoList].forEach(k => {
                  switch (k.normalRecordGroupInfoCfg.recordType) {
                    case 0:
                      b.push({
                        normalRecordGroupInfoCfg: k.normalRecordGroupInfoCfg,
                        normalRecordGroupInfoResult: {
                          radioResult: k.normalRecordGroupInfoResult.radioResult ? k.normalRecordGroupInfoResult.radioResult : ''
                        }
                      });
                      break;
                    case 1:
                      b.push({
                        normalRecordGroupInfoCfg: k.normalRecordGroupInfoCfg,
                        normalRecordGroupInfoResult: {
                          imageResultList: k.normalRecordGroupInfoResult.imageResultList ? k.normalRecordGroupInfoResult.imageResultList : []
                        }
                      });
                      break;
                    case 2:
                      b.push({
                        normalRecordGroupInfoCfg: k.normalRecordGroupInfoCfg,
                        normalRecordGroupInfoResult: {
                          checkBoxResultList: k.normalRecordGroupInfoResult.checkBoxResultList ? k.normalRecordGroupInfoResult.checkBoxResultList : []
                        }
                      });
                      break;
                    case 3:
                      b.push({
                        normalRecordGroupInfoCfg: k.normalRecordGroupInfoCfg,
                        normalRecordGroupInfoResult: {
                          radioResult: k.normalRecordGroupInfoResult.radioResult ? k.normalRecordGroupInfoResult.radioResult : ''
                        }
                      });
                      break;
                    case 4:
                      b.push({
                        normalRecordGroupInfoCfg: k.normalRecordGroupInfoCfg,
                        normalRecordGroupInfoResult: {
                          textareaResult: k.normalRecordGroupInfoResult.textareaResult ? k.normalRecordGroupInfoResult.textareaResult : ''
                        }
                      });
                      break;
                    case 5:
                      b.push({
                        normalRecordGroupInfoCfg: k.normalRecordGroupInfoCfg,
                        normalRecordGroupInfoResult: {
                          dateResult: k.normalRecordGroupInfoResult.dateResult ? k.normalRecordGroupInfoResult.dateResult : ''
                        }
                      });
                      break;
                    case 6:
                      b.push({
                        normalRecordGroupInfoCfg: k.normalRecordGroupInfoCfg,
                        normalRecordGroupInfoResult: {
                          timeResult: k.normalRecordGroupInfoResult.timeResult ? k.normalRecordGroupInfoResult.timeResult : ''
                        }
                      });
                      break;
                    case 7:
                      b.push({
                        normalRecordGroupInfoCfg: k.normalRecordGroupInfoCfg,
                        normalRecordGroupInfoResult: {
                          audioResult: {
                            audioName: k.normalRecordGroupInfoResult.audioResult && k.normalRecordGroupInfoResult.audioResult.audioName ? k.normalRecordGroupInfoResult.audioResult.audioName : ''
                          }
                        }
                      });
                      break;
                    case 8:
                      b.push({
                        normalRecordGroupInfoCfg: k.normalRecordGroupInfoCfg,
                        normalRecordGroupInfoResult: {
                          addressResult: {
                            address: k.normalRecordGroupInfoResult.addressResult && k.normalRecordGroupInfoResult.addressResult.address ? k.normalRecordGroupInfoResult.addressResult.address : '',
                            dimension: k.normalRecordGroupInfoResult.addressResult && k.normalRecordGroupInfoResult.addressResult.dimension ? k.normalRecordGroupInfoResult.addressResult.dimension : '',
                            longitude: k.normalRecordGroupInfoResult.addressResult && k.normalRecordGroupInfoResult.addressResult.longitude ? k.normalRecordGroupInfoResult.addressResult.longitude : ''
                          }
                        }
                      });
                      break;
                  }
                });

                return b;
              })(),
              recordGroupName: m.recordGroupName ? m.recordGroupName : '',
              recodGroupType: m.recodGroupType ? m.recodGroupType : 1,
              sortId: m.recodGroupType ? m.sortId : ''
            })
          } else if (m.recodGroupType === 0) {
            a.push({
              checkRecordGroupInfoList: (() => {
                return m.checkRecordGroupInfoList
              })(),
              recordGroupName: m.recordGroupName ? m.recordGroupName : '',
              recodGroupType: m.recodGroupType ? m.recodGroupType : 0,
              sortId: m.recodGroupType ? m.sortId : ''
            })
          }
        });

        console.log(a)
        return a;
      })() : [];

      target.recordResultId = res.recordResultId ? res.recordResultId : '';
      target.recordSummaryType = res.recordSummaryType ? res.recordSummaryType : 0;
      target.recordTemplateId = res.recordTemplateId ? res.recordTemplateId : '';
      target.templateId = res.templateId ? res.templateId : '';
      target.templateName = res.templateName ? res.templateName : '';


      console.log(target)
      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);
      target.templateFoldId = this.tis.initial.templateFoldId;
      target.templateId = this.tis.initial.templateId;
      target.templateName = this.tis.initial.templateName;
      target.recordResultJson = null;
      target.templateInfoListJson = JSON.stringify(this.tis.initial.templateInfoVO);
      target.templateRecordStateInfoJson = JSON.stringify(this.tis.initial.templateRecordStateVO);

      return target;
    }
  }
</script>
