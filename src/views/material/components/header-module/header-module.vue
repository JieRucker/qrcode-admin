<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__right {
    .header-module-popup {
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
          padding: .344rem .75rem;
          &.select-address {
            @include b(l-list) {
              @include e(item) {
                float: left;
                margin-bottom: 5px;
              }
            }
          }
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveHeaderModulePopup">
    <a href="javascript:;" class="module-title">素材设置操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">素材名称</label>
      <div class="module-control-content">
        <Input style="width: 300px"
               v-model="block.moduleTitle"
               :maxlength="100">
        </Input>
        <span>{{block.moduleTitle.length}}/100</span>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">地域显示设置</label>
      <div class="module-control-content">
        <RadioGroup v-model="initial.isOpenCityDisplay">
          <Radio :label="index" v-for="(item,index) in stateList" :key="index">{{item.label}}
          </Radio>
        </RadioGroup>
      </div>
    </div>
    <div class="module-group clearfix" v-if="initial.isOpenCityDisplay !== 0">
      <label class="module-control-label">设置显示地区</label>
      <div class="module-control-content">
        <Select v-model="address.selectProvince" style="width:150px" ref="province"
                @on-change="changeProvince">
          <Option v-for="item in address.provinceList" :value="item.value" :key="item.value">
            {{item.label}}
          </Option>
        </Select>
        <Select v-model="address.selectCity" style="width:150px" ref="city">
          <Option v-for="item in address.cityList" :value="item.value" :key="item.value">
            {{item.label}}
          </Option>
        </Select>
        <Button type="ghost" @click="addressBtn">确定添加</Button>
      </div>
    </div>
    <div class="module-group clearfix" v-if="initial.isOpenCityDisplay !== 0">
      <label class="module-control-label">已设置地区</label>
      <div class="module-control-content select-address">
        <ul class="l-list">
          <li class="l-list__item" v-for="(item,index) in initial.cityList">
            <Tag closable :name="index" @on-close="handleTagClose">{{item}}</Tag>
          </li>
          <li class="l-list__item" v-if="initial.cityList && !initial.cityList.length">不限</li>
        </ul>
      </div>
    </div>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';

  export default {
    name: "header-module",
    components: {
      popupModal
    },
    props: {
      currentTab: String,
      block: Object,
    },
    data() {
      return {
        initial: new Object(null),
        address: {
          selectProvince: -1, // 选中省份
          selectCity: -1, // 选中城市
          provinceList: [
            {
              label: '省份',
              value: -1
            },
            {
              label: '浙江省',
              value: 0
            }
          ], // 省份列表
          cityList: [
            {
              label: '市',
              value: -1
            },
            {
              label: '杭州',
              value: 0
            }
          ] // 城市列表
        },
        stateList: [
          {
            label: '不设置',
            value: 0
          },
          {
            label: '设置',
            value: 1
          }
        ]
      }
    },
    mounted() {
      new ToolFunctor(this)._get(this.block);
      console.log(this.block)
    },
    methods: {
      /**
       * 添加地址
       * @returns {*}
       */
      addressBtn() {
        let selectProvince = this.address.selectProvince;
        let selectCity = this.address.selectCity;

        const assign = (arr, label, value) => {
          arr.push(label)
        };

        const run = (() => {
          return selectProvince !== -1 ? (() => {
            const filter = (() => {
              return (list, selectedSingle, select, showToast) => {
                for (let i = 0, len = list.length; i < len; i++) {
                  if (list[i] === selectedSingle) {
                    return this.$Message.info(showToast);
                  }
                }

                assign(list, selectedSingle, select);
              }
            })();

            return selectCity !== -1 ? (() => {
              let selectedSingle = this.$refs.city.selectedSingle;
              filter(this.initial.cityList, selectedSingle, this.address.selectCity, '该城市已添加');
            })() : (() => {
              let selectedSingle = this.$refs.province.selectedSingle;
              filter(this.initial.cityList, selectedSingle, this.address.selectProvince, '该省份已添加');
            })()
          })() : this.$Message.info('请选择省份')
        });

        return run();
      },
      /**
       * 切换省份
       * @param value
       */
      changeProvince(value) {
        if (value === -1) {
          this.address.selectCity = -1;
        }
      },
      /**
       * 移除地址
       * @param event
       * @param index
       */
      handleTagClose(event, index) {
        this.initial.cityList.splice(index, 1);
      },
      /**
       * 保存基本信息
       */
      saveHeaderModulePopup() {
        let param = new ToolFunctor(this)._set();
        this.$api.qrcodeInterface.updateSingleMaterial(param).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
          }
        }).catch(err => console.error(err))
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

    _get(res) {
      let target = new Object(null);
      // 已设置地区列表
      target.cityList = (res.moduleMaterialInfo && res.moduleMaterialInfo.cityList) ? res.moduleMaterialInfo.cityList : [];
      // 不设置 0 设置 1
      target.isOpenCityDisplay = res.moduleMaterialInfo ? res.moduleMaterialInfo.isOpenCityDisplay : 0;

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);
      target.templateFoldId = this.tis.$route.query.templateFoldId;
      target.templateId = this.tis.$route.query.templateId;
      target.templateName = this.tis.block.moduleTitle;
      target.moduleMaterialInfoJson = (() => {
        let options = {
          templateId: this.tis.$route.query.templateId,
          isOpenCityDisplay: this.tis.initial.isOpenCityDisplay,
          cityList: (() => {
            let a = [];
            [...this.tis.initial.cityList].forEach(m => {
              a.push(this.tis.$Global.trim(m))
            });
            return a;
          })(),
          cover: {
            imageName: '',
            bucketName: '',
            ossKey: '',
            imageUrl: '',
            fileSize: '',
            id: ''
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>
