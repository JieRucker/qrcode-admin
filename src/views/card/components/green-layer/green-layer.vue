<template>
  <div class="green-layer">
    <div class="module-icon-box">
      <i :class="'iconfont i-icon '+ icon.iconClass" v-for="icon in moduleIcon"
         v-if="layer.moduleTypeAlias === icon.iconName"></i>
      <span class="module-text">{{layer.moduleTxt}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "green-layer",
    props: {
      layer: Object,
      index: Number,
    },
    data() {
      return {
        moduleIcon: [
          {
            iconName: 'basic-module',
            iconClass: 'icon-mingpian'
          },
          {
            iconName: 'contacts-module',
            iconClass: 'icon-xinxi'
          },
          {
            iconName: 'social-module',
            iconClass: 'icon-icon-p_lianxirenguanli'
          },
          {
            iconName: 'address-module',
            iconClass: 'icon-dingwei1'
          },
          {
            iconName: 'remark-module',
            iconClass: 'icon-wenjian3'
          }
        ]
      }
    }
  }
</script>

