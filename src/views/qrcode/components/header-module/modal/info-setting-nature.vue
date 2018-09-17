<style lang="scss">
  @include b(info-setting-nature) {
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
  <Modal v-model="showModal" width="750" class="info-setting-nature"
         @on-visible-change="onVisible">
    <p slot="header" class="header">
      <span class="header--title">基本信息设置</span>
    </p>
    <div class="body">
      <Form label-position="left">
        <FormItem label="谁能设置：" :label-width="110">
          <auther-group v-model="dropdown.visible" :list="dropdown.groupList" :showSetUser="true"
                        @on-confirm="onGroupConfirm">
            <Button type="ghost" slot="button" @click.native="_getGroupList">
              <div class="dropdown__button" style="width: 300px;display: initial">
                <span v-if="!tagList.length">请选择</span>
                <Tag closable @on-close="handleTagClose(index)" style="margin-right: 3px"
                     v-for="(item,index) in tagList" :key="index">
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
      <Button type="primary" size="large" @click="saveInfoSettingPopup">保存</Button>
    </div>
  </Modal>
</template>

<script>
  import autherGroup from "@/components/author-group/auther-group";

  export default {
    name: "info-setting-nature",
    components: {
      autherGroup
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
        return this.$store.getters.getSource('qInfoSettingMdl').dataSource.showModal
      },
      get() {
        return this.$store.getters.getSource('qInfoSettingMdl')
      },
      tagList() {
        return this.$store.getters.getSource('qInfoSettingMdl').dataSource.templateObj.tagList
      }
    },
    data() {
      return {
        initial: new Object(null),
        dropdown: {
          visible: false,
          groupList: [], // 人员组数据
        }
      }
    },
    methods: {
      handleTagClose(index) {
        this.tagList.splice(index, 1);
      },
      _getGroupList() {
        this.dropdown.groupList = [];
        this.$api.authUserInterface.listAuthGroupWithAuthUserInfo()
          .then(res => {
            res = res.data;
            if (res.success) {
              [...res.data].forEach(m => {
                m.selected = false;
                [...this.tagList].forEach(k => (m.authGroupId === k.authGroupId) && (m.selected = true))
              });
              this.dropdown.groupList = res.data;
              this.dropdown.visible = true;
            }
          }).catch(err => console.error(err))
      },
      onGroupConfirm(value) {
        this.get.dataSource.templateObj.tagList = [];
        [...value].forEach(m => {
          if (m.selected) {
            this.tagList.push({
              authGroupName: m.authGroupName,
              authGroupId: m.authGroupId
            })
          }
        });

        this.dropdown.visible = false;
      },
      saveInfoSettingPopup() {
        (typeof this.confirmfunc === "function") && (this.confirmfunc.call(null, {
          isInfoSetting: true,
          editTemplateInfoAuthGroup: this.tagList
        }));
        this.autoClose && this.$set(this.get.dataSource, 'showModal', false);
      },
      onVisible(value) {
        value || this.$store.dispatch('setDestroy', {
          compName: ['qInfoSettingMdl']
        });
      },
      cancel() {
        this.$set(this.get.dataSource, 'showModal', false);
      }
    }
  }
</script>
