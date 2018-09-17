<style lang="scss" scoped>
  @mixin popup-close {
    top: 3px;
    right: 0;
    z-index: 2;
    color: #999;
    opacity: 1;
    filter: alpha(opacity=100);
    text-shadow: none;
    position: absolute;
    cursor: pointer;
  }

  @mixin popup-arrow {
    top: 43px;
    left: -13px;
    width: 0;
    height: 0;
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
    border-right: 13px solid #fafafa;
    position: absolute;
  }

  .popup-close {
    @include popup-close;
  }

  .popup-arrow {
    @include popup-arrow;
  }
</style>

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
        default: true
      },
      localeOkText: {
        type: String,
        default: '保存'
      }
    },
    methods: {
      close() {
        this.$emit('on-close')
      },
      ok() {
        this.$emit('on-ok');
      },
    }
  }
</script>
