<style lang="scss">
  @import "./styles/card-detail.scss";
</style>

<template>
  <div class="card-detail">
    <div class="card-detail__panel clearfix">
      <div class="card-detail__left">
        <div class="card-detail__section">
          <div class="module-box">
            <div v-for="(item,index) in initial.moduleLayer"
                 :class="item.active ? item.moduleTypeAlias + ' active': item.moduleTypeAlias"
                 @click="moduleBlock($event,index)">
              <empty-block ref="emptyBlock" :block="item" :index="index"></empty-block>
              <green-layer ref="greenLayer" :layer="item" :index="index"></green-layer>
            </div>
          </div>
          <div class="card-detail__footer">
            <p>手机显示语言：
              <RadioGroup v-model="selectLanguage">
                <Radio label="中文"></Radio>
                <Radio label="英语"></Radio>
              </RadioGroup>
            </p>
          </div>
        </div>
      </div>
      <div class="card-detail__right" :style="[{marginTop:marginTop + 'px'}]">
        <basic-module :block="cardLayer" :cardType.sync="cardType" ref="basic-module" v-show="cardType === 0"
                      class="basic-module-popup"></basic-module>
        <contacts-module :block="cardLayer" :cardType.sync="cardType" ref="contacts-module" v-show="cardType === 1"
                         class="contacts-module-popup"></contacts-module>
        <social-module :block="cardLayer" :cardType.sync="cardType" ref="social-module" v-show="cardType === 2"
                       class="social-module-popup"></social-module>
        <address-module :block="cardLayer" :cardType.sync="cardType" ref="address-module" v-show="cardType === 3"
                        class="address-module-popup"></address-module>
        <remark-module :block="cardLayer" :cardType.sync="cardType" ref="remark-module" v-show="cardType === 4"
                       class="remark-module-popup"></remark-module>
        <extra-module :block="cardLayer" :cardType.sync="cardType" ref="extra-module" v-show="cardType === 5"
                      class="extra-module-popup"></extra-module>
      </div>
    </div>
    <ButtonGroup size="large" vertical style="position: fixed;right: 10px;top: 50%;margin-top: -30px;">
      <Button @click="showQrcodeViewModal">预览</Button>
      <Button @click="saveCardPanel">保存</Button>
    </ButtonGroup>

    <loader :dataSourceList="getDataSourceList"></loader>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import loader from '@/components/launch/loader.vue';
  import emptyBlock from './components/empty-block/empty-block.vue';
  import greenLayer from './components/green-layer/green-layer.vue';

  import basicModule from './components/basic-module/basic-module.vue';
  import contactsModule from './components/contacts-module/contacts-module.vue';
  import socialModule from './components/social-module/social-module.vue';
  import addressModule from './components/address-module/address-module.vue';
  import remarkModule from './components/remark-module/remark-module.vue';
  import extraModule from './components/extra-module/extra-module.vue';

  export default {
    name: "card-detail",
    components: {
      emptyBlock,
      greenLayer,
      basicModule,
      contactsModule,
      socialModule,
      addressModule,
      remarkModule,
      extraModule,
      loader
    },
    data() {
      return {
        initial: new Object(null),
        marginTop: 0, // 偏移位置
        cardType: 0, // 卡片类型（0：基础模块；1：联系人模块；2：社交模块；3：地址模块；4：简介模块；5：附加模块）
        cardLayer: null, // 卡片资料
        selectLanguage: '中文',
        cardJson: null, // 查询的名片信息
        tabs: ['basic-module', 'contacts-module', 'social-module', 'address-module', 'remark-module', 'extra-module']
      }
    },
    computed: {
      tis() {
        return this
      },
      ...mapGetters([
        'getUploadId',
      ]),
      getDataSourceList() {
        return this.$store.getters.getDataSourceList('second')
      }
    },
    mounted() {
      this.initModulelist()
    },
    methods: {
      initModulelist() {
        let cardId = this.$route.query.cardId;
        if (this.$Global.isBlank(cardId)) {
          new ToolFunctor(this)._get({});
        } else {
          this.$api.cardInterface.getCard({
            cardId: this.$route.query.cardId
          }).then((res) => {
            res = res.data;
            if (res.success) {
              this.cardJson = JSON.parse(res.data.cardJson)
              new ToolFunctor(this)._get(JSON.parse(res.data.cardJson));
            } else {
              this.$Message.error(res.retMsg)
            }
          }).catch(err => console.log(err))
        }

        this.$Global.timeout(500).then(() => {
          for (let i = 0; i < this.tabs.length; i++) {
            this.$refs[this.tabs[i]].toolFunctor._get(this.initial.moduleLayer[i]);
          }
        })
      },
      moduleBlock(event, index) {
        this.initial.moduleLayer.forEach(m => m.active = false);
        this.initial.moduleLayer[index].active = true;
        this.marginTop = event.target.parentElement.offsetTop - 50;
        this.cardType = this.initial.moduleLayer[index].cardType;

        this.$refs[this.initial.moduleLayer[index]['moduleTypeAlias']].toolFunctor._get(this.initial.moduleLayer[index])
      },
      saveCardPanel() {
        let refs = this.$refs;
        let basicModule = refs['basic-module'].toolFunctor._set();
        let cardId = this.$route.query.cardId;
        let param = null;

        if (this.$Global.isBlank(basicModule.cardBaseInfo.fullName)) {
          return this.$Message.info('请输入姓名');
        }

        param = {
          uploadId: this.getUploadId,
          cardListJson: (() => {
            let profile = Object.assign({}, this.cardJson, (() => {
              let a = Object.create({});
              a.cardId = cardId;
              [...this.tabs].forEach(m => {
                let obj = refs[m].toolFunctor._set();
                Object.keys(obj).forEach(i => a[i] = obj[i]);
              });

              return a;
            })());

            return JSON.stringify(profile)
          })(),
          cardFoldId: this.$route.query.cardFoldId,
          cardId: cardId,
          cardName: ''
        };

        this.$api.cardInterface.saveCardImageVO(param).then(res => {
          res = res.data;
          if (res.success) {
            this.$Message.info('成功');
          } else {
            this.$Message.info(res.retMsg);
          }
        }).catch(err => console.error(err))
      },
      showQrcodeViewModal() {
        this.$store.dispatch('setDataSourceList', {
          compName: 'qVwMdl',
          compType: 'second',
          dataSource: {
            showModal: true,
            templateObj: {
              templateId: this.$route.query.cardId,
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

    _get(res) {
      let target = new Object(null);

      // 模块内容管理
      target.moduleLayer = (() => {
        let a = [];

        let cardBaseInfo = {
          cardType: 0,
          moduleTypeAlias: 'basic-module',
          moduleTxt: '基本信息',
          avatarImage: res.cardBaseInfo && res.cardBaseInfo.avatarImage ? (() => {
            let a = [];
            a.push(res.cardBaseInfo.avatarImage);
            return a;
          })() : [],
          backGroundImage: res.cardBaseInfo && res.cardBaseInfo.backGroundImage ? (() => {
            let a = [];
            a.push(res.cardBaseInfo.backGroundImage);
            return a;
          })() : [{
            bucketName: '',
            fileSize: '',
            id: '',
            imageName: '',
            imageUrl: `${process.env.api.staticUrl}static/images/card/card_bg.jpg`,
            ossKey: ''
          }],
          company: res.cardBaseInfo ? res.cardBaseInfo.company : {
            departMentList: [{
              name: '公司',
              value: ''
            }]
          },
          fullName: res.cardBaseInfo ? [{value: res.cardBaseInfo.fullName}] : [{value: ''}],
          position: res.cardBaseInfo ? [{value: res.cardBaseInfo.position}] : [{value: ''}],
          layOut: res.cardBaseInfo ? [{value: res.cardBaseInfo.layOut}] : [{value: 0}],
          active: false,
        };

        let cardLinkInfo = {
          cardType: 1,
          moduleTypeAlias: 'contacts-module',
          moduleTxt: '联系信息',
          emailList: res.cardLinkInfo ? res.cardLinkInfo.emailList : [{
            name: '电子邮箱',
            value: ''
          }],
          faxList: res.cardLinkInfo ? res.cardLinkInfo.faxList : [{
            name: '传真',
            value: ''
          }],
          mobilePhone: res.cardLinkInfo ? res.cardLinkInfo.mobilePhone : {
            familyPhoneList: [{
              name: '移动电话',
              value: ''
            }]
          },
          telephone: res.cardLinkInfo ? [{
            name: '固定电话',
            value: res.cardLinkInfo.telephone
          }] : [{
            name: '固定电话',
            value: ''
          }],
          active: false,
        };

        let cardSocialInfo = {
          cardType: 2,
          moduleTypeAlias: 'social-module',
          moduleTxt: '社交信息',
          isAllowAddFriendByScanQQQrcode: res.cardSocialInfo ? res.cardSocialInfo.isAllowAddFriendByScanQQQrcode : false,
          isAllowAddFriendByScanWeChatQrcode: res.cardSocialInfo ? res.cardSocialInfo.isAllowAddFriendByScanWeChatQrcode : false,
          qq: res.cardSocialInfo ? [{
            name: 'QQ',
            value: res.cardSocialInfo.qq
          }] : [{
            name: 'QQ',
            value: ''
          }],
          qqQrcodeImage: res.cardSocialInfo ? res.cardSocialInfo.qqQrcodeImage : {},
          webChat: res.cardSocialInfo ? res.cardSocialInfo.webChat : {
            messengerList: [
              {
                name: '微信号',
                value: ''
              }
            ]
          },
          webChatQrcodeImage: res.cardSocialInfo ? res.cardSocialInfo.webChatQrcodeImage : {},
          webSiteList: res.cardSocialInfo ? res.cardSocialInfo.webSiteList : [{
            name: '主页网址',
            value: ''
          }],
          weibo: res.cardSocialInfo ? [{
            name: '微博',
            value: res.cardSocialInfo.weibo
          }] : [{
            name: '微博',
            value: ''
          }]
        };

        let address = {
          cardType: 3,
          moduleTypeAlias: 'address-module',
          moduleTxt: '地址',
          address: res.address ? res.address : [{
            address: '',
            dimension: '',
            longitude: '',
            name: '地址'
          }]
        };

        let cardIntroInfo = {
          cardType: 4,
          moduleTypeAlias: 'remark-module',
          moduleTxt: '个人说明',
          selfIntro: res.cardIntroInfo ? [{
            name: '个人说明',
            value: res.cardIntroInfo.selfIntro
          }] : [{
            name: '个人说明',
            value: ''
          }]
        };

        let cardAdditionInfo = {
          cardType: 5,
          moduleTypeAlias: 'extra-module',
          moduleTxt: '附加内容',
          additionalType: res.cardAdditionInfo ? res.cardAdditionInfo.additionalType : 0,
          templateId: res.templateId ? res.cardAdditionInfo.templateId : ''
        };

        let r = [cardBaseInfo, cardLinkInfo, cardSocialInfo, address, cardIntroInfo, cardAdditionInfo];
        r.map(m => a.push(m));

        return a;
      })();

      return this.tis.initial = target;
    }
  }
</script>
