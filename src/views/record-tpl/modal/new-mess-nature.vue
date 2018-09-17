<style lang="scss">
  @include b(new-mess-modal) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      @include e(top) {
        @include m(title) {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 10px;
        }
      }
      @include e(top-content) {
        padding: 10px;
        background-color: #f2f2f2;
      }
      @include e(middle) {
        @include m(title) {
          font-size: 16px;
          font-weight: 700;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      }
      @include e(middle-content) {
        padding: 10px;
        background-color: #f2f2f2;
        @include b(l-list) {
          padding: 10px;
          @include e(item) {
            margin-bottom: 10px;
            @include m(name) {
              width: 190px;
              input {
                border-bottom-right-radius: 0 !important;
                border-top-right-radius: 0 !important;
                border-right: 0;
              }
            }
            @include m(phone-num) {
              width: 190px;
              input {
                border-bottom-left-radius: 0 !important;
                border-top-left-radius: 0 !important;
              }
            }
          }
        }
      }
    }
  }
</style>

<template>
  <Modal v-model="modal.newMessModal.show" width="550" class="new-mess-modal" @on-ok="saveMess">
    <p slot="header" class="header">
      <span class="header--title">短信提醒</span>
    </p>
    <div class="body">
      <div class="body__top">
        <p class="body__top--title">短信功能</p>
        <div class="body__top-content">
          <RadioGroup v-model="modal.newMessModal.selectState" vertical>
            <Radio :label="item.value" v-for="(item,index) in modal.newMessModal.stateList" :key="index"
                   style="display: inline-block">
              <span>{{item.label}}</span>
            </Radio>
            <Checkbox v-model="modal.newMessModal.selectCheckBox" v-if="modal.newMessModal.selectState === 1">
              有新记录提交时提醒
            </Checkbox>
          </RadioGroup>
        </div>
      </div>
      <div class="body__middle">
        <p class="body__middle--title">提醒人员</p>
        <div class="body__middle-content">
          <ul class="l-list">
            <li class="l-list__item" v-for="(item,index) in modal.newMessModal.reminderList" style="display: flex">
              <Input v-model="item.name" class="l-list__item--name" placeholder="请输入姓名">
              <span slot="prepend">{{index + 1}}</span>
              </Input>
              <Input v-model="item.phoneNum" class="l-list__item--phone-num" placeholder="请输入手机号码">
              <Button slot="append" icon="close" @click.native="deleteRow(index)"></Button>
              </Input>
            </li>
            <Button type="primary" @click="newPhoneNumButton">
              <Icon type="plus-round"></Icon>&nbsp;添加人员
            </Button>
          </ul>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "new-mess-nature",
    data() {
      return {
        modal: {
          newMessModal: {
            show: false,
            recordTemplateId: '',
            selectState: 0,
            selectCheckBox: false,
            stateList: [
              {
                label: '关闭',
                value: 0
              },
              {
                label: '开启',
                value: 1
              }
            ],
            reminderList: [
              {
                name: '',
                phoneNum: ''
              }
            ]
          }
        }
      }
    },
    methods: {
      getShortMsg() {
        this.modal.newMessModal.reminderList = [];
        this.$api.recordTemplateInterface.getShortMsgRemind({
          recordTemplateId: this.modal.newMessModal.recordTemplateId,
        }).then(res => {
          if (res.data.success) {
            this.modal.newMessModal.selectState = res.data.data.shortMageSwitch;
            this.modal.newMessModal.selectCheckBox = (() => {
              let flag = false;
              return res.data.data.remindCondition === this.$Global.bool2Int(false) ? flag : !flag
            })();

            res.data.data.reminderList.forEach(m => {
              this.modal.newMessModal.reminderList.push({
                name: m.name,
                phoneNum: m.phoneNum
              })
            })

          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      saveMess() {
        let shortMsgRemindJson = (() => {
          let obj = {};
          obj.shortMageSwitch = this.modal.newMessModal.selectState;
          obj.remindCondition = (() => {
            let flag;
            flag = this.modal.newMessModal.selectCheckBox ? 1 : 0;
            return flag;
          })();
          obj.shortMsgTemplateId = '93bf1a9dfe4002';
          obj.reminderList = (() => {
            let result;
            result = this.modal.newMessModal.reminderList;
            return result;
          })();
          return obj;
        })();

        this.$api.recordTemplateInterface.updateShortMsgRemind({
          recordTemplateId: this.modal.newMessModal.recordTemplateId,
          shortMsgRemindJson: JSON.stringify(shortMsgRemindJson)
        }).then(res => {
          if (res.data.success) {
            this.$parent.listRecordTemplate({
              recordTemplateCategoryId: this.$parent.tabs.selectTab
            });
          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      deleteRow(index) {
        this.modal.newMessModal.reminderList.splice(index, 1)
      },
      newPhoneNumButton() {
        this.modal.newMessModal.reminderList.push({
          name: '',
          phoneNum: ''
        })
      }
    }
  }
</script>
