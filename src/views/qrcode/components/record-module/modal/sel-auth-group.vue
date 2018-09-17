<style lang="scss">
  @include b(sel-auth-group) {
    @include b(panel-top) {
      @include b(l-list) {
        @include e(item) {
          display: flex;
          font-size: 14px;
          height: 35px;
          line-height: 35px;
          color: #333;
          padding: 0 10px;
          cursor: pointer;
        }
      }
    }
    @include b(panel-bottom) {
      border-top: 1px solid #e9eaec;
      margin-top: 20px;
      padding: 10px;
      max-height: 412px;
      overflow-y: auto;
      @include e(title) {
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        float: left;
      }
      @include b(l-list) {
        @include e(item) {
          display: flex;
          font-size: 14px;
          height: 35px;
          line-height: 35px;
          color: #333;
          width: 100%;
          padding: 0 10px;
          cursor: pointer;
          @include m(content) {
            margin-left: 20px;
            color: #999;
            width: 150px;
            overflow: hidden;
            display: inline-block;
            vertical-align: middle;
          }
          &:hover {
            background-color: #eee;
          }
          &.selected {
            .l-list__item--name {
              color: #2d8cf0;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="body">
    <div class="sel-auth-group">
      <div style="min-height: 310px;">
        <div class="panel-top">
          <ul class="l-list">
            <li class="l-list__item">
              <p>
                <Checkbox v-model="isOpenAll" @click.native="selectAllAuthUser">&nbsp;所有人</Checkbox>
              </p>
              <p style="color: #999;margin-left: 20px">选择"所有人"后,非授权用户也能添加记录</p>
            </li>
          </ul>
        </div>
        <div class="panel-bottom">
          <div>
            <p class="panel-bottom__title">用户组</p>
            <Button type="default" size="small" style="float: right;margin-top: 10px;" @click="buildGroup">新建用户组
            </Button>
          </div>
          <ul class="l-list">
            <li :class="[{'l-list__item selected':item.selected},'l-list__item']" v-for="(item,index) in authList"
                @click="changeItem(index)">
              <div class="l-list__item--name">
                <Checkbox v-model="item.selected">&nbsp;{{item.authGroupName}}</Checkbox>
              </div>
              <div class="l-list__item--content">
                <ul class="clearfix" style="display: flex">
                  <li>成员：</li>
                  <li v-for="(group,groupIndex) in item.authUserInfoList" style="margin-right: 2px">
                    {{group.authUserName}}<span v-if="groupIndex !== item.authUserInfoList.length - 1">、</span>
                  </li>
                  <li v-if="!item.authUserInfoList.length">空</li>
                </ul>
              </div>

            </li>
          </ul>
        </div>
      </div>
      <div class="footer" style="text-align: center;">
        <Button type="default" size="large" v-if="showStep" @click="prevStep">上一步</Button>
        <Button type="primary" size="large" v-if="showStep" @click="saveModule({type:0})">保存</Button>
        <Button type="primary" size="large" v-if="!showStep" @click="saveModule({type:1})">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "sel-auth-group",
    props: {
      showStep: {
        type: Boolean,
        default: true
      },
      currentModal: String,
    },
    data() {
      return {
        isOpenAll: false,
        authList: []
      }
    },
    computed: {
      get() {
        return this.$store.getters.getSource('qRecordMdl')
      }
    },
    mounted() {
      this._getGroupList();
    },
    methods: {
      /**
       * 获取维护组
       * @private
       */
      _getGroupList() {
        this.authList = [];
        this.$api.authUserInterface.listAuthGroupWithAuthUserInfo()
          .then(res => {
            res = res.data;
            if (res.success) {
              [...res.data].forEach(m => {
                m.selected = (() => {
                  let a = false;
                  [...this.get.dataSource.templateObj.authGroupList].forEach(k => (m.authGroupId === k.authGroupId) && (a = true));
                  return a;
                })();
              });

              this.isOpenAll = this.get.dataSource.templateObj.isOpenAll;
              this.authList = res.data;
            }
          }).catch(err => console.error(err))
      },
      /**
       * 改变选中维护组
       * @param index
       */
      changeItem(index) {
        this.authList[index]['selected'] = !this.authList[index]['selected'];
        this.isOpenAll = false;
      },
      /**
       * 新建维护组
       */
      buildGroup() {
        this.$Modal.confirm({
          title: '新建维护组',
          render: (h) => {
            return h('div', [
              h('Input', {
                style: {
                  marginTop: '10px'
                },
                props: {
                  value: this.groupName,
                  placeholder: '请输入名称'
                },
                on: {
                  input: (val) => {
                    this.groupName = val;
                  }
                }
              })
            ])
          },
          onOk: () => {
            if (!this.$Global.isBlank(this.groupName)) {
              this.$api.authUserInterface.saveAuthGroup({
                authGroupName: this.groupName
              }).then(res => {
                res = res.data;
                if (res.success) {
                  this.$Message.info('成功');
                  this._getGroupList();
                }
              }).catch(err => console.error(err))
            } else {
              this.$Message.info('请输入名称');
            }
          },
          onCancel: () => {
            this.groupName = '';
          }
        });
      },
      /**
       * 选中所有人
       */
      selectAllAuthUser() {
        this.authList.forEach(m => m.selected = false)
      },
      /**
       * 上一步
       */
      prevStep() {
        this.$emit('update:currentModal', this.$Global.setValue('sel-record-tpl'));
      },
      /**
       * 保存
       */
      saveModule(param) {
        switch (param.type) {
          case 0:
            this.get.dataSource.initial.recordList.push({
              recordTemplateName: this.get.dataSource.templateObj.recordTemplateName,
              recordTemplateId: this.get.dataSource.templateObj.recordTemplateId,
              isOpenAll: this.isOpenAll,
              authGroupList: (() => {
                let a = [];
                [...this.authList].forEach(k => {
                  if (k.selected) {
                    a.push({
                      authGroupName: k.authGroupName,
                      authGroupId: k.authGroupId
                    })
                  }
                });
                return a;
              })()
            });
            break;
          case 1:
            let index = this.get.dataSource.templateObj.currentIndex;
            this.get.dataSource.initial.recordList[index].isOpenAll = this.isOpenAll;
            this.get.dataSource.initial.recordList[index].authGroupList = (() => {
              let a = [];
              [...this.authList].forEach(k => {
                if (k.selected) {
                  a.push({
                    authGroupName: k.authGroupName,
                    authGroupId: k.authGroupId
                  })
                }
              });
              return a;
            })();
            break;
        }

        this.$set(this.get.dataSource, 'showModal', false)
      }
    }
  }
</script>

