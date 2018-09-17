<style lang="scss">
  @include b(q-location-mdl) {
    @include b(ivu-modal-body) {
      padding: 0;
    }
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      @include b(l-list) {
        max-height: 400px;
        overflow-y: auto;
        @include e(item) {
          display: flex;
          font-size: 14px;
          justify-content: space-between;
          height: 35px;
          line-height: 35px;
          color: #333;
          width: 100%;
          padding: 0 10px;
          cursor: pointer;
          @include m(name) {
            width: 45%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          @include m(desc) {
            text-align: right;
            width: 55%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
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
  <Modal v-model="showModal" width="500" class="q-location-mdl" @on-visible-change="onVisible"
         @on-ok="saveSelLocationModal">
    <p slot="header" class="header">
      <span class="header--title">选择定位</span>
    </p>
    <div class="body">
      <Row>
        <Col>
          <ul class="l-list">
            <li :class="[{'l-list__item selected':item.selected},'l-list__item']"
                v-for="(item,index) in table.body" @click="changeList(index)">
              <p class="l-list__item--name">
                <Checkbox v-model="item.selected">&nbsp;<span
                  :title="item.moduleTitle">{{item.moduleTitle}}</span></Checkbox>
              </p>
            </li>
          </ul>
          <p style="margin: 10px;text-align: center;" v-if="!table.body.length">暂无数据</p>
        </Col>
      </Row>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "q-location-mdl",
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
        return this.$store.getters.getSource('qLocationMdl').dataSource.showModal
      },
      get() {
        return this.$store.getters.getSource('qLocationMdl')
      }
    },
    data() {
      return {
        table: {
          body: [],
          args: {
            startRow: 0,
            pageSize: 10,
            currentPage: 1,
            totalCount: 0
          }
        },
      }
    },
    mounted() {
      this._getModuleList()
    },
    methods: {
      /**
       * 获取二维码列表接口
       */
      _getModuleList() {
        this.table.body = [];
        this.$api.qrcodeInterface.listModule({
          templateId: this.$route.query.templateId
        }).then(res => {
          res = res.data;
          if (res.success) {
            [...res.data.moduleVOList].forEach(m => {
              m.selected = (() => {
                let a = false;
                if (this.get.dataSource.templateObj.pageNavigationId === m.moduleId) a = true;
                return a;
              })()
            });
            this.table.body = res.data.moduleVOList;
          }
        }).catch(err => {
          console.error(err)
        })
      },
      /**
       * 改变选中列表
       * @param index
       */
      changeList(index) {
        this.table.body.forEach(m => m.selected = false);
        this.table.body[index].selected = true;
      },
      /**
       * 切换分页
       * @param targetPage
       */
      changePage(targetPage) {
        this.table.args.currentPage = targetPage;
        this.table.args.startRow = (targetPage - 1) * this.table.args.pageSize;
        this._getModuleList();
      },
      /**
       * 弹窗关闭destroy
       */
      onVisible(value) {
        value || this.$store.dispatch('setDestroy', {
          compName: ['qLocationMdl']
        });
      },
      /**
       * 保存回调value
       * @returns {*}
       */
      saveSelLocationModal() {
        const template = (() => {
          let a = null;
          [...this.table.body].forEach(m => {
            if (m.selected) {
              a = new Object({
                pageNavigationName: m.moduleTitle,
                pageNavigationId: m.moduleId,
                isPageNavigation: true
              })
            }
          });
          return a;
        })();

        if (!template) {
          return this.$Message.info('请选择定位');
        }

        (typeof this.confirmfunc === "function") && (this.confirmfunc.call(null, template));
        this.autoClose && this.$set(this.get.dataSource, 'showModal', false);
      }
    }
  }
</script>
