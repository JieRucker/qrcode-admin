<style lang="scss">
  @include b(new-template-modal) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      max-height: 700px;
      overflow: auto;
      @include e(group) {
        margin-bottom: 10px;
        @include m(name) {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        @include m(trash) {
          font-size: 16px;
          float: right;
          margin-top: 12px;
          margin-right: 10px;
          cursor: pointer;
        }
      }

      @include e(group-content) {
        padding: 10px;
        background-color: #f2f2f2;
        @include b(l-list) {
          @include e(item) {
            margin-bottom: 10px;
            .ql-toolbar {
              height: 0;
              padding: 0;
              border-top: 0;
            }
            &:last-child {
              margin-bottom: 0;
            }
            @include m(tip) {
              margin-top: 10px;
              color: #999;
            }
            @include m(icon) {
              font-size: 16px;
              margin-left: 10px;
              cursor: pointer;
            }
          }
        }
      }
      @include e(group-action) {
        @include m(button) {
          margin-right: 10px;
        }
      }
    }
  }
</style>

<template>
  <div>
    <Modal ref="modal" v-model="modal.newTemplateModal.show" width="950" :mask-closable="false"
           class="new-template-modal">
      <p slot="header" class="header">
        <span class="header--title">新建模板</span>
      </p>
      <div class="body">
        <div class="body__form">
          <Form :model="modal.newTemplateModal" label-position="left">
            <FormItem label="模板名称：" :label-width="110">
              <Input v-model="modal.newTemplateModal.templateName" placeholder="请输入" style="width: 200px"></Input>
            </FormItem>
            <FormItem label="备注：" :label-width="110">
              <Input v-model="modal.newTemplateModal.templateDesc" placeholder="请输入" style="width: 200px"></Input>
            </FormItem>
            <FormItem label="维护结果名称：" :label-width="110">
              <Input v-model="modal.newTemplateModal.recordResultName" placeholder="请输入记录总结名称"
                     style="width: 200px"></Input>
              <i class="tip-ico" style="color: #f00">*</i>
            </FormItem>
            <FormItem label="维护结果类型：" :label-width="110">
              <Select v-model="modal.newTemplateModal.selectRecordResultType" placeholder="请选择" style="width:110px">
                <Option v-for="option in modal.newTemplateModal.recordResultTypeList" :value="option.value"
                        :key="option.value">
                  {{option.label}}
                </Option>
              </Select>
              <Button type="ghost" v-if="modal.newTemplateModal.selectRecordResultType === 0"
                      @click="newSingleSelectModal">
                编辑选项
              </Button>
              <Input v-model="modal.newTemplateModal.recordResultDefaultContent" placeholder="请输入记录总结默认内容"
                     v-if="modal.newTemplateModal.selectRecordResultType === 1" style="width: 200px"></Input>
            </FormItem>
          </Form>
        </div>
        <div class="body__section">
          <div class="body__group" v-for="(item,index) in modal.newTemplateModal.recordGroupList">
            <p class="body__group--name">
              <Input v-model="item.recordGroupName" placeholder="请输入分组名称" style="width: 150px"></input>
              <Icon type="trash-a" class="body__group--trash" @click.native="trashRow(index)"></Icon>
            </p>
            <div class="body__group-content">
              <ul class="l-list">
                <li class="l-list__item" v-for="(child,childIndex) in item.normalRecordGroupInfoList"
                    v-if="item.recodGroupType === 1">
                  <Input v-model="child.normalRecordGroupInfoCfg.recordTitle" placeholder="请输入字段标题（必填）"
                         style="width: 300px"></input>
                  <Select v-model="child.normalRecordGroupInfoCfg.recordType" placeholder="请选择" style="width:150px">
                    <Option v-for="option in modal.newTemplateModal.recordTypeList" :value="option.value"
                            :key="option.value">
                      {{option.label}}
                    </Option>
                  </Select>
                  <Input v-model="child.normalRecordGroupInfoCfg.recordDesc" placeholder="字段备注" style="width: 150px"
                         v-if="child.normalRecordGroupInfoCfg.recordType === 0"></input>
                  <Button v-if="child.normalRecordGroupInfoCfg.recordType === 1" style="width: 150px"
                          @click.native="showPicModal(index,childIndex)">编辑选项
                  </Button>
                  <Button v-if="child.normalRecordGroupInfoCfg.recordType === 2" style="width: 150px"
                          @click.native="showCheckboxModal(index,childIndex)">编辑选项
                  </Button>
                  <Button v-if="child.normalRecordGroupInfoCfg.recordType === 3" style="width: 150px"
                          @click.native="showRadioModal(index,childIndex)">编辑选项
                  </Button>
                  <Input v-model="child.normalRecordGroupInfoCfg.recordDesc" placeholder="字段备注" style="width: 150px"
                         v-if="child.normalRecordGroupInfoCfg.recordType === 4"></input>
                  <Input v-model="child.normalRecordGroupInfoCfg.recordDesc" placeholder="字段备注" style="width: 150px"
                         v-if="child.normalRecordGroupInfoCfg.recordType === 5" disabled></input>
                  <Input v-model="child.normalRecordGroupInfoCfg.recordDesc" placeholder="字段备注" style="width: 150px"
                         v-if="child.normalRecordGroupInfoCfg.recordType === 6" disabled></input>
                  <Input v-model="child.normalRecordGroupInfoCfg.recordDesc" placeholder="字段备注" style="width: 150px"
                         v-if="child.normalRecordGroupInfoCfg.recordType === 7" disabled></input>
                  <Input v-model="child.normalRecordGroupInfoCfg.recordDesc" placeholder="字段备注" style="width: 150px"
                         v-if="child.normalRecordGroupInfoCfg.recordType === 8" disabled></input>

                  <Checkbox v-model="child.normalRecordGroupInfoCfg.nullable">必填</Checkbox>
                  <Icon type="arrow-up-c" class="l-list__item--icon l-list__item--arrowup"
                        @click.native="sortChange('normal','up',index,childIndex)"></Icon>
                  <Icon type="arrow-down-c" class="l-list__item--icon l-list__item--arrowdown"
                        @click.native="sortChange('normal','down',index,childIndex)"></Icon>
                  <Icon type="trash-a" class="l-list__item--icon l-list__item--trash"
                        @click.native="trashNoraml(index,childIndex)"></Icon>
                </li>
                <li class="l-list__item" v-for="(child,childIndex) in item.checkRecordGroupInfoList"
                    v-if="item.recodGroupType === 2">
                  <Input v-model="child.checkRecordGroupInfoCfg.value" placeholder="请输入字段标题（必填）"
                         style="width: 300px"></input>
                  <Icon type="arrow-up-c" class="l-list__item--icon l-list__item--arrowup"
                        @click.native="sortChange('check','up',index,childIndex)"></Icon>
                  <Icon type="arrow-down-c" class="l-list__item--icon l-list__item--arrowdown"
                        @click.native="sortChange('check','down',index,childIndex)"></Icon>
                  <Icon type="trash-a" class="l-list__item--icon l-list__item--trash"
                        @click.native="trashCheck(index,childIndex)"></Icon>
                </li>
                <li class="l-list__item" v-if="item.recodGroupType === 1">
                  <Button @click="newNormalAdd(index)">新增字段</Button>
                </li>
                <li class="l-list__item" v-if="item.recodGroupType === 2">
                  <Button @click="newCheckAdd(index)">新增字段</Button>
                </li>
              </ul>
            </div>
          </div>
          <div class="body__group-action">
            <Button type="ghost" class="body__group-action--button" @click="newGroupAdd">添加单项分组</Button>
            <Button type="ghost" class="body__group-action--button" @click="newCheckGroupAdd">添加多项分组</Button>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click.native="cancel">取消</Button>
        <Button type="primary" size="large" @click.native="saveTemplate">确定</Button>
      </div>
    </Modal>
    <new-single-select-nature ref="newSingleSelectNature"></new-single-select-nature>
    <pic-select-nature ref="picSelectNature"></pic-select-nature>
  </div>
</template>

<script>
  import 'quill/dist/quill.snow.css';
  import {quillEditor} from 'vue-quill-editor';
  import newSingleSelectNature from "./new-single-select-nature";
  import picSelectNature from "./pic-select-nature";

  export default {
    name: "new-template-nature",
    components: {
      quillEditor,
      newSingleSelectNature,
      picSelectNature
    },
    data() {
      return {
        modal: {
          newTemplateModal: {
            show: false,
            modalType: 0,//0 保存；1：更新
            recordTemplateId: '',//模板Id
            categoryId: '',//选中Tab Id
            checkCycle: 0,//巡检周期 0每日巡检 1每周巡检 2每月巡检
            shortMsgRemindVO: null, //短信提醒
            templateName: '模板名称',//模板名称
            templateDesc: '备注',//模板描述
            recordResultName: '',//记录总结名称
            recordResultDefaultContent: '',//记录总结默认内容
            selectRecordResultType: 0,//选中的记录总结类型值
            recordTypeList: [
              {
                label: '文本',
                value: 0
              },
              {
                label: '图片',
                value: 1
              },
              {
                label: '多项选择',
                value: 2
              },
              {
                label: '单项选择',
                value: 3
              },
              {
                label: '多行文本框',
                value: 4
              },
              {
                label: '日期',
                value: 5
              },
              {
                label: '时间',
                value: 6
              },
              {
                label: '录音',
                value: 7
              },
              {
                label: '位置定位',
                value: 8
              }
            ],
            recordResultTypeList: [ //记录总结类型Array
              {
                label: '单项选择',
                value: 0
              },
              {
                label: '文本输入',
                value: 1
              }
            ],
            radioBoxList: [],
            recordGroupList: [
              {
                recordGroupName: '分组名称',
                recodGroupType: 1,//1.一般分组 2.检查项分组
                sortId: 0,
                normalRecordGroupInfoList: [
                  {
                    "normalRecordGroupInfoCfg": {
                      "nullable": false,// 必填 0否 1是 通用
                      "recordDesc": "文本备注",// 字段备注 recordType为文本,多行文本框使用
                      "recordTitle": "文本标题",// 字段标题 通用
                      "recordType": 0,// 0文本 1图片 2多项选择 3单项选择 4多行文本框 5日期 6时间 7录音 8位置定位[注:一个维护模板只能选择一个位置定位]
                      "sortId": 1
                    }
                  }
                ]
              },
              {
                recordGroupName: '分组名称',
                recodGroupType: 2,
                sortId: 2,
                checkRecordGroupInfoList: [
                  {
                    "checkRecordGroupInfoCfg": {
                      "sortId": 0,
                      "value": "检查分组一"
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    },
    methods: {
      getToJsonConfig(options) {
        let jsonManager;

        class JsonManager {
          constructor(config) {
            for (let key in this.constructor.prototype) {
              this[key] = this[key].bind(this);
            }

            this.config = config;
            this.templateConfig = {};
            this.checkCycle = typeof(config.checkCycle) === 'undefined' ? '' : config.checkCycle;
            this.recordSumaryTitle = typeof(config.recordResultName) === 'undefined' ? '' : config.recordResultName;
            this.recordGroupList = typeof(config.recordGroupList) === 'undefined' ? [] : config.recordGroupList;
            this.recordSummaryType = typeof(config.selectRecordResultType) === 'undefined' ? 0 : config.selectRecordResultType;
            this.recordTemplateCategoryId = typeof(config.categoryId) === 'undefined' ? '' : config.categoryId;
            this.recordTemplateDesc = typeof(config.templateDesc) === 'undefined' ? '' : config.templateDesc;
            this.recordTemplateName = typeof(config.templateName) === 'undefined' ? '' : config.templateName;
            this.shortMsgRemindVO = typeof(config.shortMsgRemindVO) === 'undefined' ? null : config.shortMsgRemindVO;

            this.updateSummaryType();
          }

          toObject() {
            this.templateConfig['checkCycle'] = this.checkCycle;
            this.templateConfig['recordSumaryTitle'] = this.recordSumaryTitle;
            this.templateConfig['recordGroupList'] = this.recordGroupList;
            this.templateConfig['recordSummaryType'] = this.recordSummaryType;
            this.templateConfig['recordTemplateCategoryId'] = this.recordTemplateCategoryId;
            this.templateConfig['recordTemplateDesc'] = this.recordTemplateDesc;
            this.templateConfig['recordTemplateName'] = this.recordTemplateName;
            this.templateConfig['shortMsgRemindVO'] = this.shortMsgRemindVO;

            return this.templateConfig;
          }

          toJSON() {
            return JSON.stringify(this.toObject());
          }

          updateSummaryType() {
            switch (this.recordSummaryType) {
              case 0:
                this.templateConfig.radioBoxList = this.config.radioBoxList;
                break;
              case 1:
                this.templateConfig.recordSummaryTypeTextDefaultContent = this.config.recordResultDefaultContent;
                break;
            }
          }
        }

        jsonManager = new JsonManager(options);

        return jsonManager.toJSON();
      },
      saveTemplate() {

        let httpUrl = null;
        let options = null;

        if (this.$Global.isBlank(this.modal.newTemplateModal.recordResultName)) {
          return this.$Message.info('记录结果名称不能为空')
        }

        if (this.modal.newTemplateModal.modalType === 0) {
          httpUrl = 'saveRecordTemplate';
          options = {
            checkCycle: this.modal.newTemplateModal.checkCycle,
            recordResultName: this.modal.newTemplateModal.recordResultName,
            selectRecordResultType: this.modal.newTemplateModal.selectRecordResultType,
            categoryId: this.modal.newTemplateModal.categoryId,
            templateDesc: this.modal.newTemplateModal.templateDesc,
            templateName: this.modal.newTemplateModal.templateName,
            radioBoxList: this.modal.newTemplateModal.radioBoxList,
            recordGroupList: this.modal.newTemplateModal.recordGroupList,
            recordResultDefaultContent: this.modal.newTemplateModal.recordResultDefaultContent,
            shortMsgRemindVO: null
          };
        } else {
          httpUrl = 'updateRecordTemplate';
          options = {
            checkCycle: this.modal.newTemplateModal.checkCycle,
            recordResultName: this.modal.newTemplateModal.recordResultName,
            selectRecordResultType: this.modal.newTemplateModal.selectRecordResultType,
            categoryId: this.modal.newTemplateModal.categoryId,
            templateDesc: this.modal.newTemplateModal.templateDesc,
            templateName: this.modal.newTemplateModal.templateName,
            radioBoxList: this.modal.newTemplateModal.radioBoxList,
            recordGroupList: this.modal.newTemplateModal.recordGroupList,
            recordResultDefaultContent: this.modal.newTemplateModal.recordResultDefaultContent,
            shortMsgRemindVO: this.modal.newTemplateModal.shortMsgRemindVO
          };
        }

        this.$api.recordTemplateInterface[`${httpUrl}`]({
          recordTemplateId: this.modal.newTemplateModal.recordTemplateId,
          recordTemplateName: options.templateName,
          recordTemplateDesc: options.templateDesc,
          recordSummaryTitle: options.recordResultName,
          recordSummaryType: options.selectRecordResultType,
          recordTemplateCategoryId: options.categoryId,
          recordTemplateJson: this.getToJsonConfig(options)
        }).then(res => {
          if (res.data.success) {
            this.$Message.info('保存成功')
            this.$parent.listRecordTemplate({
              recordTemplateCategoryId: this.$parent.tabs.selectTab
            });
            this.cancel();
          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      newSingleSelectModal() {
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.selectList = [];
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.selectList = this.modal.newTemplateModal.radioBoxList.length ? this.modal.newTemplateModal.radioBoxList : (() => {
          return [
           /* {
              defaultSelected: true,
              sortId: 0,
              value: "是"
            },
            {
              defaultSelected: false,
              sortId: 1,
              value: "否"
            }*/
          ]
        })();
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.selectType = 2;
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.show = true;
      },
      newNormalAdd(index) {
        this.modal.newTemplateModal.recordGroupList[index].normalRecordGroupInfoList.push({
          "normalRecordGroupInfoCfg": {
            "nullable": 0,// 必填 0否 1是 通用
            "recordDesc": "",// 字段备注 recordType为文本,多行文本框使用
            "recordTitle": "",// 字段标题 通用
            "recordType": 0,// 0文本 1图片 2多项选择 3单项选择 4多行文本框 5日期 6时间 7录音 8位置定位[注:一个维护模板只能选择一个位置定位]
            "recordTypeList": [
              {
                label: '文本',
                value: 0
              },
              {
                label: '图片',
                value: 1
              },
              {
                label: '多项选择',
                value: 2
              },
              {
                label: '单项选择',
                value: 3
              },
              {
                label: '多行文本框',
                value: 4
              },
              {
                label: '日期',
                value: 5
              },
              {
                label: '时间',
                value: 6
              },
              {
                label: '录音',
                value: 7
              },
              {
                label: '位置定位',
                value: 8
              }
            ],
            "sortId": this.modal.newTemplateModal.recordGroupList[index].normalRecordGroupInfoList.length
          }
        })
      },
      newCheckAdd(index) {
        this.modal.newTemplateModal.recordGroupList[index].checkRecordGroupInfoList.push({
          "checkRecordGroupInfoCfg": {
            value: '',
            "sortId": this.modal.newTemplateModal.recordGroupList[index].checkRecordGroupInfoList.length
          }
        })
      },
      newGroupAdd() {
        this.modal.newTemplateModal.recordGroupList.push({
          recordGroupName: '分组名称',
          recodGroupType: 1,//1.一般分组 2.检查项分组
          sortId: this.modal.newTemplateModal.recordGroupList.length,
          normalRecordGroupInfoList: [
            {
              "normalRecordGroupInfoCfg": {
                "nullable": 0,// 必填 0否 1是 通用
                "recordDesc": "文本备注",// 字段备注 recordType为文本,多行文本框使用
                "recordTitle": "文本标题",// 字段标题 通用
                "recordType": 0,// 0文本 1图片 2多项选择 3单项选择 4多行文本框 5日期 6时间 7录音 8位置定位[注:一个维护模板只能选择一个位置定位]
                "recordTypeList": [
                  {
                    label: '文本',
                    value: 0
                  },
                  {
                    label: '图片',
                    value: 1
                  },
                  {
                    label: '多项选择',
                    value: 2
                  },
                  {
                    label: '单项选择',
                    value: 3
                  },
                  {
                    label: '多行文本框',
                    value: 4
                  },
                  {
                    label: '日期',
                    value: 5
                  },
                  {
                    label: '时间',
                    value: 6
                  },
                  {
                    label: '录音',
                    value: 7
                  },
                  {
                    label: '位置定位',
                    value: 8
                  }
                ],
                "sortId": 0
              }
            }
          ]
        })
      },
      newCheckGroupAdd() {
        this.modal.newTemplateModal.recordGroupList.push({
          recordGroupName: '分组名称',
          recodGroupType: 2,
          sortId: this.modal.newTemplateModal.recordGroupList.length,
          checkRecordGroupInfoList: [
            {
              "checkRecordGroupInfoCfg": {
                "sortId": 0,
                "value": ""
              }
            }
          ]
        })
      },
      trashRow(index) {
        this.modal.newTemplateModal.recordGroupList.splice(index, 1);
      },
      showCheckboxModal(index, childIndex) {
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.selectList = [];
        let checkBoxList = this.modal.newTemplateModal.recordGroupList[index].normalRecordGroupInfoList[childIndex].normalRecordGroupInfoCfg.checkBoxList;
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.selectType = 0;
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.selectList = checkBoxList ? checkBoxList : (() => {
          return [
            /*{
              defaultSelected: false,
              sortId: 0,
              value: ""
            },
            {
              defaultSelected: false,
              sortId: 1,
              value: ""
            }*/
          ]
        })();
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.index = index;
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.childIndex = childIndex;
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.show = true;
      },
      showRadioModal(index, childIndex) {
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.selectList = [];
        let radioBoxList = this.modal.newTemplateModal.recordGroupList[index].normalRecordGroupInfoList[childIndex].normalRecordGroupInfoCfg.radioBoxList;
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.selectType = 1;
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.selectList = radioBoxList ? radioBoxList : (() => {
          return [
            /*{
              defaultSelected: true,
              sortId: 0,
              value: "是"
            },
            {
              defaultSelected: false,
              sortId: 1,
              value: "否"
            }*/
          ]
        })();
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.index = index;
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.childIndex = childIndex;
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.show = true;

        console.log(this.$refs.newSingleSelectNature.modal.newSingleSelectModal)
      },
      showPicModal(index, childIndex) {
        this.$refs.picSelectNature.modal.picSelectModal.imageCfg = {};
        let imageCfg = this.modal.newTemplateModal.recordGroupList[index].normalRecordGroupInfoList[childIndex].normalRecordGroupInfoCfg.imageCfg;
        this.$refs.picSelectNature.modal.picSelectModal.imageCfg = imageCfg ? imageCfg : (() => {
          return {
            uploadType: 0,
            waterMark: []
          }
        })();

        this.$refs.picSelectNature.recover();
        this.$refs.picSelectNature.modal.picSelectModal.index = index;
        this.$refs.picSelectNature.modal.picSelectModal.childIndex = childIndex;
        this.$refs.picSelectNature.modal.picSelectModal.show = true;
      },
      setResultCfg(type, config) {
        switch (type) {
          case 'radio':
            this.modal.newTemplateModal.radioBoxList = config;
            break;
        }
      },
      setCfg(type, config, index, childIndex) {
        switch (type) {
          case 'pic':
            this.modal.newTemplateModal.recordGroupList[index].normalRecordGroupInfoList[childIndex].normalRecordGroupInfoCfg.imageCfg = config;
            break;
          case 'checkbox':
            this.modal.newTemplateModal.recordGroupList[index].normalRecordGroupInfoList[childIndex].normalRecordGroupInfoCfg.checkBoxList = config;
            break;
          case 'radio':
            this.modal.newTemplateModal.recordGroupList[index].normalRecordGroupInfoList[childIndex].normalRecordGroupInfoCfg.radioBoxList = config;
            break;
        }

      },
      trashNoraml(index, childIndex) {
        this.modal.newTemplateModal.recordGroupList[index].normalRecordGroupInfoList.splice(childIndex, 1);
      },
      trashCheck(index, childIndex) {
        this.modal.newTemplateModal.recordGroupList[index].checkRecordGroupInfoList.splice(childIndex, 1)
      },
      // 排序
      sortChange(type, sortType, index, childIndex) {
        // arr数组，index当前元素下标，endIndex拖动到的位置下标
        const sort = (() => {
          return (arr, index, endIndex) => {
            if (index > endIndex) {
              arr.splice(endIndex, 0, arr[index]);
              arr.splice(index + 1, 1);
            } else {
              arr.splice(endIndex + 1, 0, arr[index]);
              arr.splice(index, 1);
            }
          }
        })();

        const formatSort = (() => {
          return (list) => {
            for (let i = 0, len = list.length; i < len; i++) {
              list[i][type === 'normal' ? 'normalRecordGroupInfoCfg' : 'checkRecordGroupInfoCfg'].sortId = i;
            }
          }
        })();

        switch (sortType) {
          case 'up':
            let list = type === 'normal' ? this.modal.newTemplateModal.recordGroupList[index].normalRecordGroupInfoList : this.modal.newTemplateModal.recordGroupList[index].checkRecordGroupInfoList;
            sort(list, childIndex, childIndex === 0 ? list.length - 1 : childIndex - 1);
            formatSort(list);
            break;
          case 'down':
            let list1 = type === 'normal' ? this.modal.newTemplateModal.recordGroupList[index].normalRecordGroupInfoList : this.modal.newTemplateModal.recordGroupList[index].checkRecordGroupInfoList;
            sort(list1, childIndex, childIndex === list1.length - 1 ? 0 : childIndex + 1);
            formatSort(list1);
            break;
        }
      },
      cancel() {
        this.$refs.modal.cancel()
      }
    }
  }
</script>
