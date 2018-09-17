<template>
  <div>
    <div class="header" v-if="showHead">
      <slot name="header">
        <Button class="popup-close" type="text" size="large" @click.native="close">
          <Icon type="close-round"></Icon>
        </Button>
        <div class="popup-arrow"></div>
      </slot>
    </div>
    <div class="body">
      <slot></slot>
    </div>
    <div class="footer" v-if="!footerHide">
      <slot name="footer">
        <div class="module-group clearfix">
          <label class="module-control-label"></label>
          <div class="module-control-content">
            <Button type="primary" size="large" @click.native="ok">{{localeOkText}}</Button>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "modal",
    props: {
      block: Object,
      currentTab: String,
      showHead: {
        type: Boolean,
        default: true
      },
      footerHide: {
        type: Boolean,
        default: false
      },
      localeOkText: {
        type: String,
        default: '保存'
      }
    },
    methods: {
      /**
       * 关闭回调
       */
      close() {
        this.$emit('on-close')
      },
      /**
       * 确定回调
       */
      ok() {
        this.$emit('on-ok');
      },
    }
  }
</script>
