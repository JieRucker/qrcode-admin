<style lang="scss">
  @import "./styles/qrcode-detail.scss";
</style>
<template>
  <div class="qrcode-detail">
    <div class="qrcode-detail__panel clearfix">
      <div class="qrcode-detail__left">
        <div class="qrcode-detail__header" v-for="(item,index) in moduleHeaderLayer"
             @click="moduleHeaderBlock($event,index)">
          <p class="qrcode-detail__header--title" :title="item.moduleTitle">{{item.moduleTitle}}</p>
        </div>
        <div class="qrcode-detail__section">
          <p class="qrcode-detail__section--title" v-if="!moduleLayer.length > 1">请从下面选择模块</p>
          <div class="module-box">
            <div class="classify-box" v-if="swClassify">
              <div class="empty-block">
                <div class="module-icon-box">
                  <i class="iconfont i-icon icon-fenlei"></i>
                  <span class="module-text">嵌套</span>
                </div>
                <div class="operate">
                  <span class="operate--name">{{classifyName}}</span>
                  <Button class="operate--btn" @click="goBack">返回上级</Button>
                </div>
              </div>
            </div>

            <draggable v-model="moduleLayer" :move="getdata" @update="datadragEnd">
              <transition-group>
                <div v-for="(item,index) in moduleLayer"
                     :class="item.active ? item.moduleTypeAlias + ' active': item.moduleTypeAlias"
                     @click="moduleBlock($event,index)" :key="item.moduleId">
                  <empty-block ref="emptyBlock" :block="item" :index="index"></empty-block>
                  <green-layer ref="greenLayer" :layer="item" :index="index" :moduleLayer="moduleLayer"
                               :tis="tis"></green-layer>
                </div>
              </transition-group>
            </draggable>
          </div>
          <icon-panel ref="iconPanel" :moduleLayer="moduleLayer"></icon-panel>
        </div>
      </div>
      <div class="qrcode-detail__right">
        <component
          v-bind:is="currentTabComponent"
          v-bind:class="['tab-module', item.moduleTypeAlias + '-popup']"
          :style="[{marginTop:item.marginTop + 'px'}]"
          :block="item"
          :key="index"
          :currentTab.sync="currentTab"
          v-for="(item,index) in moduleHeaderLayer"
          v-if="item.moduleTypeAlias === currentTab && item.active"
        ></component>

        <component
          v-bind:is="currentTabComponent"
          v-bind:class="['tab-module', item.moduleTypeAlias + '-popup']"
          :style="[{marginTop:item.marginTop + 'px'}]"
          :block="item"
          :key="index"
          :currentTab.sync="currentTab"
          v-for="(item,index) in moduleLayer"
          v-if="item.moduleTypeAlias === currentTab && item.active"
        ></component>
      </div>
    </div>
    <ButtonGroup size="large" vertical style="position: fixed;right: 20px;top: 50%;margin-top: -30px;">
      <Button @click="showQrcodeViewModal">预览</Button>
    </ButtonGroup>

    <loader :dataSourceList="getDataSourceList"></loader>
  </div>
</template>

<script>
  import loader from '@/components/launch/loader.vue';
  import draggable from 'vuedraggable';
  import emptyBlock from './components/empty-block/empty-block.vue';
  import iconPanel from './components/icon-panel/icon-panel.vue';
  import greenLayer from './components/green-layer/green-layer.vue';

  import headerModule from './components/header-module/header-module.vue';
  import imgsModule from './components/imgs-module/imgs-module.vue';
  import imgsTxtModule from './components/imgs-txt-module/imgs-txt-module.vue';
  import productSettingModule from './components/product-setting-module/product-setting-module.vue';
  import fileModule from './components/file-module/file-module.vue';
  import materialModule from './components/material-module/material-module.vue';
  import imgsGroupModule from './components/imgs-group-module/imgs-group-module.vue';
  import linkModule from './components/link-module/link-module.vue';
  import cardModule from './components/card-module/card-module.vue';
  import videoModule from './components/video-module/video-module.vue';
  import contactInfoModule from './components/contact-info-module/contact-info-module.vue';
  import classifyModule from './components/classify-module/classify-module.vue';
  import webNavModule from "./components/web-nav-module/web-nav-module.vue";
  import audioModule from "./components/audio-module/audio-module.vue";
  import recordModule from "./components/record-module/record-module.vue";

  export default {
    name: "qrcode-detail",
    data() {
      return {
        moduleHeaderLayer: [],// 模块头管理
        moduleLayer: [], // 模块内容管理
        args: {
          moduleStart: 0,
          moduleLength: 50
        },
        file: null,
        headerTitle: null,//模块标题
        moveModuleId: null, //移动的moduleId
        currentTab: ''
      }
    },
    components: {
      draggable,
      emptyBlock,
      greenLayer,
      iconPanel,
      headerModule,
      imgsModule,
      imgsTxtModule,
      productSettingModule,
      fileModule,
      materialModule,
      imgsGroupModule,
      linkModule,
      cardModule,
      videoModule,
      contactInfoModule,
      classifyModule,
      webNavModule,
      audioModule,
      recordModule,
      loader
    },
    watch: {
      $route(to, from) {
        this.initModulelist({
          templateId: this.$route.query.templateId
        })
      }
    },
    computed: {
      getDataSourceList() {
        return this.$store.getters.getDataSourceList('second')
      },
      tis() {
        return this
      },
      currentTabComponent() {
        return this.currentTab.toLowerCase()
      },
      swClassify() {
        let bean = false;
        bean = (parseFloat(this.$route.query.templateType) === 2);
        return bean;
      },
      classifyName() {
        let a = '嵌套';
        if (this.$route.query.classifyName && !this.$Global.isBlank(this.$route.query.classifyName)) {
          a = this.$route.query.classifyName;
        }
        return a;
      }
    },
    mounted() {
      this.initModulelist()
    },
    methods: {
      /**
       * 获取拖拽数据
       */
      getdata(evt) {
        this.moveModuleId = evt.draggedContext.element.moduleId;
      },
      /**
       * 拖拽结束
       */
      datadragEnd(evt) {
        this.$api.qrcodeInterface.updateSortModule({
          templateId: this.$route.query.templateId,
          moduleId: this.moveModuleId,
          sortNewNum: evt.newIndex
        }).then((res) => {
          res = res.data;
          if (res.success) {
            this.initModulelist()
          } else {
            this.$Message.error(res.retMsg)
          }
        }).catch(err => console.log(err))
      },
      /**
       * 初始化模块数据
       */
      initModulelist() {
        this.moduleLayer = [];
        this.moduleHeaderLayer = [];

        this.$api.qrcodeInterface.listModule({
          templateId: this.$route.query.templateId
        }).then((res) => {
          if (res.data.success) {
            this.moduleHeaderLayer.push({
              moduleTypeAlias: 'header-module',
              moduleTitle: res.data.data.templateName,
              active: false
            });

            if (res.data.data.moduleVOList) {
              [...res.data.data.moduleVOList].forEach(m => {
                m.moduleTypeAlias = this.switchModuleType(m).moduleTypeAlias;
                m.moduleTxt = this.switchModuleType(m).moduleTxt;
                m.active = false;
              });
              this.moduleLayer = res.data.data.moduleVOList;
            } else {
              this.moduleLayer = []
            }

            this.showRecord();

          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => console.log(err))
      },
      /**
       * 返回上级
       */
      goBack() {
        if (this.$route.query.parentTemplateId) {
          let parentTemplateId = JSON.parse(this.$route.query.parentTemplateId);
          let templateId = parentTemplateId.pop();

          let parentClassifyName = JSON.parse(this.$route.query.parentClassifyName);
          let classifyName = parentClassifyName.pop();
          this.$router.push({
            name: "qrcode-detail",
            query: (() => {
              let target = new Object(null);
              target.templateFoldId = this.$route.query.templateFoldId;
              target.templateId = templateId;
              target.mobUrl = this.$route.query.mobUrl;
              target.pcUrl = this.$route.query.pcUrl;
              if (parentTemplateId.length) {
                target.parentTemplateId = JSON.stringify(parentTemplateId);
                target.parentClassifyName = JSON.stringify(parentClassifyName);
                target.classifyName = classifyName;
                target.templateType = 2;
              } else {
                target.templateType = 0;
              }

              return target
            })()
          })
        }
      },
      /**
       * 添加维护模板状态
       */
      showRecord() {
        const rdBean = (() => {
          return () => {
            let a = false;
            [...this.moduleLayer].forEach(m => (m.moduleType === 13) && (a = true));
            return a;
          }
        })();

        let sWRd = this.$Global.VueDB().getItem('sWRd').toJson();
        this.$Global.timeout(300).then(() => {
          if (!rdBean()) {
            sWRd && this.$refs.iconPanel.recordModule();
          }

          sWRd && this.$Global.VueDB().removeItem('sWRd');
        });
      },
      /**
       * 切换模块类型
       * @param m
       * @returns {any}
       */
      switchModuleType(m) {
        let moduleItem = Object.create({});
        switch (m.moduleType) {
          case 0:
            moduleItem.moduleTypeAlias = 'imgs-module';
            moduleItem.moduleTxt = '图片';
            break;
          case 1:
            moduleItem.moduleTypeAlias = 'imgs-txt-module';
            moduleItem.moduleTxt = '图文';
            break;
          case 2:
            moduleItem.moduleTypeAlias = 'product-setting-module';
            moduleItem.moduleTxt = '参数';
            break;
          case 3:
            moduleItem.moduleTypeAlias = 'file-module';
            moduleItem.moduleTxt = '文件';
            break;
          case 4:
            moduleItem.moduleTypeAlias = 'imgs-group-module';
            moduleItem.moduleTxt = '图集';
            break;
          case 5:
            moduleItem.moduleTypeAlias = 'link-module';
            moduleItem.moduleTxt = '链接';
            break;
          case 6:
            moduleItem.moduleTypeAlias = 'card-module';
            moduleItem.moduleTxt = '名片';
            break;
          case 7:
            moduleItem.moduleTypeAlias = 'video-module';
            moduleItem.moduleTxt = '视频';
            break;
          case 8:
            moduleItem.moduleTypeAlias = 'audio-module';
            moduleItem.moduleTxt = '音频';
            break;
          case 9:
            moduleItem.moduleTypeAlias = 'contact-info-module';
            moduleItem.moduleTxt = '联系方式';
            break;
          case 10:
            moduleItem.moduleTypeAlias = 'material-module';
            moduleItem.moduleTxt = '素材';
            break;
          case 11:
            moduleItem.moduleTypeAlias = 'classify-module';
            moduleItem.moduleTxt = '嵌套';
            break;
          case 12:
            moduleItem.moduleTypeAlias = 'web-nav-module';
            moduleItem.moduleTxt = '网址';
            break;
          case 13:
            moduleItem.moduleTypeAlias = 'record-module';
            moduleItem.moduleTxt = '维护模板';
            break;
        }

        return moduleItem;
      },
      /**
       * 二维码基本信息点击
       * @param event
       * @param index
       */
      moduleHeaderBlock(event, index) {
        this.resetLayer();
        this.moduleHeaderLayer[index].active = true;
        this.moduleHeaderLayer[index].marginTop = 0;
        this.currentTab = 'header-module';
      },
      /**
       * 重置
       */
      resetLayer() {
        this.moduleHeaderLayer.forEach(m => m.active = false);
        this.moduleLayer.forEach(m => m.active = false);
        this.currentTab = '';
      },
      /**
       * 模块点击
       * @param event
       * @param index
       */
      moduleBlock(event, index) {
        let moduleLayer = this.moduleLayer[index];
        moduleLayer.marginTop = event.target.parentElement.offsetTop - 50;
        this.resetLayer();
        moduleLayer.active = true;

        const runAsync1 = () => {
          return new Promise((resolve, reject) => {
            this.$api.qrcodeInterface.saveTemplate({
              templateFoldId: this.$route.query.templateFoldId,
              templateType: 2
            }).then((res) => {
              res = res.data;
              if (res.success) {
                resolve(res.data);
              }
            }).catch((err) => console.log(err))
          });
        };

        const runAsync2 = (param) => {
          return new Promise((resolve, reject) => {
            this.$api.qrcodeInterface.saveModuleClassifyVO(param).then(res => {
              res = res.data;
              if (res.success) {
                resolve(true)
              }
            }).catch(err => console.error(err))
          });
        };

        const switchTab = (() => {
          return () => {
            this.$Global.timeout(300).then(() => this.currentTab = moduleLayer.moduleTypeAlias);
          }
        })();

        switch (moduleLayer.moduleType) {
          case 11:
            if (this.$Global.isBlank(moduleLayer.moduleObject.templateId)) {
              runAsync1().then(data => {
                moduleLayer.moduleObject.templateId = data;
                let param = new ToolFunctor(this)._setClassify(Object.assign({}, moduleLayer));
                return runAsync2(param);
              }).then(data => {
                switchTab();
              })
            } else {
              switchTab();
            }
            break;
          default:
            switchTab();
        }
      },
      /**
       * 显示预览
       */
      showQrcodeViewModal() {
        this.$store.dispatch('setDataSourceList', {
          compName: 'qVwMdl',
          compType: 'second',
          dataSource: {
            showModal: true,
            templateObj: {
              templateId: this.$route.query.templateId,
              mobUrl: this.$route.query.mobUrl,
              pcUrl: this.$route.query.pcUrl
            }
          }
        });
      }
    }
  }

  class ToolFunctor {
    constructor(tis) {
      if (!tis) {
        throw new Error('[SKETCHPAD]: Missing parameters (tis)');
      }

      this.tis = typeof(tis) !== 'undefined' ? tis : null;
    }

    _setClassify(res) {
      let target = new Object(null);
      target.isFold = res.isFold;
      target.isUsed = res.isUsed;
      target.hasNew = res.hasNew;
      target.moduleId = res.moduleId; // 模块编号
      target.moduleTitle = res.moduleTitle;
      target.moduleType = res.moduleType;
      target.sortId = res.sortId;
      target.templateId = this.tis.$route.query.templateId;
      target.uploadId = '';
      target.moduleVOJson = (() => {
        let options = {
          moduleId: res.moduleId,
          moduleTitle: res.moduleTitle,
          moduleType: res.moduleType,
          templateId: this.tis.$route.query.templateId,
          isFold: res.isFold,
          sortId: res.sortId,
          isUsed: res.isUsed,
          hasNew: res.hasNew,
          moduleObject: {
            textContent: '', // 正文内容
            templateId: res.moduleObject.templateId,
            image: {
              imageName: '',
              bucketName: '',
              ossKey: '',
              imageUrl: '',
              fileSize: '',
              id: '',
            }
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>
