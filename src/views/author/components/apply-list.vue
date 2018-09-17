<style lang="scss">
  @import "../styles/apply-list.scss";
</style>

<template>
  <div class="apply-list">
    <div class="main">
      <div class="main__header clearfix">
        <div class="main__action">
          <Tooltip content="绑定微信的用户，可以扫描巡检码记录" placement="left">
            <Icon type="help-circled" style="margin-right: 10px"></Icon>
          </Tooltip>
          <Button class="main__action--button" @click="showApplyModal">自主申请
          </Button>
        </div>
      </div>
      <div class="main__section clearfix">
        <div class="table">
          <Table :columns="table.header" :data="table.body"></Table>
          <!--<div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="table.args.totalCount"
                    :current="table.args.currentPage"
                    :page-size="table.args.length"
                    show-total @on-change="changeApplyPage"></Page>
            </div>
          </div>-->
        </div>
      </div>
    </div>

    <new-apply-nature ref="newApplyNature"></new-apply-nature>
    <update-user-nature ref="updateUserNature"></update-user-nature>
    <new-user-nature ref="newUserNature"></new-user-nature>
  </div>
</template>

<script>
  import newApplyNature from "../modal/new-apply-nature";
  import updateUserNature from "../modal/update-user-nature";
  import newUserNature from "../modal/new-user-nature.vue";

  export default {
    name: "apply-list",
    components: {
      newApplyNature,
      updateUserNature,
      newUserNature
    },
    data() {
      return {
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
              title: '申请时间',
              key: 'registerDate'
            },
            {
              title: '申请来源',
              key: 'registerSource',
              render: (h, params) => {
                return h('Span', params.row.registerSource === 0 ? '微信' : '')
              }
            },
            {
              title: '申请说明',
              key: 'registerDesc'
            },
            {
              title: '操作',
              key: 'action',
              width: 280,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.$refs.updateUserNature._getAuthUserInfo();
                        let data = ['authUserApplyId', 'authUserName', 'phoneNum', 'registerDesc','openId'];
                        [].forEach.call(data, m => {
                          this.$refs.updateUserNature.formData.update[m] = params.row[m];
                        });

                        this.$refs.updateUserNature.modal.updateUserModal.show = true;
                      }
                    }
                  }, '绑定已有账号'),
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.$refs.newUserNature.modal.newUserModal.modalType = 2;
                        this.$refs.newUserNature.formData.saveNewAuthUserApply.authUserApplyId = params.row.authUserApplyId;
                        this.$refs.newUserNature.formData.saveUser.authUserName = params.row.authUserName;
                        this.$refs.newUserNature.formData.saveUser.phoneNum = params.row.phoneNum;
                        this.$refs.newUserNature.formData.saveUser.openId = params.row.openId;


                        const getGroupList = (() => {
                          return (cb) => {
                            let arr = [];
                            this.$api.authUserInterface.listAuthGroup({}).then(res => {
                              res = res.data;
                              if (res.success) {
                                [].forEach.call(res.data, m => {
                                  arr.push({
                                    id: m.authGroupId,
                                    authGroupId: m.authGroupId,
                                    name: m.authGroupName,
                                    open: false,
                                    isFolder: false,
                                    clickNode: false,
                                    isModify: false,
                                    selectedGroup: false,
                                    childNum: 0,
                                    children: []
                                  })
                                });
                                cb && cb.call(null, arr);
                              }
                            }).catch(err => {
                              console.error(err)
                            })
                          }
                        })();

                        getGroupList((arr) => {
                          this.$refs.newUserNature.modal.newUserModal.groupList = arr;
                          this.$refs.newUserNature.modal.newUserModal.show = true;
                        })
                      }
                    }
                  }, '接受并新建用户'),
                  h('Span', [this.$slots.default, (() => {
                    if (params.row.applyState === 0) {
                      return h('Button', {
                        props: {
                          type: 'error',
                          size: 'small'
                        },
                        on: {
                          click: () => {

                            this.$Modal.confirm({
                              title: '拒绝申请',
                              content: '<p>确定拒绝这位用户的申请吗？</p>',
                              onOk: () => {
                                this.$api.authUserInterface.removeAuthUserApplyState({authUserApplyId: params.row.authUserApplyId})
                                  .then(res => {
                                    if (res.data.success) {
                                      this.$Message.info('成功');
                                      this._getApplyList();
                                    } else {
                                      this.$Message.error(res.data.retMsg)
                                    }
                                  }).catch(err => {
                                  console.error(err)
                                })
                              }
                            });

                          }
                        }
                      }, '拒绝')
                    }
                  })()])
                ]);
              }
            }
          ],
          body: [
            {
              authUserName: '塔吊1#',
              phoneNum: '13575356945',
              registerDate: '2018-5-10 16:16:16',
              registerSource: '微信',
              registerDesc: '测试'
            },
          ],
          args: {
            start: 0,
            length: 15,
            currentPage: 1,
            totalCount: 0
          }
        },
        formData: {
          listData: {}
        },
        qrcodeUrl: ''
      }
    },
    mounted() {
      this._getApplyList();
    },
    methods: {
      _getApplyList() {
        this.table.body = [];
        this.$api.authUserInterface.listAuthUserApply()
          .then(res => {
            res = res.data;
            if (res.success) {
              this.table.body = (() => {
                let arr = [];
                [].forEach.call(res.data.authUserApplyVO, m => {
                  if (m.applyState === 0) {
                    arr.push(m)
                  }
                });

                return arr;
              })();

              this.qrcodeUrl = res.data.qrcodeUrl
            }
          }).catch(err => {
          console.error(err)
        })
      },
      showApplyModal() {
        this.$refs.newApplyNature._getShortMsgAuditor();
        this.$refs.newApplyNature.modal.newApplyModal.tabs.tempQrcodeImg = this.qrcodeUrl;
        this.$refs.newApplyNature.modal.newApplyModal.show = true;
      },
      changeApplyPage(targetPage) {
        this.table.args.currentPage = targetPage;
        this.table.args.start = (targetPage - 1) * this.table.args.length;
      }
    }
  }
</script>
