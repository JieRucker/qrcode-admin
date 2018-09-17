<template>
  <div class="empty-block-panel">
    <basic-block
      v-if="block.moduleTypeAlias === 'basic-module'"
      :basicBlock="block"
      :index="index"
      ref="basicBlock">
    </basic-block>
    <contacts-block
      v-if="block.moduleTypeAlias === 'contacts-module'"
      :contactsBlock="block"
      :index="index"
      ref="contactsBlock">
    </contacts-block>
    <social-block
      v-if="block.moduleTypeAlias === 'social-module'"
      :socialBlock="block"
      :index="index"
      ref="socialBlock">
    </social-block>
    <address-block
      v-if="block.moduleTypeAlias === 'address-module'"
      :addressBlock="block"
      :index="index"
      ref="addressBlock">
    </address-block>
    <remark-block
      v-if="block.moduleTypeAlias === 'remark-module'"
      :remarkBlock="block"
      :index="index"
      ref="remarkBlock">
    </remark-block>
    <extra-block
      v-if="block.moduleTypeAlias === 'extra-module'"
      :extraBlock="block"
      :index="index"
      ref="extraBlock">
    </extra-block>
  </div>
</template>

<script>
  import basicBlock from './basic-block.vue';
  import contactsBlock from './contacts-block.vue';
  import socialBlock from './social-block.vue';
  import addressBlock from './address-block.vue';
  import remarkBlock from './remark-block.vue';
  import extraBlock from './extra-block.vue';

  export default {
    name: "empty-block",
    props: {
      block: Object,
      index: Number,
    },
    components: {
      basicBlock,
      contactsBlock,
      socialBlock,
      addressBlock,
      remarkBlock,
      extraBlock
    },
    data() {
      return {
        moduleIcon: [
          {
            iconAlias: 'basic-module',
            iconClass: 'icon-tupian'
          },
          {
            iconAlias: 'contacts-module',
            iconClass: 'icon-31tuwenxiangqing'
          },
          {
            iconAlias: 'social-module',
            iconClass: 'icon-chanpincanshu'
          },
          {
            iconAlias: 'address-module',
            iconClass: 'icon-wenjianliebiao'
          },
          {
            iconAlias: 'remark-module',
            iconClass: 'icon-wendang'
          },
          {
            iconAlias: 'extra-module',
            iconClass: 'icon-wendang'
          }
        ]
      }
    }
  }
</script>

