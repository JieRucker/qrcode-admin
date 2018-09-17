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
  <Modal v-model="modal.infoSettingModal.show" width="750" class="info-setting-nature"
         @on-ok="saveInfoSettingNature">
    <p slot="header" class="header">
      <span class="header--title">基本信息设置</span>
      <span class="header--desc">开启后允许成员扫码设置地理位置，现场照片等基本信息。</span>
    </p>
    <div class="body">
      <Form :model="modal.infoSettingModal" label-position="left">
        <FormItem label="开启状态：" :label-width="110">
          <Checkbox v-model="modal.infoSettingModal.isOpenState" @on-change="openState">开启</Checkbox>
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
      </Form>
    </div>
  </Modal>
</template>

<script>

  export default {
    name: "info-setting-nature",
    data() {
      return {
        modal: {
          infoSettingModal: {
            show: false,
            isOpenState: true,//开启状态开关
          },
        }
      }
    },
    methods: {
      openState(value) {

      },
      saveInfoSettingNature() {
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
