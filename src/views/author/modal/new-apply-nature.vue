<style lang="scss">
  @include b(new-apply-modal) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      @include e(left) {
        @include m(desc) {
          color: #999;
          padding: 5px 10px;
        }
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
      @include e(right) {
        @include m(desc) {
          color: #999;
          padding: 5px 10px;
        }
        @include m(img) {
          height: 250px;
          border: 1px solid #e9eaec;
        }
        @include m(button) {
          width: 250px;
        }
      }
    }
  }
</style>

<template>
  <Modal v-model="modal.newApplyModal.show" width="550" class="new-apply-modal" @on-ok="_saveApplyModal">
    <p slot="header" class="header">
      <span class="header--title">自主申请</span>
    </p>
    <div class="body">
      <Tabs :animated="false" :value="modal.newApplyModal.tabs.selectValue" @on-click="changePanelTab">
        <TabPane label="添加协助员" name="name1" class="body__left">
          <p class="body__left--desc">添加更多的审核员，可以协助你处理申请信息。配置后协助员将收到申请短信，按照短信内容进行授权操作。</p>
          <ul class="l-list">
            <li class="l-list__item" v-for="(item,index) in modal.newApplyModal.applyList" style="display: flex">
              <Input v-model="item.auditorName" class="l-list__item--name" placeholder="请输入姓名">
              <span slot="prepend">{{index + 1}}</span>
              </Input>
              <Input v-model="item.phoneNum" class="l-list__item--phone-num" placeholder="请输入手机号码">
              <Button slot="append" icon="close" @click.native="deleteRow(index)"></Button>
              </Input>
            </li>
            <Button type="primary" @click="newCheckButton">
              <Icon type="plus-round"></Icon>&nbsp;添加人员
            </Button>
          </ul>
        </TabPane>
        <TabPane label="邀请加入" name="name2" class="body__right">
          <p class="body__right--desc">将此二维码分享出去，允许别人向你申请加入维护组，你只需在列表中通过即可。</p>
          <div style="text-align: center">
            <img class="body__right--img" :src="modal.newApplyModal.tabs.qrcodeImg" alt="">
          </div>
          <!--<div style="text-align: center;margin-top: 10px">
            <Button type="primary" @click="qrcodeDownload" class="body__right&#45;&#45;button">下载</Button>
          </div>-->
        </TabPane>
      </Tabs>
    </div>
  </Modal>
</template>

<script>
  import QRCode from 'qrcode';

  export default {
    name: "new-apply-nature",
    components: {
      QRCode
    },
    data() {
      return {
        modal: {
          newApplyModal: {
            show: false,
            tabs: {
              selectValue: 'name1',
              tempQrcodeImg: '',
              qrcodeImg: ''
            },
            applyList: [
              {
                auditorName: '',
                phoneNum: '',
                shortMsgAuditorId: ''
              }
            ]
          }
        }
      }
    },
    methods: {
      _getShortMsgAuditor() {
        this.$api.authUserInterface.listShortMsgAuditor()
          .then(res => {
            if (res.data.success) {
              this.modal.newApplyModal.applyList = res.data.data;
            } else {
              this.$Message.error(res.data.retMsg)
            }
          }).catch(err => console.error(err));
      },
      _saveApplyModal() {
        let type = this.modal.newApplyModal.tabs.selectValue;
        switch (type) {
          case 'name1':
            let authUserGroupIdListJson = (() => {
              return JSON.stringify(this.modal.newApplyModal.applyList)
            })();

            this.$api.authUserInterface.saveShortMsgAuditor({authUserGroupIdListJson: authUserGroupIdListJson})
              .then(res => {
                if (res.data.success) {
                  this.$Message.info('成功');
                  this.$parent._getApplyList();
                } else {
                  this.$Message.error(res.data.retMsg)
                }
              }).catch(err => console.error(err));
            break;
        }
      },
      /*  _getQrcode() {
          this.$api.authUserInterface.makeQrcodeUserApply()
            .then(res => {
              if (res.data.success) {
                QRCode.toDataURL(res.data.data)
                  .then(url => {
                    this.modal.newApplyModal.tabs.qrcodeImg = url;
                  })
                  .catch(err => console.error(err))
              } else {
                this.$Message.error(res.data.retMsg)
              }
            }).catch(err => console.error(err))
        },*/
      deleteRow(index) {
        this.modal.newApplyModal.applyList.splice(index, 1)
      },
      newCheckButton() {
        this.modal.newApplyModal.applyList.push({
          auditorName: '',
          phoneNum: ''
        })
      },
      qrcodeDownload() {

      },
      changePanelTab(value) {
        switch (value) {
          case 'name1':
            break;
          case 'name2':
            QRCode.toDataURL(this.modal.newApplyModal.tabs.tempQrcodeImg)
              .then(url => {
                this.modal.newApplyModal.tabs.qrcodeImg = url;
              })
              .catch(err => console.error(err));
            break;
        }
      }
    }
  }
</script>
