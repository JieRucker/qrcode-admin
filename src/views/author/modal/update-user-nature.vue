<style lang="scss">
  @include b(update-user-modal) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      @include e(search) {
        margin-bottom: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>

<template>
  <Modal v-model="modal.updateUserModal.show" width="550" class="update-user-modal" @on-ok="_saveUpdateUserModal">
    <p slot="header" class="header">
      <span class="header--title">用户列表</span>
    </p>
    <div class="body">
      <div class="body__search">
        <Input v-model="formData.list.searchKey" style="width: 200px" placeholder="请输入">
        <Button slot="append" icon="ios-search" @click.native="handleSearch"></Button>
        </Input>
      </div>
      <Table ref="updateUserTable" :columns="modal.updateUserModal.table.header"
             :data="modal.updateUserModal.table.body"></Table>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "update-user-nature",
    data() {
      return {
        modal: {
          updateUserModal: {
            show: false,
            table: {
              header: [
                {
                  title: '姓名',
                  key: 'authUserName'
                },
                {
                  title: '手机号',
                  key: 'phoneNum'
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (h, params) => {
                    return h('div', [
                      h('Radio', {
                        props: {
                          value: params.row.selected,
                        },
                        nativeOn: {
                          click: () => {
                            let body = this.modal.updateUserModal.table.body;
                            [].forEach.call(body, m => {
                              m.selected = false;
                            });

                            body[`${params.index}`].selected = true;
                          }
                        }
                      }, params.row.authState === 0 ? '绑定' : '更新绑定'),
                    ]);
                  }
                }
              ],
              body: [],
              args: {
                start: 0,
                length: 15,
                currentPage: 1,
                totalCount: 0
              }
            },
          }
        },
        formData: {
          list: {
            authGroupId: '',
            searchKey: '',
            authState: 1
          },
          update: {
            authState: 1,
            authUserApplyId: '',
            authUserName: '',
            phoneNum: '',
            registerDesc: '',
            openId: ''
          }
        }
      }
    },
    methods: {
      handleSearch() {
        this._getAuthUserInfo();
      },
      _getAuthUserInfo() {
        this.$api.authUserInterface.getAuthUserInfo({...this.formData.list})
          .then(res => {
            res = res.data;
            if (res.success) {
              res.data.authUserVOList.forEach(m => m.selected = false);
              this.modal.updateUserModal.table.body = res.data.authUserVOList;
            }
          }).catch(err => {
          console.error(err)
        });
      },
      _saveUpdateUserModal() {
        let vertify = (() => {
          let body = this.modal.updateUserModal.table.body;
          let flag = false;
          let filterObj = null;

          return (cb) => {
            [].forEach.call(body, m => {
              if (m.selected) {
                flag = true;
                filterObj = m;
              }
            });

            cb && cb.call(null, filterObj);
            return flag;
          }
        })();

        if (vertify()) {
          vertify((filterObj) => {
            this.$api.authUserInterface.updateAuthUserApply({
              authState: 1,
              authUserApplyId: this.formData.update.authUserApplyId,
              authUserId: filterObj.authUserId,
              authUserName: this.formData.update.authUserName,
              phoneNum: this.formData.update.phoneNum,
              /*authUserName: filterObj.authUserName,
              phoneNum: filterObj.phoneNum,*/
              authWorkDept: filterObj.authWorkDept,
              registerDesc: this.formData.update.registerDesc,
              openId: this.formData.update.openId,
            })
              .then(res => {
                res = res.data;
                if (res.success) {
                  this.$Message.info('成功');
                  this.$parent._getApplyList();
                } else {
                  this.$Message.error(res.retMsg)
                }
              }).catch(err => {
              console.error(err)
            });
          })
        } else {
          this.$Message.info('请选择')
        }
      }
    }
  }
</script>
