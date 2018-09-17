<template>
  <div class="green-layer">
    <div class="module-icon-box">
      <i :class="'iconfont i-icon '+ icon.iconClass" v-for="icon in moduleIcon"
         v-if="layer.moduleTypeAlias === icon.iconName"></i>
      <span class="module-text">{{layer.moduleTxt}}</span>
    </div>
    <div class="btn-group clearfix">
      <div class="group-item">
        <div v-if="isFold" @click.stop="expandGroupItem(index)">
          <i class="icon fold" title="点击展开"></i>
          <span>展开</span>
        </div>
        <div @click.stop="expandGroupItem(index)" v-else>
          <i class="icon unfold" title="点击折叠"></i>
          <span>折叠</span>
        </div>
      </div>
      <div class="group-item">
        <div v-if="isUsed" @click.stop="usingGroupItem(index)">
          <i class="icon using" title="点击禁用"></i>
          <span>禁用</span>
        </div>
        <div @click.stop="usingGroupItem(index)" v-else>
          <i class="icon no-using" title="点击启用"></i>
          <span>启用</span>
        </div>
      </div>
      <div class="group-item">
        <div @click.stop="deleteGroupItem(index)">
          <i class="icon delete" title="点击删除"></i>
          <span>删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "green-layer",
    props: {
      moduleLayer: Array,
      layer: Object,
      index: Number,
      tis: null
    },
    computed: {
      isFold() {
        return this.layer.isFold === 1
      },
      isUsed() {
        return this.layer.isUsed === 1
      }
    },
    data() {
      return {
        moduleIcon: [
          {
            iconName: 'imgs-module',
            iconClass: 'icon-tupian'
          },
          {
            iconName: 'imgs-txt-module',
            iconClass: 'icon-31tuwenxiangqing'
          },
          {
            iconName: 'product-setting-module',
            iconClass: 'icon-chanpincanshu'
          },
          {
            iconName: 'file-module',
            iconClass: 'icon-wenjianliebiao'
          },
          {
            iconName: 'material-module',
            iconClass: 'icon-wendang'
          },
          {
            iconName: 'imgs-group-module',
            iconClass: 'icon-tuku'
          },
          {
            iconName: 'link-module',
            iconClass: 'icon-fenxianglianjie'
          },
          {
            iconName: 'card-module',
            iconClass: 'icon-mingpian'
          },

          {
            iconName: 'video-module',
            iconClass: 'icon-shipin'
          },
          {
            iconName: 'contact-info-module',
            iconClass: 'icon-lianxiwomen'
          },
          {
            iconName: 'classify-module',
            iconClass: 'icon-fenlei'
          },
          {
            iconName: 'web-nav-module',
            iconClass: 'icon-icon-'
          },
          {
            iconName: 'audio-module',
            iconClass: 'icon-yinleyinpin'
          },
          {
            iconName: 'record-module',
            iconClass: 'icon-icon-test'
          }
        ]
      }
    },
    methods: {
      /**
       * 展开、收起模块
       * @param index
       */
      expandGroupItem(index) {
        this.$api.qrcodeInterface.updateModuleStateFold({
          moduleId: this.moduleLayer[index].moduleId, // 模块编号
          isFold: this.$Global.bool2Int(!this.moduleLayer[index].isFold)
        }).then(res => {
          if (res.data.success) {
            if ((() => {
              return this.moduleLayer[index].isFold
            })() !== this.$Global.bool2Int(true)) {
              this.moduleLayer[index].isFold = this.$Global.bool2Int(true);
              this.$Message.success('折叠成功');
            } else {
              this.moduleLayer[index].isFold = this.$Global.bool2Int(false);
              this.$Message.success('展开成功');
            }
          }
        }).catch(err => console.error(err))
      },
      /**
       * 启用、停用模块
       * @param index
       */
      usingGroupItem(index) {
        this.$api.qrcodeInterface.updateModuleState({
          moduleId: this.moduleLayer[index].moduleId, // 模块编号
          isUsed: this.$Global.bool2Int(!this.moduleLayer[index].isUsed)
        }).then(res => {
          if (res.data.success) {
            if ((() => {
              return this.moduleLayer[index].isUsed
            })() !== this.$Global.bool2Int(true)) {
              this.moduleLayer[index].isUsed = this.$Global.bool2Int(true);
              this.$Message.success('启用成功');
            } else {
              this.moduleLayer[index].isUsed = this.$Global.bool2Int(false);
              this.$Message.success('停用成功');
            }
          }
        }).catch(err => console.error(err))
      },
      /**
       * 删除模块
       * @param index
       */
      deleteGroupItem(index) {
        const resetLayer = () => {
          this.$api.qrcodeInterface.removeModule({
            moduleId: this.moduleLayer[index].moduleId, // 模块编号
            templateId: this.$route.query.templateId
          }).then(res => {
            if (res.data.success) {
              this.tis.initModulelist({
                templateId: this.$route.query.templateId
              });
            }
          }).catch(err => {
            console.error(err)
          })
        };
        this.$Modal.confirm({
          title: '提示',
          content: '<p>删除后不可恢复，确定删除吗？</p>',
          onOk: () => {
            resetLayer();
          }
        });
      }
    }
  }
</script>
