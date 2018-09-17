<style lang="scss">
  @include b(new-user-modal) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      @include e(form) {

      }
      @include e(group) {
        @include m(name) {
          font-size: 14px;
          font-weight: 700;
        }
        @include b(l-list) {
          margin-top: 10px;
          padding: 10px;
          background-color: #f2f2f2;
          @include e(item) {
            float: left;
            margin-right: 10px;
            margin-bottom: 10px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <Modal ref="modal" v-model="modal.newUserModal.show" width="550" class="new-user-modal">
    <p slot="header" class="header">
      <span class="header--title"
            v-if="modal.newUserModal.modalType === 0 || modal.newUserModal.modalType === 2">添加员工</span>
      <span class="header--title" v-if="modal.newUserModal.modalType === 1">编辑员工</span>
    </p>
    <div class="body">
      <div class="body__form">
        <Form :model="formData.saveUser" label-position="left">
          <FormItem label="姓名：" :label-width="70">
            <Input v-model="formData.saveUser.authUserName" placeholder="请输入姓名" style="width: 200px"></Input>
            <i class="tip-ico">*</i>
          </FormItem>
          <FormItem label="手机号：" :label-width="70">
            <Input v-model="formData.saveUser.phoneNum" placeholder="请输入" style="width: 200px"></Input>
            <i class="tip-ico">*</i>
          </FormItem>
          <FormItem label="工号：" :label-width="70">
            <Input v-model="formData.saveUser.authWorkNumber" placeholder="请输入" style="width: 200px"></Input>
          </FormItem>
        </Form>
      </div>
      <div class="body__group">
        <p class="body__group--name">所在部门：</p>
        <ul class="l-list clearfix">
          <li class="l-list__item" v-for="(item,index) in modal.newUserModal.groupList">
            <Checkbox v-model="item.selectedGroup">&nbsp;{{item.name}}</Checkbox>
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click.native="cancel">取消</Button>
      <Button type="primary" size="large" @click.native="saveUserModal">确定</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "new-user-nature",
    data() {
      return {
        modal: {
          newUserModal: {
            show: false,
            modalType: 0,
            authUserName: '',
            phoneNum: '',
            department: '',
            groupList: []
          }
        },
        formData: {
          saveUser: {
            authGroupId: '',
            authUserId: '',
            authUserGroupIdListJson: null,
            authGroupIdJson: null,
            authUserName: '',
            authWorkNumber: '',
            phoneNum: '',
            authUserPhone: '',
            authState: '',
            authUserIdListJson: null,
            openId: ''
          },
          saveNewAuthUserApply: {
            authUserApplyId: '',
            authUserName: '',
            authWorkNumber: '',
            phoneNum: '',
            openId: ''
          }
        }
      }
    },
    methods: {
      saveUserModal() {
        let modalType = this.modal.newUserModal.modalType;

        if (this.$Global.isBlank(this.formData.saveUser.authUserName)) return this.$Message.info('请输入姓名');
        const isSelectedGroup = () => {
          let arr = [];
          [...this.modal.newUserModal.groupList].forEach(m => {
            if (m.selectedGroup) arr.push(m.authGroupId)
          });
          return arr;
        };

        if (this.$Global.isBlank(this.formData.saveUser.phoneNum)) {
          return this.$Message.info('请输入手机号');
        } else if (!this.$Global.isPhoneAvailable(this.formData.saveUser.phoneNum)) {
          return this.$Message.info('请输入正确的手机号');
        }

        if (!isSelectedGroup().length) {
          return this.$Message.info('请选择所在人员组')
        }

        switch (modalType) {
          case 0:
            this.formData.saveUser.authGroupId = (() => {
              return this.$parent.formData.list.authGroupId
            })();

            this.formData.saveUser.authUserPhone = (() => {
              return this.formData.saveUser.phoneNum
            })();

            this.formData.saveUser.authUserGroupIdListJson = this.formData.saveUser.authGroupIdJson = (() => {
              let arr = [];
              [].forEach.call(this.modal.newUserModal.groupList, m => {
                if (m.selectedGroup) {
                  arr.push(m.authGroupId)
                }
              });
              return JSON.stringify(arr)
            })();
            this.$api.authUserInterface['saveAuthUser']({...this.formData.saveUser})
              .then(res => {
                if (res.data.success) {
                  this.$Message.info('成功');
                  this.$parent._getAuthUserInfo();
                  this.cancel();
                } else {
                  this.$Message.error(res.data.retMsg)
                }
              }).catch(err => {
              console.error(err)
            });
            break;
          case 1:
            this.formData.saveUser.authGroupId = (() => {
              return this.$parent.formData.list.authGroupId
            })();

            this.formData.saveUser.authUserPhone = (() => {
              return this.formData.saveUser.phoneNum
            })();


            this.formData.saveUser.authUserIdListJson = (() => {
              let arr = [];
              [].forEach.call(this.modal.newUserModal.groupList, m => {
                if (m.selectedGroup) {
                  arr.push(m.authGroupId)
                }
              });
              return JSON.stringify(arr)
            })();

            this.formData.saveUser.authUserGroupIdListJson = this.formData.saveUser.authGroupIdJson = (() => {
              let arr = [];
              [].forEach.call(this.modal.newUserModal.groupList, m => {
                if (m.selectedGroup) {
                  arr.push(m.authGroupId)
                }
              });
              return JSON.stringify(arr)
            })();
            this.$api.authUserInterface['updateAuthInfo']({...this.formData.saveUser})
              .then(res => {
                if (res.data.success) {
                  this.$Message.info('成功');
                  this.$parent._getAuthUserInfo();
                  this.cancel();
                } else {
                  this.$Message.error(res.data.retMsg)
                }
              }).catch(err => {
              console.error(err)
            });
            break;
          case 2:
            console.log(this.formData.saveNewAuthUserApply.authUserApplyId);

            this.$api.authUserInterface['saveNewAuthUserApply']({
              authUserApplyId: this.formData.saveNewAuthUserApply.authUserApplyId,
              authUserGroupIdListJson: (() => {
                let arr = [];
                [].forEach.call(this.modal.newUserModal.groupList, m => {
                  if (m.selectedGroup) {
                    arr.push(m.authGroupId)
                  }
                });
                return JSON.stringify(arr)
              })(),
              authUserName: this.formData.saveUser.authUserName,
              authWorkNumber: this.formData.saveUser.authWorkNumber,
              phoneNum: this.formData.saveUser.phoneNum,
              openId: this.formData.saveUser.openId
            })
              .then(res => {
                if (res.data.success) {
                  this.$Message.info('成功');
                  this.$parent._getApplyList();
                  this.cancel();
                } else {
                  this.$Message.error(res.data.retMsg)
                }
              }).catch(err => {
              console.error(err)
            })
        }
      },
      cancel() {
        this.$refs.modal.cancel()
      }
    }
  }
</script>
