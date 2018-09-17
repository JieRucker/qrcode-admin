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
    <Modal v-model="modal.stateSettingModal.show" width="750" class="state-setting-nature"
           @on-ok="saveStateSettingNature">
      <p slot="header" class="header">
        <span class="header--title">状态设置</span>
        <span class="header--desc">开启后允许成员变更状态，还能接收异常消息提醒。</span>
      </p>
      <div class="body">
        <Form :model="modal.stateSettingModal" label-position="left">
          <FormItem label="开启状态：" :label-width="110">
            <Checkbox v-model="modal.stateSettingModal.isOpenState" @on-change="openState">开启</Checkbox>
          </FormItem>
          <FormItem label="状态组：" :label-width="110">
            <Dropdown trigger="click" placement="bottom-start" class="dropdown">
              <Button type="ghost">
                <div class="dropdown__button" style="width: 100px;">
                  <span>请选择</span>
                  <Icon type="arrow-down-b" class="dropdown__button--icon"></Icon>
                </div>
              </Button>
              <DropdownMenu slot="list" style="width: 200px;">
                <DropdownItem>消防箱巡检</DropdownItem>
                <DropdownItem>设备状态</DropdownItem>
                <DropdownItem>人员考核结果</DropdownItem>
                <DropdownItem>物品流转状态</DropdownItem>
                <DropdownItem>检验结果</DropdownItem>
                <DropdownItem style="text-align: center" @click.native="newStateGroup">
                  <a href="javascript:;">新建状态组</a>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </FormItem>

          <FormItem label="谁能设置：" :label-width="110">
            <Dropdown trigger="click" placement="bottom-start" class="dropdown">
              <Button type="ghost">
                <div class="dropdown__button" style="width: 300px;">
                  <span>请选择</span>
                  <Icon type="arrow-down-b" class="dropdown__button--icon"></Icon>
                </div>
              </Button>
              <DropdownMenu slot="list" style="width: 250px;" class="dropdown__menu">
                <DropdownItem>
                  <Checkbox> test1[0]<span class="dropdown__menu--remark">空</span></Checkbox>
                </DropdownItem>
                <DropdownItem>
                  <Checkbox> cs[1]<span class="dropdown__menu--remark">asd</span></Checkbox>
                </DropdownItem>
                <DropdownItem>
                  <Checkbox> test[0]<span class="dropdown__menu--remark">空</span></Checkbox>
                </DropdownItem>
                <DropdownItem>
                  <Checkbox> 测试1[0]<span class="dropdown__menu--remark">空</span></Checkbox>
                </DropdownItem>
                <DropdownItem>
                  <Checkbox> 测试[1]<span class="dropdown__menu--remark">啊儿粉</span></Checkbox>
                </DropdownItem>
                <DropdownItem class="dropdown__footer">
                  <span class="dropdown__footer--total">一共选择了0个人员组</span>
                  <Button type="primary" size="small">确定</Button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </FormItem>

          <FormItem label="状态变更提醒：" :label-width="110" class="body__form-remind">
            <Checkbox v-model="modal.stateSettingModal.isOpenRemindState"
                      :disabled="modal.stateSettingModal.isDisabledRemindState"
                      v-if="!modal.stateSettingModal.isDisabledRemindState">开启
            </Checkbox>
            <Tooltip content="请开启状态" placement="top" v-if="modal.stateSettingModal.isDisabledRemindState">
              <Checkbox v-model="modal.stateSettingModal.isOpenRemindState"
                        :disabled="modal.stateSettingModal.isDisabledRemindState">开启
              </Checkbox>
            </Tooltip>
            <p class="body__form-remind--desc">用户需<a href="javascript:;">授权并关注二维码公众号</a>方可接受状态变更通知</p>
          </FormItem>
        </Form>
      </div>
    </Modal>

    <new-state-nature ref="newStateNature"></new-state-nature>
  </div>
</template>

<script>
  import newStateNature from './new-state-nature.vue';

  export default {
    name: "state-setting-nature",
    components: {
      newStateNature
    },
    data() {
      return {
        modal: {
          stateSettingModal: {
            show: false,
            isOpenState: true,//开启状态开关
            isOpenRemindState: false, //状态变更提醒开关
            isDisabledRemindState: false //禁用按钮
          },
        }
      }
    },
    methods: {
      openState(value) {
        this.modal.stateSettingModal.isDisabledRemindState = value ? false : true;
      },
      newStateGroup() {
        this.$refs.newStateNature.modal.newStateModal.show = true;
      },
      saveStateSettingNature() {
        this.$axios.post(`${this.$api.updateShop}`, $.param({
          provinceId: this.$refs.addressPicker.address.selectProvince,
          cityId: this.$refs.addressPicker.address.selectCity,
        })).then((res) => {
          if (res.data.success) {
            this.$Message.info('成功！');
          } else {
            this.$Message.info(res.data.retMsg);
          }
        }).catch((err) => {
          console.log(err)
        })
      },
    }
  }
</script>
