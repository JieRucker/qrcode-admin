<style lang="scss">
  @include b(state-setting-nature) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
      @include m(desc) {
        font-size: 12px;
        color: #999;
        margin-left: 10px;
      }
    }
    @include b(body) {
      @include b(dropdown) {
        @include e(button) {
          display: flex;
          justify-content: space-between;
          @include m(icon) {
            vertical-align: middle;
            margin-top: 3px;
          }
        }
        @include e(menu) {
          @include m(remark) {
            color: #999;
            margin-left: 10px;
          }
        }
        @include e(footer) {
          display: flex;
          justify-content: space-between;
          @include m(total) {
            padding: 3px 5px;
          }
        }
      }
      @include e(form-remind) {
        @include m(desc) {
          margin-left: 5px;
          display: inline;
        }
      }
    }
  }
</style>

<template>
  <div>
    <Modal v-model="showModal" width="750" class="state-setting-nature"
           @on-visible-change="onVisible">
      <p slot="header" class="header">
        <span class="header--title">状态设置</span>
      </p>
      <div class="body">
        <Form label-position="left">
          <FormItem label="状态组：" :label-width="110" v-if="initial.recordStateTemplateVO">
            <Dropdown trigger="click" placement="bottom-start" class="dropdown">
              <Button type="ghost" @click.native="_getRecordStateList">
                <div class="dropdown__button" style="width: 100px;">
                  <span v-if="initial.recordStateTemplateVO.recordStateTemplateId !== ''">{{initial.recordStateTemplateVO.recordStateTemplateName}}</span>
                  <span v-else>请选择</span>
                  <Icon type="arrow-down-b" class="dropdown__button--icon"></Icon>
                </div>
              </Button>
              <DropdownMenu slot="list" style="width: 200px;">
                <DropdownItem v-for="(item,index) in dropdownStateList" :key="index" @click.native="changeState(index)">
                  {{item.recordStateTemplateName}}
                </DropdownItem>
                <!--<DropdownItem style="text-align: center" @click.native="newStateGroup">
                  <a href="javascript:;">新建状态组</a>
                </DropdownItem>-->
              </DropdownMenu>
            </Dropdown>
          </FormItem>

          <FormItem label="谁能设置：" :label-width="110" v-if="initial.editRecordStateAuthGroup">
            <auther-group v-model="dropdown.firstVisible" :list="groupList" :showSetUser="true"
                          @on-confirm="onGroupFirstConfirm">
              <Button type="ghost" slot="button" @click.native="_getGroupList({type:0})">
                <div class="dropdown__button" style="width: 300px;display: initial">
                  <span v-if="!initial.editRecordStateAuthGroup.length">请选择</span>
                  <Tag closable @on-close="handleTagClose({type:0,index:index})" style="margin-right: 3px"
                       v-for="(item,index) in initial.editRecordStateAuthGroup" :key="index">
                    {{item.authGroupName}}
                  </Tag>
                  <Icon type="arrow-down-b" class="dropdown__button--icon"></Icon>
                </div>
              </Button>
            </auther-group>
          </FormItem>

          <FormItem label="状态变更提醒：" :label-width="110" class="body__form-remind">
            <Checkbox v-model="initial.isOpenRecordStateChangeRemind">开启</Checkbox>
            <p class="body__form-remind--desc">用户需<a href="javascript:;">授权并关注二维码公众号</a>方可接受状态变更通知</p>
          </FormItem>
          <FormItem label="" :label-width="110" v-if="initial.isOpenRecordStateChangeRemind">
            <Dropdown trigger="click" placement="bottom-start" class="dropdown" style="display: inline-block">
              <Button type="ghost">
                <div class="dropdown__button" style="width: 100px;">
                  <span v-if="initial.recordStateChangeRemindItemValue !== ''">{{initial.recordStateChangeRemindItemValue}}</span>
                  <span v-else>请选择状态组</span>
                  <Icon type="arrow-down-b" class="dropdown__button--icon"></Icon>
                </div>
              </Button>
              <DropdownMenu slot="list" style="width: 200px;">
                <DropdownItem v-for="(item,index) in initial.recordStateTemplateVO.stateCfgList" :key="index"
                              @click.native="changeStateCfg(index)">
                  {{item.itemName}}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <auther-group v-model="dropdown.secondVisible" :list="groupList" :showSetUser="true"
                          @on-confirm="onGroupSecondConfirm">
              <Button type="ghost" slot="button" @click.native="_getGroupList({type:1})">
                <div class="dropdown__button" style="width: 300px;display: initial">
                  <span v-if="!initial.recordStateChangeRemindAuthGroup.length">请选择</span>
                  <Tag closable @on-close="handleTagClose({type:1,index:index})" style="margin-right: 3px"
                       v-for="(item,index) in initial.recordStateChangeRemindAuthGroup" :key="index">
                    {{item.authGroupName}}
                  </Tag>
                  <Icon type="arrow-down-b" class="dropdown__button--icon"></Icon>
                </div>
              </Button>
            </auther-group>
          </FormItem>
        </Form>
      </div>

      <div slot="footer" class="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="saveStateSettingPopup">保存</Button>
      </div>
    </Modal>

    <!--<new-state-nature ref="newStateNature"></new-state-nature>-->
  </div>
</template>

<script>
  import autherGroup from "@/components/author-group/auther-group";
  import newStateNature from './new-state-nature.vue';

  export default {
    name: "state-setting-nature",
    components: {
      autherGroup,
      newStateNature
    },
    props: {
      autoClose: {
        type: Boolean,
        default: true
      },
      confirmfunc: {
        type: Function,
      }
    },
    computed: {
      showModal() {
        return this.$store.getters.getSource('qStateSettingMdl').dataSource.showModal
      },
      get() {
        return this.$store.getters.getSource('qStateSettingMdl')
      }
    },
    data() {
      return {
        initial: new Object(null),
        dropdown: {
          firstVisible: false,
          secondVisible: false
        },
        dropdownStateList: [], // 状态组数据
        groupList: [], // 人员组数据
      }
    },
    mounted() {
      this.initial = this.$Global.cloneObj(this.$store.getters.getSource('qStateSettingMdl').dataSource.templateObj)
    },
    methods: {
      /**
       * 获取状态组数据
       */
      _getRecordStateList() {
        this.dropdownStateList = [];
        this.$api.recordStateInterface.listRecordStateTemplate({
          startPage: 0,
          pageSize: 100
        }).then(res => {
          res = res.data;
          if (res.success) {
            this.dropdownStateList = res.data.dbPageList;
          }
        }).catch(err => console.error(err))
      },
      /**
       * 新建状态组
       */
      newStateGroup() {
        this.$refs.newStateNature.modal.newStateModal.show = true;
      },
      /**
       * 选中状态组
       */
      changeState(index) {
        this.initial.recordStateTemplateVO.recordStateTemplateName = this.dropdownStateList[index].recordStateTemplateName;
        this.initial.recordStateTemplateVO.recordStateTemplateId = this.dropdownStateList[index].recordStateTemplateId;
        this.initial.recordStateTemplateVO.stateCfgList = this.dropdownStateList[index].stateCfgList;
        this.initial.recordStateChangeRemindItemValue = this.dropdownStateList[index].stateCfgList[0].itemName;
      },
      /**
       * 选中状态变更提醒颜色
       */
      changeStateCfg(index) {
        this.initial.recordStateChangeRemindItemValue = this.initial.recordStateTemplateVO.stateCfgList[index].itemName;
      },
      /**
       * 获取人员组
       * @param param
       */
      _getGroupList(param) {
        this.dropdown.firstVisible = false;
        this.dropdown.secondVisible = false;

        this.groupList = [];
        this.$api.authUserInterface.listAuthGroupWithAuthUserInfo()
          .then(res => {
            res = res.data;
            if (res.success) {
              let list = (() => {
                switch (param.type) {
                  case 0:
                    return this.initial.editRecordStateAuthGroup;
                  case 1:
                    return this.initial.recordStateChangeRemindAuthGroup;
                }
              })();
              [...res.data].forEach(m => {
                m.selected = false;
                [...list].forEach(k => (m.authGroupId === k.authGroupId) && (m.selected = true))
              });
              this.groupList = res.data;

              switch (param.type) {
                case 0:
                  this.dropdown.firstVisible = true;
                  break;
                case 1:
                  this.dropdown.secondVisible = true;
                  break;
              }
            }
          }).catch(err => console.error(err))
      },
      /**
       * 选择谁能设置人员组回调
       */
      onGroupFirstConfirm(value) {
        this.initial.editRecordStateAuthGroup = [];
        [...value].forEach(m => {
          if (m.selected) {
            this.initial.editRecordStateAuthGroup.push({
              authGroupName: m.authGroupName,
              authGroupId: m.authGroupId
            })
          }
        });

        this.dropdown.firstVisible = false;
      },
      /**
       * 选择状态变更提醒人员组回调
       */
      onGroupSecondConfirm(value) {
        this.initial.recordStateChangeRemindAuthGroup = [];
        [...value].forEach(m => {
          if (m.selected) {
            this.initial.recordStateChangeRemindAuthGroup.push({
              authGroupName: m.authGroupName,
              authGroupId: m.authGroupId
            })
          }
        });

        this.dropdown.secondVisible = false;
      },
      /**
       * 删除选择的人员组
       * @param param
       */
      handleTagClose(param) {
        switch (param.type) {
          case 0:
            this.initial.editRecordStateAuthGroup.splice(param.index, 1);
            break;
          case 1:
            this.initial.recordStateChangeRemindAuthGroup.splice(param.index, 1);
            break;
        }
      },
      saveStateSettingPopup() {
        (typeof this.confirmfunc === "function") && (this.confirmfunc.call(null, {
          isStateSetting: true,
          recordStateTemplateVO: (() => {
            return {
              recordStateTemplateId: this.initial.recordStateTemplateVO.recordStateTemplateId,
              recordStateTemplateName: this.initial.recordStateTemplateVO.recordStateTemplateName,
              stateCfgList: this.initial.recordStateTemplateVO.stateCfgList
            }
          })(),
          editRecordStateAuthGroup: this.initial.editRecordStateAuthGroup,
          isOpenRecordStateChangeRemind: this.initial.isOpenRecordStateChangeRemind,
          recordStateChangeRemindItemValue: this.initial.recordStateChangeRemindItemValue,
          recordStateChangeRemindAuthGroup: this.initial.recordStateChangeRemindAuthGroup
        }));
        this.autoClose && this.$set(this.get.dataSource, 'showModal', false);
      },
      onVisible(value) {
        value || this.$store.dispatch('setDestroy', {
          compName: ['qStateSettingMdl']
        });
      },
      cancel() {
        this.$set(this.get.dataSource, 'showModal', false);
      }
    }
  }
</script>
