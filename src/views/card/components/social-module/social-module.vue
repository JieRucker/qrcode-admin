<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .card-detail__right {
    .social-module-popup {
      @include module-popup;
      .module-title {
        @include module-title;
      }
      @include b(form) {
        @include e(item) {
          @include m(icon) {
            font-size: 18px;
            vertical-align: middle;
            width: 24px;
            text-align: center;
            cursor: pointer;
          }
          @include m(trash) {
            font-size: 22px;
          }
          @include m(title) {
            width: 80px;
            margin-right: 24px;
            margin-left: -107px;
          }
        }
      }
      @include b(img-list) {
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
        @include m(img) {
          max-width: 100%;
          height: 100%;
          object-fit: cover;
        }
        @include e(cover) {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, .6);
          opacity: 0;
          transition: all ease .3s;
          @include m(icon) {
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
          }
        }
        &:hover {
          .img-list__cover {
            opacity: 1;
          }
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose">
    <a href="javascript:;" class="module-title">社交信息</a>
    <Form label-position="left" :label-width="100" class="form">
      <FormItem :label="key === 0 && '微信号'" class="form__item" v-for="(item,key) in initial.messengerList" :key="key">
        <Input class="form__item--title" v-model="item.name" v-if="key !== 0"></Input>
        <Input style="width: 400px" v-model="item.value"></Input>
        <Icon type="plus-circled" class="form__item--icon" @click.native="onPlus({type:0})" v-if="key === 0"></Icon>
        <Icon type="ios-trash" class="form__item--icon form__item--trash" @click.native="onTrash({type:0,key:key})"
              v-if="key !== 0"></Icon>
        <div v-if="key === 0">
          <Checkbox v-model="initial.isAllowAddFriendByScanWeChatQrcode">允许通过扫描微信二维码添加好友</Checkbox>
          <div class="img-list" v-for="(item,index) in initial.webChatQrcodeImageList"
               v-if="initial.isAllowAddFriendByScanWeChatQrcode">
            <img :src="item.imageUrl" class="img-list--img">
            <div class="img-list__cover">
              <Icon type="ios-eye-outline" class="img-list__cover--icon"
                    @click.native="handleView({type:0,item:item})"></Icon>
              <Icon type="ios-trash-outline" class="img-list__cover--icon"
                    @click.native="handleRemove({type:0,index:index})"></Icon>
            </div>
          </div>
          <div v-if="initial.webChatQrcodeImageList && !initial.webChatQrcodeImageList.length && initial.isAllowAddFriendByScanWeChatQrcode">
            <Button type="default" @click="getUpload({type:0})">
              上传二维码
            </Button>
          </div>
        </div>
      </FormItem>
      <FormItem :label="key === 0 && '主页网址'" class="form__item" v-for="(item,key) in initial.webSiteList" :key="key">
        <Input class="form__item--title" v-model="item.name" v-if="key !== 0"></Input>
        <Input style="width: 400px" v-model="item.value"></Input>
        <Icon type="plus-circled" class="form__item--icon" @click.native="onPlus({type:1})" v-if="key === 0"></Icon>
        <Icon type="ios-trash" class="form__item--icon form__item--trash" @click.native="onTrash({type:1,key:key})"
              v-if="key !== 0"></Icon>
      </FormItem>
      <FormItem label="微博" class="form__item" v-for="(item,index) in initial.weibo" :key="index">
        <Input style="width: 400px" v-model="item.value"></Input>
      </FormItem>
      <FormItem label="QQ" class="form__item" v-for="(item,index) in initial.qq" :key="index">
        <Input style="width: 400px" v-model="item.value"></Input>
        <div>
          <Checkbox v-model="initial.isAllowAddFriendByScanQQQrcode">允许通过扫描QQ二维码添加好友</Checkbox>
          <div class="img-list" v-for="(item,index) in initial.qqQrcodeImageList"
               v-if="initial.isAllowAddFriendByScanQQQrcode">
            <img :src="item.imageUrl" class="img-list--img">
            <div class="img-list__cover">
              <Icon type="ios-eye-outline" class="img-list__cover--icon"
                    @click.native="handleView({type:1,item:item})"></Icon>
              <Icon type="ios-trash-outline" class="img-list__cover--icon"
                    @click.native="handleRemove({type:1,index:index})"></Icon>
            </div>
          </div>
          <div v-if="initial.qqQrcodeImageList && !initial.qqQrcodeImageList.length && initial.isAllowAddFriendByScanQQQrcode">
            <Button type="default" @click="getUpload({type:1})">
              上传二维码
            </Button>
          </div>
        </div>
      </FormItem>
    </Form>
    <div id="weChatPicker" class="upload-target"></div>
    <div id="QQPicker" class="upload-target"></div>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';
  import {mapGetters} from 'vuex';

  export default {
    name: "social-module",
    components: {
      popupModal
    },
    props: {
      cardType: String,
      block: Object,
    },
    computed: {
      ...mapGetters([
        'getUploadId'
      ])
    },
    data() {
      return {
        initial: new Object(null),
        toolFunctor: null,
        weChatUploader: null, //上传微信对象
        QQUploader: null, //上传QQ对象
      }
    },
    mounted() {
      this.initWeChatUpload();
      this.initQQUpload();
      this.toolFunctor = new ToolFunctor(this);
      this.toolFunctor._get({});
    },
    methods: {
      onClose() {
        this.$emit('update:cardType', null);
      },
      initWeChatUpload() {
        if (this.weChatUploader) this.weChatUploader.destroy();

        /* 初始化上传插件 */
        this.weChatUploader = WebUploader.create({
          pick: {
            id: '#weChatPicker',
            multiple: true
          },
          accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png'
          },
          auto: true,
          compress: false, //不压缩
          chunked: true, //分块传输
          chunkSize: 1024 * 1024, //分块大小
          server: `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${this.getUploadId}`,
          duplicate: true,
          fileSingleSizeLimit: 1024 * 1024 * 1024,
          fileNumLimit: 50, //最大上传数目1000
          fileSizeLimit: 1024 * 1024 * 1024 * 1024 //单次文件上传限制1024G
        });

        /* 向队列里加入一个文件 */
        this.weChatUploader.on('fileQueued', (_file) => {
          _file.progress = 0;

          return this.weChatUploader.makeThumb(_file, (err, src) => {
            this.initial.webChatQrcodeImageList = new Array({
              imageName: _file.name,
              bucketName: '',
              ossKey: '',
              imageUrl: src,
              fileSize: WebUploader.Base.formatSize(_file.size),
              id: ''
            })
          });
        });

        this.weChatUploader.on('uploadFinished', (file, response) => {
          this.weChatUploader.reset();
        });

        this.weChatUploader.on('uploadError', (file, reason) => {
          this.$Message.info('上传失败', 5000);
          this.weChatUploader.reset();
        });
        return this.weChatUploader.on('error', (type) => {
          switch (type) {
            case 'F_EXCEED_SIZE':
              return this.$Message.info('文件大小超过限制');
            case 'Q_EXCEED_NUM_LIMIT':
              return this.$Message.info('文件数目超过限制');
            case 'Q_TYPE_DENIED':
              return this.$Message.info('文件类型不对');
          }
        });
      },
      initQQUpload() {
        if (this.QQUploader) this.QQUploader.destroy();

        /* 初始化上传插件 */
        this.QQUploader = WebUploader.create({
          pick: {
            id: '#QQPicker',
            multiple: true
          },
          accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png'
          },
          auto: true,
          compress: false, //不压缩
          chunked: true, //分块传输
          chunkSize: 1024 * 1024, //分块大小
          server: `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${this.getUploadId}`,
          duplicate: true,
          fileSingleSizeLimit: 1024 * 1024 * 1024,
          fileNumLimit: 50, //最大上传数目1000
          fileSizeLimit: 1024 * 1024 * 1024 * 1024 //单次文件上传限制1024G
        });

        /* 向队列里加入一个文件 */
        this.QQUploader.on('fileQueued', (_file) => {
          _file.progress = 0;

          return this.QQUploader.makeThumb(_file, (err, src) => {
            this.initial.qqQrcodeImageList = new Array({
              imageName: _file.name,
              bucketName: '',
              ossKey: '',
              imageUrl: src,
              fileSize: WebUploader.Base.formatSize(_file.size),
              id: ''
            })
          });
        });

        this.QQUploader.on('uploadFinished', (file, response) => {
          this.QQUploader.reset();
        });

        this.QQUploader.on('uploadError', (file, reason) => {
          this.$Message.info('上传失败', 5000);
          this.QQUploader.reset();
        });
        return this.QQUploader.on('error', (type) => {
          switch (type) {
            case 'F_EXCEED_SIZE':
              return this.$Message.info('文件大小超过限制');
            case 'Q_EXCEED_NUM_LIMIT':
              return this.$Message.info('文件数目超过限制');
            case 'Q_TYPE_DENIED':
              return this.$Message.info('文件类型不对');
          }
        });
      },
      handleView(param) {
        this.$Modal.confirm({
          title: '预览图片',
          render: (h) => {
            return h('Img', {
              attrs: {
                src: param.item.imageUrl,
              },
              style: {
                maxWidth: '100%',
                height: '100%'
              }
            })
          }
        })
      },
      handleRemove(param) {
        (param.type === 0 && this.initial.webChatQrcodeImageList.splice(param.index, 1)) || (param.type === 1 && this.initial.qqQrcodeImageList.splice(param.index, 1))
      },
      onPlus(param) {
        switch (param.type) {
          case 0:
            this.initial.messengerList.push({
              name: '微信号',
              value: ''
            });
            break;
          case 1:
            this.initial.webSiteList.push({
              name: '网址',
              value: ''
            });
            break;
        }
      },
      onTrash(param) {
        switch (param.type) {
          case 0:
            this.initial.messengerList.splice(param.key, 1);
            break;
          case 1:
            this.initial.webSiteList.splice(param.key, 1);
            break;
        }
      },
      getUpload(param) {
        const picker = () => {
          switch (param.type) {
            case 0:
              document.querySelector('#weChatPicker .webuploader-element-invisible').click();
              break;
            case 1:
              document.querySelector('#QQPicker .webuploader-element-invisible').click();
              break;
          }
        };

        if (!this.getUploadId) {
          const promise = new Promise((resolve, reject) => {
            $.ajax({
              url: `${process.env.api.commonUrl}/common/createUploadId`,
              type: 'post',
              async: false
            }).done((res) => {
              res = JSON.parse(res);
              res.success ? resolve(res.data) : reject(res.retMsg);
            });
          });

          promise.then((resolve) => {
            this.weChatUploader.options.server = `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${resolve}`;
            this.QQUploader.options.server = `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${resolve}`;
            this.$store.dispatch('setUploadId', resolve);
            picker();
          }, (reject) => {
            this.$Message.error(reject);
          })
        } else {
          picker();
        }
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

      // 微信号
      target.messengerList = res.webChat ? res.webChat.messengerList : (() => {
        return new Array({
          name: '微信号',
          value: ''
        });
      })();
      // 是否允许通过扫描微信二维码添加好友
      target.isAllowAddFriendByScanWeChatQrcode = res.isAllowAddFriendByScanWeChatQrcode ? res.isAllowAddFriendByScanWeChatQrcode : false;
      // 主页网址
      target.webSiteList = res.webSiteList ? res.webSiteList : (() => {
        return new Array({
          name: '主页网址',
          value: ''
        });
      })();
      // 微信二维码
      target.webChatQrcodeImageList = (() => {
        let a = [];
        if (res.webChatQrcodeImage && !this.tis.$Global.isBlank(res.webChatQrcodeImage.imageUrl)) {
          a = new Array(res.webChatQrcodeImage)
        } else {
          a = []
        }

        return a;
      })();
      // QQ二维码
      target.qqQrcodeImageList = (() => {
        let a = [];
        if (res.qqQrcodeImage && !this.tis.$Global.isBlank(res.qqQrcodeImage.imageUrl)) {
          a = new Array(res.qqQrcodeImage)
        } else {
          a = []
        }

        return a;
      })();
      // 微博
      target.weibo = res.weibo ? res.weibo : '';
      // QQ
      target.qq = res.qq ? res.qq : '';
      // 是否允许通过扫描QQ二维码添加好友
      target.isAllowAddFriendByScanQQQrcode = res.isAllowAddFriendByScanQQQrcode ? res.isAllowAddFriendByScanQQQrcode : false;

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);
      let webChatQrcodeImageList = this.tis.initial.webChatQrcodeImageList;
      let qqQrcodeImageList = this.tis.initial.qqQrcodeImageList;

      target.cardSocialInfo = (() => {
        let options;
        options = {
          webChat: { // 微信号
            messengerList: this.tis.initial.messengerList
          },
          isAllowAddFriendByScanWeChatQrcode: this.tis.initial.isAllowAddFriendByScanWeChatQrcode, // 是否允许通过扫描微信二维码添加好友
          isAllowAddFriendByScanQQQrcode: this.tis.initial.isAllowAddFriendByScanQQQrcode, // 是否允许通过扫描QQ二维码添加好友
          webChatQrcodeImage: {  // 微信二维码
            imageName: webChatQrcodeImageList.length ? webChatQrcodeImageList[0].imageName : '',
            bucketName: webChatQrcodeImageList.length ? webChatQrcodeImageList[0].bucketName : '',
            ossKey: webChatQrcodeImageList.length ? webChatQrcodeImageList[0].ossKey : '',
            imageUrl: webChatQrcodeImageList.length ? (this.tis.$Global.isUrl(webChatQrcodeImageList[0].imageUrl) ? webChatQrcodeImageList[0].imageUrl : '') : '',
            fileSize: webChatQrcodeImageList.length ? webChatQrcodeImageList[0].fileSize : '',
            id: webChatQrcodeImageList.length ? webChatQrcodeImageList[0].id : '',
          },
          qqQrcodeImage: { // QQ二维码
            imageName: qqQrcodeImageList.length ? qqQrcodeImageList[0].imageName : '',
            bucketName: qqQrcodeImageList.length ? qqQrcodeImageList[0].bucketName : '',
            ossKey: qqQrcodeImageList.length ? qqQrcodeImageList[0].ossKey : '',
            imageUrl: qqQrcodeImageList.length ? (this.tis.$Global.isUrl(qqQrcodeImageList[0].imageUrl) ? qqQrcodeImageList[0].imageUrl : '') : '',
            fileSize: qqQrcodeImageList.length ? qqQrcodeImageList[0].fileSize : '',
            id: qqQrcodeImageList.length ? qqQrcodeImageList[0].id : '',
          },
          webSiteList: this.tis.initial.webSiteList, // 主页网址
          weibo: this.tis.$Global.isArray(this.tis.initial.weibo) ? this.tis.initial.weibo[0].value : this.tis.initial.weibo, // 微博
          qq: this.tis.$Global.isArray(this.tis.initial.qq) ? this.tis.initial.qq[0].value : this.tis.initial.qq // QQ
        };

        return options
      })();

      return target;
    }
  }
</script>

