<style lang="scss">
  @include b(q-record-mdl) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
      .ivu-tabs-bar {
        margin-bottom: 0;
      }
    }

    @include b(body) {

    }
  }
</style>

<template>
  <Modal ref="modal" v-model="showModal" width="800" class="q-record-mdl"
         @on-visible-change="onVisible">
    <p slot="header" class="header" v-if="currentNativeModal === 'sel-record-tpl'">选择维护模板</p>
    <p slot="header" class="header" v-if="currentNativeModal === 'sel-auth-group'">选择用户组</p>
    <component
      v-bind:is="currentNativeModal"
      :showStep="showStep"
      :currentModal.sync="currentNativeModal"
      :confirmfunc="confirmfunc"
    ></component>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
  import selRecordTpl from './sel-record-tpl';
  import selAuthGroup from './sel-auth-group';

  export default {
    name: "q-record-mdl",
    components: {
      selRecordTpl,
      selAuthGroup
    },
    props: {
      confirmfunc: {
        type: Function,
      }
    },
    data() {
      return {
        currentNativeModal: this.$store.getters.getSource('qRecordMdl').dataSource.templateObj.compName, // 当前Modal
      }
    },
    computed: {
      showModal() {
        return this.$store.getters.getSource('qRecordMdl').dataSource.showModal
      },
      showStep() {
        return this.$store.getters.getSource('qRecordMdl').dataSource.templateObj.showStep
      }
    },
    methods: {
      onVisible(value) {
        value || this.$store.dispatch('setDestroy', {
          compName: ['qRecordMdl']
        });
      },
      cancel() {
        this.$refs.modal.cancel()
      }
    }
  }
</script>

