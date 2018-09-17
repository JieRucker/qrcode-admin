<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .qrcode-detail__right {
    .record-module-popup {
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
          .module-main-panel {
            @include module-main-panel;
            .show-auth-panel {
              .inline {
                vertical-align: middle;
                margin-right: 5px
              }
              .radio-inline {
                padding-left: 1.25em;
                margin-bottom: 0;
                cursor: pointer;
                font-weight: 400;
                input {
                  vertical-align: middle;
                  margin-right: 2px;
                }
              }
            }
            .add-auth-panel {
              margin-top: 10px;
              .inline {
                vertical-align: middle;
                margin-right: 5px
              }
              .radio-inline {
                padding-left: 1.25em;
                margin-bottom: 0;
                cursor: pointer;
                font-weight: 400;
                input {
                  vertical-align: middle;
                  margin-right: 2px;
                }
              }
            }
          }
          .table-panel {
            .tab-list {
              width: 100%;
              text-align: center;
              margin-bottom: 15px;
              border-spacing: 0;
              border-collapse: collapse;
              tr {
                th {
                  padding: 5px;
                  background-color: #f5f5f5;
                  border: 1px solid #dddee1;
                }
                td {
                  padding: 5px;
                  border: 1px solid #dddee1;
                  background-color: #fff;
                  .name {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    max-width: 200px;
                    display: inline-block;
                    vertical-align: middle;
                  }
                  .action {
                    vertical-align: middle;
                  }
                }
              }
            }
          }
          .dropdown {
            .ivu-dropdown-item {
              padding: 0;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveRecordModulePopup">
    <a href="javascript:;" class="module-title">维护模板操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">模块标题</label>
      <div class="module-control-content">
        <Input style="width: 300px" v-model="block.moduleTitle"></Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">配置维护模板</label>
      <div class="module-control-content">
        <div class="table-panel" v-if="initial.recordList && initial.recordList.length">
          <table class="tab-list">
            <thead>
            <tr>
              <th style="width: 50%">维护模板</th>
              <th style="width: 30%">对应用户组</th>
              <th style="width: 10%">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr style="height: 40px" v-for="(item,index) in initial.recordList">
              <td>
                <span class="name">{{item.recordTemplateName}}</span>
                <a href="javascript:;" class="action" @click="showModal({type:0,index:index})">修改</a>
              </td>
              <td>
                <span v-if="item.authGroupList.length">已选择{{item.authGroupList.length}}个用户组</span>
                <span v-if="item.isOpenAll">所有人</span>
                <span v-if="!item.isOpenAll && !item.authGroupList.length">选择巡检人员</span>
                <a href="javascript:;" @click="showModal({type:1,index:index})">修改</a>
              </td>
              <td>
                <a href="javascript:;" @click="deleteIcon(index)">删除</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <Button @click="showRecordTemplateModal">
          <Icon type="plus-round" size="12"></Icon>&nbsp;添加其他维护模板
        </Button>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">权限设置</label>
      <div class="module-control-content">
        <div class="module-main-panel">
          <div class="show-auth-panel">
            <label class="inline">
              查看记录权限:
            </label>
            <label class="radio-inline">
              <Select v-model="initial.displayRecordAuthState" style="width:150px">
                <Option v-for="data in authStateList" :value="data.key" :key="data.key">{{data.value}}
                </Option>
              </Select>
            </label>
            <label class="radio-inline" v-if="initial.displayRecordAuthState === 2">
              <auther-group v-model="dropdown.visible" :list="dropdown.userGroupList" @on-confirm="onGroupConfirm">
                <a slot="button" href="javascript:void(0)" @click="_getGroupList">选择人员组</a>
              </auther-group>
            </label>
          </div>
          <div class="add-auth-panel" v-if="initial.displayRecordAuthState === 2">
            <div style="margin-top: 10px;margin-left: 100px">
              <span style="display: inline-block;vertical-align: middle;">已选择：</span>
              <ul class="clearfix" style="display: inline-block;vertical-align: middle;">
                <li style="float: left;margin-left: 3px" v-for="(item,index) in initial.displayRecordAuthGroup">
                  {{item.authGroupName}}<span v-if="index !== initial.displayRecordAuthGroup.length - 1">|</span></li>
              </ul>
            </div>
          </div>
          <div class="add-auth-panel" v-if="initial.displayRecordAuthState === 3">
            <div style="margin-top: 10px;margin-left: 100px">
              <span>添加记录的人仅能看到自己添加的记录</span>
            </div>
          </div>
          <div class="add-auth-panel">
            <label class="inline">
              添加记录权限:
            </label>
            <label class="radio-inline">
              <Checkbox v-model="initial.is_open_apply_qrcode_auth_user">开放扫码申请</Checkbox>
            </label>
            <label class="radio-inline">
              <a href="javascript:;" @click="showAuthUser">配置短信审核员</a>
            </label>
          </div>
          <div v-if="initial.is_open_apply_qrcode_auth_user">
            <div class="add-auth-panel">
              <label class="inline">
                扫码申请标题:
              </label>
              <label class="radio-inline">
                <Input style="width: 150px" v-model="initial.apply_qrcode_auth_user_title"></Input>
              </label>
            </div>
            <div class="add-auth-panel">
              <label class="inline">
                扫码申请说明:
              </label>
              <label class="radio-inline">
                <Input style="width: 150px" v-model="initial.apply_qrcode_auth_user_explain"></Input>
              </label>
            </div>
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
  import autherGroup from "@/components/author-group/auther-group";

  export default {
    name: "record-module",
    components: {
      autherGroup,
      popupModal,
      loader
    },
    props: {
      currentTab: String,
      block: Object,
    },
    computed: {
      getDataSourceList() {
        return this.$store.getters.getDataSourceList()
      },
      get() {
        return this.$store.getters.getSource('qRecordMdl')
      }
    },
    data() {
      return {
        initial: new Object(null),
        authStateList: [
          {
            key: 1,
            value: '所有人可见'
          },
          {
            key: 0,
            value: '所有人不可见'
          },
          {
            key: 2,
            value: '选择人员组可见'
          },
          {
            key: 3,
            value: '仅维护人可见'
          }
        ],
        dropdown: {
          visible: false,
          userGroupList: [],
        }
      }
    },
    mounted() {
      this.initial = new Object(null);

      this.$api.qrcodeInterface.getModule({
        moduleId: this.block.moduleId
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
        let index = this.get.dataSource.templateObj.currentIndex;
        this.get.dataSource.initial.recordList[index].recordTemplateName = value.recordTemplateName;
        this.get.dataSource.initial.recordList[index].recordTemplateId = value.recordTemplateId;
      },
      /**
       * 选择人员组回调
       */
      onGroupConfirm(value) {
        this.initial.displayRecordAuthGroup = [];
        [...value].forEach(m => {
          if (m.selected) {
            this.initial.displayRecordAuthGroup.push({
              authGroupName: m.authGroupName,
              authGroupId: m.authGroupId
            })
          }
        });

        this.dropdown.visible = false;
      },
      /**
       * 获取人员组
       */
      _getGroupList() {
        this.dropdown.visible = false;
        this.dropdown.userGroupList = [];
        this.$api.authUserInterface.listAuthGroupWithAuthUserInfo()
          .then(res => {
            res = res.data;
            if (res.success) {
              let displayRecordAuthGroup = this.initial.displayRecordAuthGroup;
              [...res.data].forEach(m => {
                m.selected = false;
                [...displayRecordAuthGroup].forEach(k => (m.authGroupId === k.authGroupId) && (m.selected = true))
              });
              this.dropdown.userGroupList = res.data;
              this.dropdown.visible = true;
            }
          }).catch(err => console.error(err))
      },
      /**
       * 显示弹窗
       * @param param
       * @param compName 组件名称
       * @param type:0 弹窗无下一步 type:1 弹窗有下一步
       */
      showModal(param) {
        switch (param.type) {
          case 0:
            this.$store.dispatch('setDataSourceList', {
              compName: 'qRecordMdl',
              dataSource: {
                showModal: true,
                templateObj: {
                  compName: 'sel-record-tpl',
                  showStep: false,
                  currentIndex: param.index,
                  recordTemplateName: this.initial.recordList[param.index].recordTemplateName,
                  recordTemplateId: this.initial.recordList[param.index].recordTemplateId,
                  authGroupList: this.initial.recordList[param.index].authGroupList,
                },
                initial: this.initial
              }
            });
            break;
          case 1:
            this.$store.dispatch('setDataSourceList', {
              compName: 'qRecordMdl',
              dataSource: {
                showModal: true,
                templateObj: {
                  compName: 'sel-auth-group',
                  showStep: false,
                  currentIndex: param.index,
                  recordTemplateName: this.initial.recordList[param.index].recordTemplateName,
                  recordTemplateId: this.initial.recordList[param.index].recordTemplateId,
                  authGroupList: this.initial.recordList[param.index].authGroupList,
                  isOpenAll: this.initial.recordList[param.index].isOpenAll
                },
                initial: this.initial
              }
            });
            break;
        }
      },
      /**
       * 显示维护模板
       */
      showRecordTemplateModal() {
        this.$store.dispatch('setDataSourceList', {
          compName: 'qRecordMdl',
          dataSource: {
            showModal: true,
            templateObj: {
              compName: 'sel-record-tpl',
              showStep: true,
              recordTemplateName: '',
              recordTemplateId: '',
              authGroupList: []
            },
            initial: this.initial
          }
        });
      },
      /**
       * 移除记录
       */
      deleteIcon(index) {
        this.initial.recordList.splice(index, 1)
      },
      /**
       * 配置短信审核员
       */
      showAuthUser() {
        const routeData = this.$router.resolve({
          name: "auth-list",
          query: {}
        });
        window.open(routeData.href, '_blank');
      },
      /**
       * 保存维护模板
       */
      saveRecordModulePopup() {
        let param = new ToolFunctor(this)._set();
        this.$api.qrcodeInterface.updateModule(param).then(res => {
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

    equal(fn) {
      return (...args) => {
        return fn.apply(this, args);
      }
    }

    _get(res) {
      let target = new Object(null);
      target.recordList = (() => {
        let a = null;
        if (res.moduleObject) {
          a = res.moduleObject.recordList
        } else {
          a = []
        }

        return a;
      })();

      // 查看记录权限  0所有人不可见 1所有人可见 2选择人员组可见  3仅维护人可见[添加记录的人仅能看到自己添加的记录
      target.displayRecordAuthState = res.moduleObject ? res.moduleObject.displayRecordAuth.displayRecordAuthState : 0;
      // 选择人员组
      target.displayRecordAuthGroup = (() => {
        let a = null;
        if (res.moduleObject) {
          a = res.moduleObject.displayRecordAuth.displayRecordAuthGroup
        } else {
          a = []
        }

        return a;
      })();
      // 添加记录权限 false 未开放 true 开放 如果选择开放，那么扫码二维码后会,不是二维码维护人的用户会显示'申请成为维护人'按钮
      target.is_open_apply_qrcode_auth_user = res.moduleObject ? res.moduleObject.addRecordAuth.is_open_apply_qrcode_auth_user : false;
      // 扫码申请标题
      target.apply_qrcode_auth_user_title = res.moduleObject ? res.moduleObject.addRecordAuth.apply_qrcode_auth_user_title : '';
      // 扫码申请说明
      target.apply_qrcode_auth_user_explain = res.moduleObject ? res.moduleObject.addRecordAuth.apply_qrcode_auth_user_explain : '';

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);
      target.isFold = this.tis.block.isFold;
      target.isUsed = this.tis.block.isUsed;
      target.hasNew = true;
      target.moduleId = this.tis.block.moduleId; // 模块编号
      target.moduleTitle = this.tis.block.moduleTitle;
      target.moduleType = this.tis.block.moduleType;
      target.sortId = this.tis.block.sortId;
      target.templateId = this.tis.$route.query.templateId;
      target.uploadId = this.tis.uploadId;
      target.moduleVOJson = (() => {
        let options = {
          moduleId: this.tis.block.moduleId,
          moduleTitle: this.tis.block.moduleTitle,
          moduleType: this.tis.block.moduleType,
          templateId: this.tis.$route.query.templateId,
          isFold: this.tis.block.isFold,
          sortId: this.tis.block.sortId,
          isUsed: this.tis.block.isUsed,
          hasNew: true,
          moduleObject: {
            recordList: this.tis.initial.recordList,
            displayRecordAuth: {
              displayRecordAuthState: this.tis.initial.displayRecordAuthState, // 0所有人不可见 1所有人可见 2选择人员组可见  3仅维护人可见[添加记录的人仅能看到自己添加的记录
              displayRecordAuthGroup: this.tis.initial.displayRecordAuthGroup
            },
            addRecordAuth: {
              is_open_apply_qrcode_auth_user: this.tis.initial.is_open_apply_qrcode_auth_user, // 0 未开放 1 开放 如果选择开放，那么扫码二维码后会,不是二维码维护人的用户会显示'申请成为维护人'按钮
              apply_qrcode_auth_user_title: this.tis.initial.apply_qrcode_auth_user_title, // 扫码申请标题
              apply_qrcode_auth_user_explain: this.tis.initial.apply_qrcode_auth_user_explain // 扫码申请说明
            }
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>

