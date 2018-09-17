<style lang="scss">
  @import "../styles/auth-list.scss";
</style>

<template>
  <div class="auth-list">
    <div class="tree" style="background-color:#f8f8f8">
      <h2 class="tree--title">部门</h2>
      <Button type="default" size="small" class="tree--button" @click="handleNewGroup">
        新建部门
      </Button>
      <j-tree
        :list="treeList"
        :click="onClick"
        :blur="onBlur"
        :remove="onRemove"
        :show-plus-icon="false"
        :expand="expandClick"
        :is-open="false">
      </j-tree>
    </div>

    <div class="main">
      <div class="main__header clearfix">
        <div class="main__tip">
          <Button @click="_batchDelete">删除</Button>
          <Button type="primary" @click="showMakeQrcodeModal">批量验证</Button>
        </div>
        <div class="main__action">
          <Input v-model="formData.list.searchKey" placeholder="请输入姓名或手机号" style="width:200px;margin-right: 10px">
          <Button slot="append" icon="ios-search" @click.native="handleSearch"></Button>
          </Input>
          <Button type="primary" style="margin-right: 10px" @click="_importUserInfo">
            <Icon type="plus-round"></Icon>&nbsp;批量导入
          </Button>
          <Button style="margin-right: 10px" @click="newUserModal">添加员工</Button>

        </div>
      </div>
      <div class="main__section clearfix">
        <div class="table">
          <Table ref="userGroupTable" :height="table.body.length > 15 ? 760 : ''" :columns="table.header"
                 :data="table.body"></Table>
          <!--<div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="table.args.totalCount"
                    :current="table.args.currentPage"
                    :page-size="table.args.length"
                    show-total @on-change="changeAuthPage"></Page>
            </div>
          </div>-->
        </div>
      </div>
    </div>

    <new-user-nature ref="newUserNature"></new-user-nature>
    <make-qrcode-nature ref="makeQrcodeNature"></make-qrcode-nature>

    <div id="uploadPicker" class="upload-target"></div>
  </div>
</template>

<script>
  import jTree from '@/components/j-tree/jTree.vue';
  import newUserNature from "../modal/new-user-nature.vue";
  import makeQrcodeNature from "../modal/make-qrcode-nature.vue";

  export default {
    name: "auth-list",
    components: {
      newUserNature,
      makeQrcodeNature,
      jTree
    },
    data() {
      return {
        nodeTree: {
          createFileMenu: '',
          nodeModel: null
        },
        args: {
          treeStart: 0,
          treeLength: 50,
          templateStart: 0,
          templateLength: 10,
          selectAll: false
        },
        treeList: [],
        recordList: [],

        table: {
          header: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '姓名',
              key: 'authUserName'
            },
            {
              title: '手机号',
              key: 'phoneNum'
            },
            {
              title: '所在部门',
              render: (h, params) => {
                return h('ul', params.row.authGroupList.map((item, key) => {
                  return h('li', {
                    style: {
                      float: 'left'
                    },
                  }, key === params.row.authGroupList.length - 1 ? item.authGroupName : `${item.authGroupName},`)
                }))
              }
            },
            {
              title: '验证结果',
              key: 'authState',
              render: (h, params) => {
                return h('span', {
                  style: {
                    color: params.row.authState === 0 ? '#f00' : ''
                  }
                }, params.row.authState === 0 ? '未授权' : '已授权')
              }
            },
            {
              title: '操作',
              key: 'action',
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
                        this.$refs.newUserNature.modal.newUserModal.modalType = 1;
                        this.$refs.newUserNature.formData.saveUser.authUserId = params.row.authUserId;
                        this.$refs.newUserNature.formData.saveUser.authState = params.row.authState;
                        this.$refs.newUserNature.formData.saveUser.authUserName = params.row.authUserName;
                        this.$refs.newUserNature.formData.saveUser.authWorkDept = params.row.authWorkDept;
                        this.$refs.newUserNature.formData.saveUser.phoneNum = params.row.phoneNum;
                        this.$refs.newUserNature.modal.newUserModal.groupList = (() => {
                          let a = [];
                          [...this.treeList].forEach(m => {
                            m.sWAll || a.push(m)
                          });
                          return a;
                        })();

                        this.treeList.forEach((m) => {
                          m.selectedGroup = false;

                          params.row.authGroupList.forEach((c) => {
                            if (c.authGroupId === m.authGroupId) {
                              m.selectedGroup = true;
                            }
                          })
                        });

                        this.$refs.newUserNature.modal.newUserModal.show = true;
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: params.row.authState === 0 ? 'default' : 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        if (params.row.authState === 0) {
                          this.$refs.makeQrcodeNature.tempQrcodeImg = this.qrcodeUrl;
                          this.$refs.makeQrcodeNature.getQrcode();
                          this.$refs.makeQrcodeNature.show = true;
                        } else {

                          this.$Modal.confirm({
                            title: '取消验证',
                            content: '<p>确定对这位用户取消验证吗？</p>',
                            onOk: () => {
                              this.$api.authUserInterface.updateAuthInfo({
                                authState: 0,
                                authUserId: params.row.authUserId
                              }).then(res => {
                                if (res.data.success) {
                                  this.$Message.info('成功');
                                  this._getAuthUserInfo();
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
                    }
                  }, params.row.authState === 0 ? '邀请验证' : '取消验证'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: '删除员工',
                          content: '<p>一旦你删除人员，所有与该人员有关的信息将被永久删除。这是一个不可恢复的操作，请谨慎对待！</p>',
                          onOk: () => {
                            this.$api.authUserInterface.removeAuthUser({authUserIdListJson: JSON.stringify([`${params.row.authUserId}`])})
                              .then(res => {
                                if (res.data.success) {
                                  this.$Message.info('删除成功');
                                  this._getAuthUserInfo();
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
                  }, '删除')
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

        formData: {
          list: {
            authGroupId: '',
            searchKey: ''
          }
        },

        qrcodeUrl: '',

        uploadId: null,
        uploader: null, //上传对象
      }
    },
    mounted() {
      this._getAuthGroup();
      this.initUpload();
    },
    methods: {
      /**
       * 初始化上传
       * @returns {*}
       */
      initUpload() {
        if (this.uploader) this.uploader.destroy();

        /* 初始化上传插件 */
        this.uploader = WebUploader.create({
          pick: {
            id: '#uploadPicker',
            multiple: true
          },
          accept: {
            title: 'Excel',
            extensions: 'csv,xls,xlsx',
            mimeTypes: '.csv,.xls,.xlsx'
          },
          auto: true,
          compress: false, //不压缩
          chunked: true, //分块传输
          chunkSize: 1024 * 1024, //分块大小
          server: `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${this.uploadId}`,
          duplicate: true,
          fileSingleSizeLimit: 1024 * 1024 * 1024,
          fileNumLimit: 50, //最大上传数目1000
          fileSizeLimit: 1024 * 1024 * 1024 * 1024 //单次文件上传限制1024G
        });

        /* 上传完成 */

        this.uploader.on('uploadFinished', (file, response) => {
          this.$api.authUserInterface.batchSaveAuthUser({
            authUserGroupId: this.formData.list.authGroupId,
            uploadId: this.uploadId
          }).then(res => {
            res = res.data;
            this.$Message.info(res.retMsg);
            if (res.success) {
              this._getAuthGroup();
            }
          }).catch(err => {
            console.error(err.message)
          });

          this.uploader.reset();
        });

        this.uploader.on('uploadError', (file, reason) => {
          this.$Message.info('上传失败', 5000);
          this.uploader.reset();
        });
        return this.uploader.on('error', (type) => {
          switch (type) {
            case 'F_EXCEED_SIZE':
              return this.$Message.info('文件大小超过限制');
            case 'Q_EXCEED_NUM_LIMIT':
              return this.$Message.info('文件数目超过限制');
            case 'Q_TYPE_DENIED':
              return this.$Message.info('文件类型不对');
          }
        });
      },
      /**
       * 获取uploadId
       */
      getUpload() {
        if (!this.uploadId) {
          const promise = new Promise((resolve, reject) => {
            $.ajax({
              url: `${process.env.api.commonUrl}/common/createUploadId`,
              type: 'post',
              async: false
            }).done((res) => {
              res = JSON.parse(res);
              res.success ? resolve(res.data) : reject(res.retMsg);
            });
          });

          promise.then((resolve) => {
            this.uploader.options.server = `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${resolve}`;
            this.uploadId = resolve;
            document.querySelector('#uploadPicker .webuploader-element-invisible').click()
          }, (reject) => {
            this.$Message.error(reject);
          })
        } else {
          document.querySelector('#uploadPicker .webuploader-element-invisible').click()
        }
      },
      _importUserInfo() {
        if (this.nodeTree.nodeModel.sWAll) {
          return this.$Message.info('请先选择人员组，无法批量导入在全部组下');
        }

        this.getUpload();
      },
      _getAuthUserInfo() {
        this.table.body = [];
        this.$api.authUserInterface.getAuthUserInfo({...this.formData.list})
          .then(res => {
            res = res.data;
            if (res.success) {
              this.table.body = res.data.authUserVOList;
              this.qrcodeUrl = res.data.qrcodeUrl
            }
          }).catch(err => {
          console.error(err.message)
        })
      },
      handleSearch() {
        this._getAuthUserInfo();
      },
      newUserModal() {
        this.$refs.newUserNature.modal.newUserModal.modalType = 0;
        this.$refs.newUserNature.modal.newUserModal.groupList = (() => {
          let a = [];
          [...this.treeList].forEach(m => {
            m.sWAll || a.push(m)
          });
          return a;
        })();
        this.$refs.newUserNature.modal.newUserModal.show = true;
      },
      _batchDelete() {
        let getSelection = this.$refs.userGroupTable.getSelection();
        if (getSelection.length) {

          let authUserIdListJson = (() => {
            let arr = [];
            [].forEach.call(getSelection, m => {
              arr.push(m.authUserId)
            });
            return arr;
          })();

          this.$Modal.confirm({
            title: '提示',
            content: '<p>确定删除？</p>',
            onOk: () => {
              this.$api.authUserInterface.removeAuthUser({authUserIdListJson: JSON.stringify(authUserIdListJson)})
                .then(res => {
                  if (res.data.success) {
                    this.$Message.info('删除成功');
                    this._getAuthUserInfo();
                  } else {
                    this.$Message.error(res.data.retMsg)
                  }
                }).catch(err => {
                console.error(err)
              })
            }
          });
        } else {
          this.$Message.info('请选择人员！');
        }
      },
      _getAuthGroup() {
        this.treeList = [];
        this.$api.authUserInterface.listAuthGroup({}).then(res => {
          if (res.data.success) {

            [].forEach.call(res.data.data, m => {
              this.treeList.push({
                // parentTemplateFoldId: m.parentTemplateFoldId,
                id: m.authGroupId,
                authGroupId: m.authGroupId,
                name: m.authGroupName,
                open: false,
                isFolder: false,
                clickNode: false,
                isModify: false,
                selectedGroup: false,
                sWAll: false, // 显示全部
                childNum: 0,
                children: []
              })
            });

            this.treeList.unshift({
              id: '',
              authGroupId: '',
              name: '全部',
              open: false,
              isFolder: false,
              clickNode: false,
              isModify: false,
              selectedGroup: false,
              sWAll: true, // 显示全部
              childNum: 0,
              children: []
            });

            if (this.treeList.length > 0) {
              this.treeList[0].clickNode = true;
              this.nodeTree.nodeModel = this.treeList[0];

              this.formData.list.authGroupId = this.treeList[0].authGroupId;
              this._getAuthUserInfo();
            }

          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      showMakeQrcodeModal() {
        this.$refs.makeQrcodeNature.tempQrcodeImg = this.qrcodeUrl;
        this.$refs.makeQrcodeNature.getQrcode();
        this.$refs.makeQrcodeNature.show = true;
      },
      selectAll() {
        this.recordList.forEach(m => {
          m.selected = this.args.selectAll;
        });
      },
      changeAuthPage(targetPage) {
        this.table.args.currentPage = targetPage;
        this.table.args.start = (targetPage - 1) * this.table.args.length;
      },
      handleNewGroup() {
        this.$Modal.confirm({
          title: '新建人员组',
          render: (h) => {
            return h('Input', {
              style: {
                marginTop: '10px'
              },
              props: {
                value: this.nodeTree.createFileMenu,
                autofocus: true,
                placeholder: '请输入名称'
              },
              on: {
                input: (val) => {
                  this.nodeTree.createFileMenu = val;
                }
              }
            })
          },
          onOk: () => {
            if (!this.$Global.isBlank(this.nodeTree.createFileMenu)) {
              this.$api.authUserInterface.saveAuthGroup({
                authGroupName: this.nodeTree.createFileMenu
              }).then(res => {
                if (res.data.success) {
                  this._getAuthGroup();
                  this.$Message.info(res.data.retMsg);
                }
              }).catch(err => {
                console.error(err)
              })
            } else {
              this.$Message.info('请输入名称');
            }
          },
          onCancel: () => {
            this.nodeTree.createFileMenu = '';
          }
        })
      },
      onBlur(event, model) {
        event.target.value !== model.name ? (() => {
          this.$api.authUserInterface.updateAuthGroup({
            authGroupId: model.authGroupId,
            authGroupName: event.target.value
          }).then((res) => {
            this._getAuthGroup();
            this.$Message.info(res.data.retMsg);
          }).catch(err => console.log(err))
        })() : null
      },
      onRemove(model) {
        this.nodeTree.nodeModel = model;
        this.$Modal.confirm({
          title: '提示',
          content: `<p>是否删除？</p>`,
          onOk: () => {
            this.$api.authUserInterface.removeAuthGroup({
              authGroupId: model.authGroupId
            }).then(res => {
              if (res.data.success) {
                this._getAuthGroup();
                this.$Message.info(res.data.retMsg);
              }
            }).catch(err => console.error(err))
          }
        })
      },
      onClick(model) {
        this.nodeTree.nodeModel = model;
        this.formData.list.authGroupId = model.authGroupId;
        this._getAuthUserInfo();
      },
      expandClick(model) {
        this.nodeTree.nodeModel = model;
        if (model.isExpand) {
          model.loadNode = 1;

          this.$api.authUserInterface.listTemplateFold({
            parentTemplateFoldId: this.nodeTree.nodeModel.templateFoldId,
            templateFoldName: '',
            start: this.args.treeStart,
            length: this.args.treeLength
          }).then(res => {
            if (res.data.success) {
              model.loadNode = 2;
              model.isFolder = true;

              if (res.data.data.templateFoldList) {
                res.data.data.templateFoldList.forEach((m) => {
                  model.children.push({
                    parentTemplateFoldId: m.parentTemplateFoldId,
                    id: m.templateFoldId,
                    templateFoldId: m.templateFoldId,
                    name: m.templateFoldName,
                    open: false,
                    isFolder: false,
                    clickNode: false,
                    isModify: false,
                    childNum: m.childTemplateFoldNum,
                    children: []
                  })
                })
              }
            } else {
              this.$Message.error(res.data.retMsg)
            }
          }).catch(err => console.error(err))
        }
      }
    }
  }
</script>
