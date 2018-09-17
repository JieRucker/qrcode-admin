<style lang="scss">
  @include b(q-map-mdl) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      @include b(btn) {
        text-align: center;
        padding: 10px 0;
      }
    }
  }
</style>

<template>
  <Modal v-model="showModal" ref="modal" width="800" class="q-map-mdl" @on-visible-change="onVisible">
    <div slot="header" class="header">
      <span class="header--title">地图</span>
    </div>
    <div class="body">
      <j-map @drag="dragMap" :markers="markers" style="width: 100%; height: 400px;"></j-map>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click.native="$refs.modal.cancel()">取消</Button>
      <Button type="primary" size="large" @click.native="saveSelMapModal">确定</Button>
    </div>
  </Modal>
</template>

<script>
  import jMap from '@/components/j-map/jMap';

  export default {
    name: "q-map-mdl",
    components: {
      jMap
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
        return this.$store.getters.getSource('qMapMdl').dataSource.showModal
      },
      get() {
        return this.$store.getters.getSource('qMapMdl')
      }
    },
    data() {
      return {
        markers: [],
        positionResult: null
      }
    },
    mounted() {
      let templateObj = this.get.dataSource.templateObj;

      if (!this.$Global.isBlank(this.get.dataSource.templateObj.longitude) && !this.$Global.isBlank(this.get.dataSource.templateObj.dimension)) {
        this.markers = [
          {
            position: [templateObj.longitude, templateObj.dimension]
          }
        ];
      } else {
        this.markers = []
      }
    },
    methods: {
      /**
       * 拖拽回调
       */
      dragMap(value) {
        this.positionResult = value;
      },
      /**
       * 弹窗关闭destroy
       */
      onVisible(value) {
        value || this.$store.dispatch('setDestroy', {
          compName: ['qMapMdl']
        });
      },
      /**
       * 保存回调value
       * @returns {*}
       */
      saveSelMapModal() {
        (typeof this.confirmfunc === "function") && (this.confirmfunc.call(null, Object.assign({}, this.get.dataSource.templateObj, this.positionResult)));
        this.autoClose && this.$set(this.get.dataSource, 'showModal', false);
      }
    }
  }
</script>
