<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .qrcode-detail__right {
    .link-module-popup {
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
          @include module-control-label;
        }
        .module-control-content {
          float: left;
          width: 75%;
          .table-panel {
            .tab-list {
              width: 100%;
              padding: 5px;
              background-color: #f5f5f5;
              border: 1px solid #dddee1;
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
                }
              }
            }
            .uftps {
              margin-top: 6px;
              .add-link {
                display: block;
                text-align: center;
                border: 1px solid #dddee1;
                line-height: 42px;
                background-color: #fff;
                font-size: 14px;
                position: relative;
                top: -7px;
                color: #909090;
              }
            }
          }
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveLinkModulePopup">
    <a href="javascript:;" class="module-title">链接模块操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">模块标题</label>
      <div class="module-control-content">
        <Input style="width: 300px" v-model="block.moduleTitle"></Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">描述</label>
      <div class="module-control-content">
        <Input style="width: 300px" v-model="initial.moduleDesc"></Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label"></label>
      <div class="module-control-content">
        <div class="table-panel">
          <table class="tab-list">
            <thead>
            <tr>
              <th width="130" class="tal">链接名称</th>
              <th width="*" class="tal">链接地址</th>
              <th width="50" class="cet">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr height="40px" v-for="(item,index) in initial.linkList">
              <td class="tal">
                <Input placeholder="请输入链接名称" v-model="item.linkName" style="width: 110px"></Input>
              </td>
              <td class="tal">
                <Input placeholder="请输入链接地址" v-model="item.linkUrl" style="width: 240px"></Input>
              </td>
              <td class="cet">
                <a href="javascript:;" @click="deleteIcon(index)">删除</a>
              </td>
            </tr>
            </tbody>
          </table>
          <p class="uftps">
            <a href="javascript:;" class="add-link" @click="addNewLink">
              <Icon type="plus-round" size="16"></Icon>
              <span>添加链接</span>
            </a>
          </p>
        </div>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label"></label>
      <div class="module-control-content">
        <label class="checkbox-inline">
          <Checkbox v-model="initial.showWxTip">微信环境下跳转提示
          </Checkbox>
        </label>
      </div>
    </div>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';

  export default {
    name: "link-module",
    components: {
      popupModal
    },
    props: {
      currentTab: String,
      block: Object,
    },
    data() {
      return {
        initial: new Object(null)
      }
    },
    mounted() {
      this.initial = new Object(null);

      this.$api.qrcodeInterface.getModule({
        moduleId: this.block.moduleId
      }).then(res => {
        if (res.data.success) {
          new ToolFunctor(this)._get({...res.data.data});
        }
      }).catch(err => {
        console.error(err)
      });
    },
    methods: {
      /**
       * 添加链接
       */
      addNewLink() {
        this.initial.linkList.push({
          linkName: '',
          linkUrl: ''
        })
      },
      /**
       * 移除链接
       * @param index
       */
      deleteIcon(index) {
        this.initial.linkList.splice(index, 1)
      },
      /**
       * 保存链接
       */
      saveLinkModulePopup() {
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
      target.linkList = (() => {
        let a = null;

        if (res.moduleObject) {
          a = res.moduleObject.linkList
        } else {
          a = []
        }

        return a;
      })();

      // 模块描述
      target.moduleDesc = res.moduleObject ? res.moduleObject.moduleDesc : '';
      // 微信环境下跳转提示 0 否 1 是
      target.showWxTip = res.moduleObject ? res.moduleObject.showWxTip : false;

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);
      let imageList = this.tis.initial.imageList;
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
            moduleDesc: this.tis.initial.moduleDesc,
            showWxTip: this.tis.initial.showWxTip,
            linkList: this.tis.initial.linkList
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>

