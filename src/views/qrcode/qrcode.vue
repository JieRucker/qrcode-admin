<style lang="scss" scoped>
  @include b(tree) {
    width: 200px;
    height: 100%;
    position: fixed;
    box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
    background-color: #f8f8f8;
    @include m(title) {
      height: 55px;
      padding-left: 16px;
      background-color: #f8f8f8;
      font-size: 16px;
      line-height: 55px;
    }
    @include m(button) {
      position: absolute;
      right: 15px;
      top: 17px;
    }
  }
</style>

<template>
  <div class="qrcode">
    <div class="tree">
      <h2 class="tree--title">产品目录</h2>
      <Button type="default" size="small" class="tree--button" @click="_setFolder">
        新建目录
      </Button>
      <j-tree
        :list="tree.treeList"
        :click="onClick"
        :plus="onPlus"
        :blur="onBlur"
        :remove="onRemove"
        :expand="expandClick"
        :is-open="false">
      </j-tree>
    </div>

    <component
      v-bind:is="currentTabComponent"
      :treeNode="tree.treeNode"
      :treeList="tree.treeList"
    ></component>
  </div>
</template>

<script>
  import jTree from '@/components/j-tree/jTree.vue';
  import qrcodeList from './qrcode-list';
  import batchList from './batch-list';

  export default {
    name: "qrcode",
    components: {
      jTree,
      qrcodeList,
      batchList
    },
    data() {
      return {
        tree: {
          treeNode: null, /*当前选中目录数据*/
          foldName: '', /*目录名称*/
          treeList: [], /*目录数据*/
        },
        currentTab: 'qrcode-list', /*当前组件*/
        tabList: ['qrcode-list', 'batch-list']
      }
    },
    computed: {
      currentTabComponent() {
        return this.currentTab.toLowerCase()
      }
    },
    mounted() {
      this._getFoldGroup();
    },
    methods: {
      /**
       * 获取目录数据
       */
      _getFoldGroup() {
        this.tree.treeList = [];
        this.$api.qrcodeInterface.listTemplatefold()
          .then(res => {
            res = res.data;
            if (res.success) {
              [...res.data].forEach(m => {
                this.tree.treeList.push({
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

              if (this.tree.treeList.length) {
                let [tabA] = this.tabList;
                this.currentTab = '';
                let [first] = this.tree.treeList;
                first.clickNode = true;
                this.tree.treeNode = first;

                this.$Global.timeout(300).then(() => {
                  this.currentTab = tabA;
                });
              } else {
                this.table.body = [];
              }

            } else {
              this.$Message.error(res.retMsg)
            }
          }).catch(err => console.error(err))
      },
      /**
       * 新建根目录
       */
      _setFolder() {
        this.$Modal.confirm({
          title: '新建目录',
          render: (h) => {
            return h('Input', {
              style: {
                marginTop: '10px'
              },
              props: {
                value: this.tree.foldName,
                autofocus: true,
                placeholder: '请输入目录名'
              },
              on: {
                input: val => {
                  this.tree.foldName = val;
                }
              }
            })
          },
          onOk: () => {
            !this.$Global.isBlank(this.tree.foldName) ? (() => {
              this.$api.qrcodeInterface.saveTemplatefold({
                parentTemplateFoldId: -1,
                templateFoldName: this.tree.foldName,
                templateFoldType: 0
              }).then(res => {
                res = res.data;
                if (res.success) {
                  this.$Message.info(res.retMsg);
                  this.tree.foldName = '';
                  this._getFoldGroup();
                }
              }).catch(err => console.log(err))
            })() : this.$Message.info('请输入名称');
          },
          onCancel: () => {
            this.tree.foldName = '';
          }
        })
      },
      /**
       * 目录点击
       */
      onClick(model) {
        let [tabA, tabB] = this.tabList;
        this.currentTab = '';
        this.tree.treeNode = model;

        if (model.name === '批次') {
          this.$Global.timeout(300).then(() => {
            this.currentTab = tabB;
          });
        } else {
          this.$Global.timeout(300).then(() => {
            this.currentTab = tabA;
          });
        }
      },
      /**
       * 新建目录
       * @param model
       */
      onPlus(model) {
        this.$Modal.confirm({
          title: '新建目录',
          render: (h) => {
            return h('Input', {
              style: {
                marginTop: '10px'
              },
              props: {
                value: this.tree.foldName,
                autofocus: true,
                placeholder: '请输入目录名'
              },
              on: {
                input: val => {
                  this.tree.foldName = val;
                }
              }
            })
          },
          onOk: () => {
            if (!this.$Global.isBlank(this.tree.foldName)) {
              this.$api.qrcodeInterface.saveTemplatefold({
                parentTemplateFoldId: model.templateFoldId,
                templateFoldName: this.tree.foldName,
                templateFoldType: 0
              }).then(res => {
                res = res.data;
                if (res.success) {
                  this.tree.foldName = '';
                  this._getFoldGroup();
                }

                this.$Message.info(res.retMsg);
              }).catch(err => console.log(err))
            } else {
              this.$Message.info('请输入名称');
            }
          },
          onCancel: () => {
            this.tree.foldName = '';
          }
        })
      },
      /**
       * 目录展开
       */
      expandClick(model) {
        let node = [...model.childNodes];
        if (model.isExpand) {
          model.loadNode = 1;
          model.loadNode = 2;
          model.isFolder = true;
          model.childNodes = [];
          [...node].forEach(m => {
            model.childNodes.push({
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
          })
        }
      },
      /**
       * 更新目录
       */
      onBlur(event, model) {
        event.target.value !== model.name ? (() => {
          this.$api.qrcodeInterface.updateTemplatefold({
            templatefoldId: model.templateFoldId,
            templatefoldName: event.target.value,
          }).then(res => {
            res = res.data;
            if (res.success) {
              this._getFoldGroup();
            }
            this.$Message.info(res.retMsg);
          }).catch(err => console.log(err))
        })() : null
      },
      /**
       * 移除目录
       */
      onRemove(model) {
        this.$Modal.confirm({
          title: '提示',
          content: `<p>是否删除？</p>`,
          onOk: () => {
            this.$api.qrcodeInterface.removeTemplatefold({
              templateFoldId: model.templateFoldId
            }).then(res => {
              res = res.data;
              if (res.success) {
                this._getFoldGroup();
              }
              this.$Message.info(res.retMsg);
            }).catch(err => console.log(err))
          }
        })
      },
    }
  }
</script>

