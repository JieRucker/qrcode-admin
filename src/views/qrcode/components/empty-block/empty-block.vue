<template>
  <div>
    <div class="empty-block"
         v-if="!block.hasNew">
      <div class="module-icon-box">
        <i :class="'iconfont i-icon '+ icon.iconClass" v-for="icon in moduleIcon"
           v-if="block.moduleTypeAlias === icon.iconAlias"></i>
        <span class="module-text">{{block.moduleTxt}}</span>
      </div>
      <div class="empty-block-tip">
        <span>(请修改)</span>
      </div>
      <div class="function-modal-tip" v-if="block.moduleTypeAlias === 'record-module'">
        <span>功能模块</span>
      </div>
    </div>
    <div>
      <imgs-block
        v-if="block.moduleTypeAlias === 'imgs-module' && block.hasNew"
        :imgsBlock="block"
        :index="index"
        ref="imgsBlock">
      </imgs-block>
      <imgs-txt-block
        v-if="block.moduleTypeAlias === 'imgs-txt-module' && block.hasNew"
        :imgsTxtBlock="block"
        :index="index"
        ref="imgsTxtBlock">
      </imgs-txt-block>
      <product-setting-block
        v-if="block.moduleTypeAlias === 'product-setting-module' && block.hasNew"
        :productSettingBlock="block"
        :index="index"
        ref="productSettingBlock">
      </product-setting-block>
      <file-block
        v-if="block.moduleTypeAlias === 'file-module' && block.hasNew"
        :fileBlock="block"
        :index="index"
        ref="fileBlock">
      </file-block>

      <material-block
        v-if="block.moduleTypeAlias === 'material-module' && block.hasNew"
        :materialBlock="block"
        :index="index"
        ref="materialBlock">
      </material-block>
      <imgs-group-block
        v-if="block.moduleTypeAlias === 'imgs-group-module' && block.hasNew"
        :imgsGroupBlock="block"
        :index="index"
        ref="imgsGroupBlock">
      </imgs-group-block>
      <link-block
        v-if="block.moduleTypeAlias === 'link-module' && block.hasNew"
        :linkBlock="block"
        :index="index"
        ref="linkBlock">
      </link-block>
      <card-block
        v-if="block.moduleTypeAlias === 'card-module' && block.hasNew"
        :cardBlock="block"
        :index="index"
        ref="cardBlock">
      </card-block>
      <video-block
        v-if="block.moduleTypeAlias === 'video-module' && block.hasNew"
        :videoBlock="block"
        :index="index"
        ref="videoBlock">
      </video-block>
      <contact-info-block
        v-if="block.moduleTypeAlias === 'contact-info-module' && block.hasNew"
        :contactInfoBlock="block"
        :index="index"
        ref="contactInfoBlock">
      </contact-info-block>
      <classify-block
        v-if="block.moduleTypeAlias === 'classify-module' && block.hasNew"
        :classifyBlock="block"
        :index="index"
        ref="classifyBlock">
      </classify-block>
      <web-nav-block
        v-if="block.moduleTypeAlias === 'web-nav-module' && block.hasNew"
        :webNavBlock="block"
        :index="index"
        ref="webNavBlock">
      </web-nav-block>
      <audio-block
        v-if="block.moduleTypeAlias === 'audio-module' && block.hasNew"
        :audioBlock="block"
        :index="index"
        ref="audioBlock">
      </audio-block>
      <record-block
        v-if="block.moduleTypeAlias === 'record-module' && block.hasNew"
        :recordBlock="block"
        :index="index"
        ref="recordBlock">
      </record-block>
    </div>
  </div>

</template>

<script>
  import imgsBlock from './imgs-block.vue';
  import imgsTxtBlock from './imgs-txt-block.vue';
  import productSettingBlock from './product-setting-block.vue';
  import fileBlock from './file-block.vue';

  import materialBlock from './material-block.vue';
  import imgsGroupBlock from './imgs-group-block.vue';
  import linkBlock from './link-block.vue';
  import cardBlock from './card-block.vue';
  import videoBlock from './video-block.vue';
  import contactInfoBlock from './contact-info-block.vue';
  import classifyBlock from './classify-block.vue';
  import webNavBlock from './web-nav-block.vue';
  import audioBlock from './audio-block.vue';
  import recordBlock from './record-block.vue';

  export default {
    name: "empty-block",
    props: {
      block: Object,
      index: Number,
    },
    components: {
      imgsBlock,
      imgsTxtBlock,
      productSettingBlock,
      fileBlock,
      materialBlock,
      imgsGroupBlock,
      linkBlock,
      cardBlock,
      videoBlock,
      contactInfoBlock,
      classifyBlock,
      webNavBlock,
      audioBlock,
      recordBlock
    },
    data() {
      return {
        moduleIcon: [
          {
            iconAlias: 'imgs-module',
            iconClass: 'icon-tupian'
          },
          {
            iconAlias: 'imgs-txt-module',
            iconClass: 'icon-31tuwenxiangqing'
          },
          {
            iconAlias: 'product-setting-module',
            iconClass: 'icon-chanpincanshu'
          },
          {
            iconAlias: 'file-module',
            iconClass: 'icon-wenjianliebiao'
          },
          {
            iconAlias: 'material-module',
            iconClass: 'icon-wendang'
          },
          {
            iconAlias: 'imgs-group-module',
            iconClass: 'icon-tuku'
          },
          {
            iconAlias: 'link-module',
            iconClass: 'icon-fenxianglianjie'
          },
          {
            iconAlias: 'card-module',
            iconClass: 'icon-mingpian'
          },

          {
            iconAlias: 'video-module',
            iconClass: 'icon-shipin'
          },
          {
            iconAlias: 'contact-info-module',
            iconClass: 'icon-lianxiwomen'
          },
          {
            iconAlias: 'classify-module',
            iconClass: 'icon-fenlei'
          },
          {
            iconAlias: 'web-nav-module',
            iconClass: 'icon-icon-'
          },
          {
            iconAlias: 'audio-module',
            iconClass: 'icon-yinleyinpin'
          },
          {
            iconAlias: 'record-module',
            iconClass: 'icon-icon-test'
          }
        ]
      }
    }
  }
</script>

