<style lang="scss">
  @include b(edit-record-modal) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      max-height: 600px;
      overflow: auto;
      @include b(record-expand) {
        @include e(section) {
          @include b(table) {
            margin-bottom: 10px;
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
    }
  }
</style>

<template>
  <Modal v-model="modal.editRecordModal.show" width="900" class="edit-record-modal" @on-ok="saveEditRecordModal">
    <p slot="header" class="header">
      <span class="header--title">编辑记录</span>
    </p>
    <div class="body">
      <div class="record-expand">
        <div class="record-expand__section" v-for="(item,index) in modal.editRecordModal.detail.recordGroupList">
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
                      <Input v-model="child.normalRecordGroupInfoResult.textResult" style="width: 200px"></Input>
                    </div>
                    <div v-if="child.normalRecordGroupInfoCfg.recordType === 1">
                      <ul class="image-list">
                        <li class="image-list__item"
                            v-for="(img,imgIndex) in child.normalRecordGroupInfoResult.imageResultList">
                          <img :src="img.imageUrl">
                        </li>
                      </ul>
                    </div>
                    <div v-if="child.normalRecordGroupInfoCfg.recordType === 2">
                      <ul class="checkbox-list">
                        <li class="checkbox-list__item"
                            v-for="(checkbox,checkboxIndex) in child.normalRecordGroupInfoCfg.checkBoxList"
                            style="margin-right: 5px;display: inline-block">
                          <Checkbox v-model="checkbox.defaultSelected">{{checkbox.value}}</Checkbox>
                        </li>
                      </ul>
                    </div>
                    <div v-if="child.normalRecordGroupInfoCfg.recordType === 3">
                      <ul class="radiobox-list">
                        <li class="radiobox-list__item"
                            v-for="(radiobox,radioIndex) in child.normalRecordGroupInfoCfg.radioBoxList"
                            style="margin-right: 5px;display: inline-block">
                          <Radio v-model="radiobox.defaultSelected"
                                 @on-change="changeRadioBox(child.normalRecordGroupInfoCfg.radioBoxList,radiobox)">
                            {{radiobox.value}}
                          </Radio>
                        </li>
                      </ul>
                      <!--<Select v-model="modal.editRecordModal.selectRadioBox" placeholder="请选择" style="width:150px" @on-change="changeRadioBox(child.normalRecordGroupInfoCfg)">
                        <Option v-for="(radiobox,radioboxIndex) in child.normalRecordGroupInfoCfg.radioBoxList"
                                :value="radiobox.defaultSelected" :key="radiobox.defaultSelected">
                          {{radiobox.value}}
                        </Option>
                      </Select>-->
                    </div>
                    <div v-if="child.normalRecordGroupInfoCfg.recordType === 4">
                      <Input type="textarea" :rows="3" v-model="child.normalRecordGroupInfoResult.textareaResult"
                             style="width: 200px"></Input>
                    </div>
                    <div v-if="child.normalRecordGroupInfoCfg.recordType === 5">
                      <DatePicker type="date" placeholder="选择日期" v-model="child.normalRecordGroupInfoResult.dateResult"
                                  style="width: 200px"></DatePicker>
                    </div>
                    <div v-if="child.normalRecordGroupInfoCfg.recordType === 6">
                      {{child.normalRecordGroupInfoResult.timeResult}}
                    </div>
                    <div v-if="child.normalRecordGroupInfoCfg.recordType === 7">
                      {{child.normalRecordGroupInfoResult.audioResult.audioName}}
                    </div>
                    <div v-if="child.normalRecordGroupInfoCfg.recordType === 8">
                      <Icon type="location"
                            v-if="child.normalRecordGroupInfoResult.addressResult && child.normalRecordGroupInfoResult.addressResult.address"></Icon>
                      {{child.normalRecordGroupInfoResult.addressResult.address}}
                      {{child.normalRecordGroupInfoResult.addressResult.dimension}}
                      {{child.normalRecordGroupInfoResult.addressResult.longitude}}
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
                    <span v-if="child.checkRecordGroupInfoResult.itemResult === 0">否</span>
                    <span v-if="child.checkRecordGroupInfoResult.itemResult === 1">是</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!--<div class="record-expand__footer">
          <div class="record-expand__icon">
            <Button type="primary">保存</Button>
          </div>
        </div>-->
        <!--<edit-record-nature ref="editRecordNature"></edit-record-nature>-->
      </div>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "edit-record-nature",
    data() {
      return {
        modal: {
          editRecordModal: {
            show: false,
            recordResultId: '',

            selectRadioBox: '',
            detail: {}
          }
        }
      }
    },
    methods: {
      changeRadioBox(list, radiobox) {
        [...list].forEach(m => {
          m.defaultSelected = false
        });
        radiobox.defaultSelected = true;
      },
      saveEditRecordModal() {
        this.$api.recordInterface.updateRecordResult({
          recordResultId: this.modal.editRecordModal.recordResultId,
          recordResultJson: JSON.stringify(this.modal.editRecordModal.detail)
        }).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
            this.$parent.$parent.$parent.$parent._getRecordStateList();
          } else {
            this.$Message.info(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      }
    }
  }
</script>
