<style lang="scss">
  @include b(q-move-mdl) {
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
      background-color: #fff;
      @include b(card-1) {
        @include b(ivu-card-body) {
          padding: 0;
        }
        @include b(img) {
          text-align: center;
        }
        img {
          width: 200px;
          height: 200px;
        }
      }
      @include b(btn) {
        text-align: center;
        padding: 10px 0;
      }
    }
  }
</style>

<template>
  <Modal v-model="showModal" ref="modal" width="400" class="q-move-mdl" @on-visible-change="onVisible">
    <div slot="header" class="header">
      <span class="header--title">移动</span>
    </div>
    <div class="body">
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
    <div slot="footer">
      <Button type="text" size="large" @click.native="$refs.modal.cancel()">取消</Button>
      <Button type="primary" size="large" @click.native="saveSelMoveModal">确定</Button>
    </div>
  </Modal>
</template>

<script>
  import jTree from '@/components/j-tree/jTree.vue';

  export default {
    name: "q-move-mdl",
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
        return this.$store.getters.getSource('qMoveMdl', 'second').dataSource.showModal
      },
      get() {
        return this.$store.getters.getSource('qMoveMdl', 'second')
      }
    },
    data() {
      return {
        tree: {
          selectTemplateFoldId: '',
          foldName: ''
        },
        treeList: []
      }
    },
    mounted() {
      this._getFoldGroup();
    },
    methods: {
      /**
       * 获取目录接口
       */
      _getFoldGroup() {
        this.treeList = [];
        this.$api.qrcodeInterface.listTemplatefold({}).then(res => {
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
          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => console.error(err))
      },
      /**
       * 素材目录点击回调
       * @param model
       */
      onClick(model) {
        this.tree.selectTemplateFoldId = model.templateFoldId;
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
          compType: 'second',
          compName: ['qMoveMdl']
        });
      },
      /**
       * 保存回调value
       * @returns {*}
       */
      saveSelMoveModal() {
        if (this.$Global.isBlank(this.tree.selectTemplateFoldId)) {
          return this.$Message.info('请选择目录')
        }

        (typeof this.confirmfunc === "function") && (this.confirmfunc.call(null, {
          isMoveFold: true,
          templateFoldId: this.tree.selectTemplateFoldId
        }));
        this.autoClose && this.$set(this.get.dataSource, 'showModal', false);
      }
    }
  }
</script>
