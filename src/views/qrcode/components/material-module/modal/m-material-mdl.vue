<style lang="scss">
  @include b(m-material-mdl) {
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
      @include b(material-left) {
        @include e(title) {
          color: #f8f8f8;
          font-size: 16px;
          line-height: 56px;
          height: 56px;
          padding-left: 16px;
          background-color: #f8f8f8;
          @include m(name) {
            color: #323232;
            font-weight: 400;
          }
        }
        @include e(tree) {
          height: 500px;
          padding-bottom: 4px;
          background-color: #f8f8f8;
          @include b(l-list) {
            z-index: 8;
            position: relative;
            min-height: 200px;
            height: 100%;
            overflow: auto;
            @include e(item) {
              height: 36px;
              line-height: 36px;
              text-align: center;
              background: #eee;
              color: #56A848;
            }
          }
        }
      }
      @include b(material-right) {
        @include e(search) {
          padding: 10px 15px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
          @include m(label) {
            padding: 7px 0;
          }
          @include m(input) {
            float: right;
          }
        }
        @include e(content) {
          padding: 10px;
          @include b(l-list) {
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
    }
  }
</style>

<template>
  <Modal v-model="showModal" width="800" class="m-material-mdl" @on-visible-change="onVisible"
         @on-ok="saveSelMaterialModal">
    <p slot="header" class="header">
      <span class="header--title">选择素材</span>
    </p>
    <div class="body">
      <Row>
        <Col span="6" push="0" class="material-left">
          <div class="material-left__title">
            <span class="material-left__title--name">素材目录</span>
          </div>
          <div class="material-left__tree">
            <j-tree
              :list="treeList"
              :click="onClick"
              :expand="expandClick"
              :show-plus-icon="false"
              :show-edit-icon="false"
              :show-delete-icon="false"
              :is-open="false">
            </j-tree>
          </div>
        </Col>
        <Col span="18" push="0" class="material-right">
          <Row class="material-right__search">
            <Col span="12" class="material-right__search--label">素材目录</Col>
            <Col span="12">
              <Input style="width: 200px" v-model="table.header.searchKey" class="material-right__search--input"
                     placeholder="请输入素材名称">
              <Button slot="append" icon="ios-search" @click.native="handleSearch"></Button>
              </Input>
            </Col>
          </Row>
          <Row class="material-right__content">
            <Col>
              <ul class="l-list">
                <li :class="[{'l-list__item selected':item.selected},'l-list__item']"
                    v-for="(item,index) in table.body" @click="changeCard(index)">
                  <p class="l-list__item--name">
                    <Checkbox v-model="item.selected">&nbsp;<span
                      :title="item.templateName">{{item.templateName}}</span></Checkbox>
                  </p>
                  <p class="l-list__item--desc">
                    {{item.createDate}}
                  </p>
                </li>
              </ul>
              <p style="margin: 10px;text-align: center;" v-if="!table.body.length">暂无数据</p>
              <div style="margin: 10px;overflow: hidden" v-if="table.body.length">
                <div style="float: right;">
                  <Page :total="table.args.totalCount" :current="table.args.currentPage"
                        :page-size="table.args.pageSize"
                        show-total @on-change="changePage"></Page>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  </Modal>
</template>

<script>
  import jTree from '@/components/j-tree/jTree.vue';

  export default {
    name: "m-material-mdl",
    components: {
      jTree
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
        return this.$store.getters.getSource('mMaterialMdl').dataSource.showModal
      },
      get() {
        return this.$store.getters.getSource('mMaterialMdl')
      }
    },
    data() {
      return {
        tree: {
          selectTemplateFoldId: '',
          foldName: ''
        },
        table: {
          header: {
            searchKey: ''
          },
          body: [],
          args: {
            startRow: 0,
            pageSize: 10,
            currentPage: 1,
            totalCount: 0
          }
        },
        treeList: []
      }
    },
    mounted() {
      this._getFoldGroup();
    },
    methods: {
      /**
       * 获取素材树接口
       */
      _getFoldGroup() {
        this.treeList = [];
        this.$api.qrcodeInterface.listTemplatefold({templateFoldType: 1}).then(res => {
          if (res.data.success) {
            [...res.data.data].forEach(m => {
              this.treeList.push({
                parentTemplateFoldId: m.parentTemplateFoldId,
                id: m.templateFoldId,
                templateFoldId: m.templateFoldId,
                name: m.templateFoldName,
                open: false,
                isFolder: false,
                clickNode: false,
                isEdit: false,
                childNum: m.childNodes ? m.childNodes.length : 0,
                childNodes: m.childNodes ? m.childNodes : []
              })
            });

            if (this.treeList.length > 0) {
              this.treeList[0].clickNode = true;

              this.tree.selectTemplateFoldId = this.treeList[0].templateFoldId;
              this._getMaterialList();
            }

          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      /**
       * 获取素材列表接口
       */
      _getMaterialList() {
        this.table.body = [];
        this.$api.qrcodeInterface.listTemplate({
          templateName: this.table.header.searchKey,
          templateFoldId: this.tree.selectTemplateFoldId,
          templateType: 1,
          startRow: this.table.args.startRow,
          pageSize: this.table.args.pageSize
        }).then(res => {
          res = res.data;
          if (res.success) {
            [...res.data.dbPageList].forEach(m => {
              m.selected = (() => {
                let a = false;
                if (this.get.dataSource.templateObj.templateId === m.templateId) a = true;
                return a;
              })()
            });
            this.table.body = res.data.dbPageList;
            this.table.args.totalCount = res.data.count;
          }
        }).catch(err => {
          console.error(err)
        })
      },
      /**
       * 搜索
       */
      handleSearch() {
        this._getMaterialList();
      },
      /**
       * 切换分页
       * @param targetPage
       */
      changePage(targetPage) {
        this.table.args.currentPage = targetPage;
        this.table.args.startRow = (targetPage - 1) * this.table.args.pageSize;
        this._getMaterialList();
      },
      /**
       * 改变选中维护模板
       * @param index
       */
      changeCard(index) {
        this.table.body.forEach(m => m.selected = false);
        this.table.body[index].selected = true;
      },
      /**
       * 素材目录点击回调
       * @param model
       */
      onClick(model) {
        this.tree.selectTemplateFoldId = model.templateFoldId;
        this._getMaterialList();
      },
      /**
       * 目录展开回调
       * @param model
       */
      expandClick(model) {
        let childNodes = [...model.childNodes];

        if (model.isExpand) {
          model.loadNode = 1;
          model.loadNode = 2;
          model.isFolder = true;
          model.childNodes = [];
          [...childNodes].forEach((m) => {
            model.childNodes.push({
              parentTemplateFoldId: m.parentTemplateFoldId,
              id: m.templateFoldId,
              templateFoldId: m.templateFoldId,
              name: m.templateFoldName,
              open: false,
              isFolder: false,
              clickNode: false,
              isModify: false,
              childNum: m.childNodes ? m.childNodes.length : 0,
              childNodes: m.childNodes ? m.childNodes : []
            })
          })
        }
      },
      /**
       * 弹窗关闭destroy
       */
      onVisible(value) {
        value || this.$store.dispatch('setDestroy', {
          compName: ['mMaterialMdl']
        });
      },
      /**
       * 保存回调value
       * @returns {*}
       */
      saveSelMaterialModal() {
        const template = (() => {
          let a = null;
          [...this.table.body].forEach(m => m.selected && (a = m));
          return a;
        })();

        if (!template) {
          return this.$Message.info('请选择素材');
        }
        (typeof this.confirmfunc === "function") && (this.confirmfunc.call(null, template));
        this.autoClose && this.$set(this.get.dataSource, 'showModal', false);
      }
    }
  }
</script>
