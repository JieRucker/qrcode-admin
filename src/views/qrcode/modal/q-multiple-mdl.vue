<style lang="scss" scoped>
  @include b(q-multiple-mdl) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
  }
</style>

<template>
  <Modal ref="modal" v-model="showModal" width="950" class="q-multiple-mdl"
         @on-visible-change="onVisible">
    <p slot="header" class="header">
      <span class="header--title">批量创建二维码</span>
    </p>
    <div class="body">
      <div class="body__nav" style="margin-bottom: 10px">
        <Steps :current="currentStep">
          <Step title="上传Excel"></Step>
          <Step title="数据预览"></Step>
          <Step title="设置数据类型"></Step>
          <Step title="批量生成二维码"></Step>
        </Steps>
      </div>

      <component
        v-bind:is="currentTabComponent"
        :currentStep.sync="currentStep"
        :currentTab.sync="currentTab"
      ></component>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
  import infoUpload from './excel/infoUpload';
  import infoTable from './excel/infoTable';
  import infoType from './excel/infoType';
  import infoGenerate from './excel/infoGenerate';

  export default {
    name: "q-multiple-mdl",
    components: {
      infoUpload,
      infoTable,
      infoType,
      infoGenerate
    },
    props: {
      autoClose: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        currentStep: 0, // 当前步骤
        uploadId: null,
        uploader: null, //上传对象
        currentTab: 'infoUpload', // 当前显示组件
      }
    },
    computed: {
      showModal() {
        return this.$store.getters.getSource('qMultipleMdl', 'second').dataSource.showModal
      },
      get() {
        return this.$store.getters.getSource('qMultipleMdl', 'second')
      },
      currentTabComponent() {
        return this.currentTab
      },
    },
    methods: {
      onVisible(value) {
        value || this.$store.dispatch('setDestroy', {
          compType: 'second',
          compName: ['qMultipleMdl']
        });
      }
    }
  }
</script>

