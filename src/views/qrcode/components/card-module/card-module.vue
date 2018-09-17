<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .qrcode-detail__right {
    .card-module-popup {
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
          .card-panel {
            &-head {
              border: 1px solid #dddee1;
              padding: 8px 10px 8px 0;
              .pull-right {
                float: right;
                .card-refresh {
                  cursor: pointer;
                  margin-left: 10px;
                  vertical-align: middle;
                }
              }
            }
            &-content {
              border-right: 1px solid #dddee1;
              border-left: 1px solid #dddee1;
              border-bottom: 1px solid #dddee1;
              padding: 10px;
              background-color: #fff;
              font-size: 14px;
              max-height: 320px;
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveCardModulePopup">
    <a href="javascript:;" class="module-title">名片模块操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">模块标题</label>
      <div class="module-control-content">
        <Input style="width: 300px" v-model="block.moduleTitle"></Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label"></label>
      <div class="module-control-content">
        <div class="card-panel">
          <div class="card-panel-head clearfix">
            <div class="pull-right">
              <Button @click="cardDetail">新建名片</Button>
              <span class="card-refresh">
                <Icon type="refresh" size="16" @click.native="onRefresh"></Icon>
              </span>
            </div>
          </div>
          <div class="card-panel-content">
            <RadioGroup v-model="initial.cardId" vertical>
              <Radio :label="item.cardId" v-for="(item,index) in initial.cardList" :key="index">{{item.cardBaseInfo.fullName}}</Radio>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';

  export default {
    name: "card-module",
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
      }
    },
    mounted() {
      this._initData();
    },
    methods: {
      /**
       * 初始化数据
       * @private
       */
      _initData() {
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
      /**
       * 名片详情
       */
      cardDetail() {
        const routeData = this.$router.resolve({
          name: "card-detail",
          query: {}
        });
        window.open(routeData.href, '_blank');
      },
      /**
       * 保存名片
       * @returns {*}
       */
      saveCardModulePopup() {
        if (!this.initial.cardId) {
          return this.$Message.info('请选择名片');
        }

        let param = new ToolFunctor(this)._set();
        this.$api.qrcodeInterface.updateModule(param).then(res => {
          res = res.data;
          if (res.success) {
            this.$Message.info('成功');
          }
        }).catch(err => {
          console.error(err)
        })
      },
      /**
       * 刷新
       */
      onRefresh() {
        this._initData();
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

    listCard(param = {
      cardName: '',
      cardFoldId: '174c59b1cd6000',
      startRow: 0,
      pageSize: 100
    }) {
      let promise;
      promise = new Promise((resolve, reject) => {
        //做一些异步操作
        this.tis.$api.cardInterface.listCard(param).then(res => {
          res = res.data;
          res.success && resolve(res.data);
        }).catch(err => {
          console.error(err)
        });
      });
      return promise;
    }

    _get(res) {
      let target = new Object(null);
      // 名片展示列表数据
      target.cardList = (() => {
        let a = [];
        this.listCard().then((resolve) => {
          resolve.dbPageList.forEach(m => a.push(m));
        });
        return a;
      })();

      target.cardId = res.moduleObject ? res.moduleObject.cardId : null;

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
            cardId: this.tis.initial.cardId
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>
