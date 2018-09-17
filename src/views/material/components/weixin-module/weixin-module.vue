<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__right {
    .weixin-module-popup {
      @include module-popup;
      .popup-close {
        @include popup-close;
      }
      .popup-arrow {
        @include popup-arrow;
      }
      .module-title {
        @include module-title;
      }
      .module-group {
        &:last-child {
          margin-bottom: 0;
        }
        margin-bottom: 15px;
        .module-control-label {
          @include module-control-label(20%);
        }
        .module-control-content {
          float: left;
          width: 75%;
          @include e(tooltip) {
            margin-top: 10px;
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
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveWeixinModulePopup">
    <a href="javascript:;" class="module-title">加微信号模块操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">模块标题</label>
      <div class="module-control-content">
        <Input style="width: 300px"
               v-model="block.moduleTitle">
        </Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">
        二维码链接
        <Tooltip content="该模板只有在微信扫一扫时展示" placement="top">
          <Icon type="help-circled"></Icon>
        </Tooltip>
      </label>
      <div class="module-control-content">
        <Input style="width: 300px" v-model="initial.webChatQrcodeUrl"></Input>
        <div class="module-control-content__tooltip">
          <Checkbox v-model="initial.isAllowAddFriendByScanWeChatQrcode">允许通过扫描微信二维码添加好友</Checkbox>
          <Tooltip content="扫描者可以直接在页面中通过链接添加你为好友" placement="top">
            <Icon type="help-circled"></Icon>
          </Tooltip>
          <div class="img-list" v-for="(item,index) in initial.webChatQrcodeImageList"
               v-if="initial.isAllowAddFriendByScanWeChatQrcode" style="margin-top: 10px">
            <img :src="item.imageUrl" class="img-list--img">
            <div class="img-list__cover">
              <Icon type="ios-eye-outline" class="img-list__cover--icon"
                    @click.native="handleView({type:0,item:item})"></Icon>
              <Icon type="ios-trash-outline" class="img-list__cover--icon"
                    @click.native="handleRemove({type:0,index:index})"></Icon>
            </div>
          </div>
          <div
            v-if="initial.webChatQrcodeImageList && !initial.webChatQrcodeImageList.length && initial.isAllowAddFriendByScanWeChatQrcode"
            style="margin-top: 10px">
            <Button type="default" @click="getUpload({type:0})">
              上传二维码
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div id="weChatPicker" class="upload-target"></div>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';

  export default {
    name: "weixin-module",
    components: {
      popupModal
    },
    props: {
      currentTab: String,
      block: Object,
    },
    data() {
      return {
        initial: new Object(null),
        uploadId: null,
        weChatUploader: null, //上传微信对象
      }
    },
    mounted() {
      this.initWeChatUpload();
      this.initial = new Object(null);

      this.$api.qrcodeInterface.getModule({
        moduleId: this.block.moduleId
      }).then(res => {
        res = res.data;
        if (res.success) {
          new ToolFunctor(this)._get({...res.data});
        }
      }).catch(err => {
        console.error(err)
      });
    },
    methods: {
      /**
       * 初始化上传
       * @returns {*}
       */
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
      /**
       * 预览图片
       * @param param
       */
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
      /**
       * 移除上传的微信图
       * @param param
       */
      handleRemove(param) {
        param.type === 0 && this.initial.webChatQrcodeImageList.splice(param.index, 1)
      },
      /**
       * 获取uploadId
       * @param param
       */
      getUpload(param) {
        const picker = () => {
          switch (param.type) {
            case 0:
              document.querySelector('#weChatPicker .webuploader-element-invisible').click();
              break;
          }
        };

        if (!this.uploadId) {
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

          promise.then(resolve => {
            this.weChatUploader.options.server = `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${resolve}`;
            this.uploadId = resolve;
            picker();
          }, reject => this.$Message.error(reject))
        } else {
          picker();
        }
      },
      /**
       * 保存微信号
       */
      saveWeixinModulePopup() {
        let param = new ToolFunctor(this)._set();
        this.$api.qrcodeInterface.saveModuleWechatVO(param).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
          }
        }).catch(err => console.error(err))
      },
      onClose() {
        this.$emit('update:currentTab', this.$Global.setValue(null));
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

      // 是否允许通过扫描微信二维码添加好友
      target.isAllowAddFriendByScanWeChatQrcode = res.moduleObject.isAllowAddFriendByScanWeChatQrcode ? res.moduleObject.isAllowAddFriendByScanWeChatQrcode : false;
      // 微信二维码
      target.webChatQrcodeImageList = (() => {
        let a = [];
        if (res.moduleObject.webChatQrcodeImage && !this.tis.$Global.isBlank(res.moduleObject.webChatQrcodeImage.imageUrl)) {
          a = new Array(res.moduleObject.webChatQrcodeImage)
        } else {
          a = []
        }

        return a;
      })();

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);
      let webChatQrcodeImageList = this.tis.initial.webChatQrcodeImageList;

      target.isFold = this.tis.block.isFold;
      target.isUsed = this.tis.block.isUsed;
      target.hasNew = true;
      target.moduleId = this.tis.block.moduleId; // 模块编号
      target.moduleTitle = this.tis.block.moduleTitle;
      target.moduleType = this.tis.block.moduleType;
      target.sortId = this.tis.block.sortId;
      target.templateId = this.tis.$route.query.templateId;
      target.uploadId = this.tis.uploadId;
      target.moduleVOJson = (() => {
        let options;
        options = {
          moduleId: this.tis.block.moduleId,
          moduleTitle: this.tis.block.moduleTitle,
          moduleType: this.tis.block.moduleType,
          templateId: this.tis.$route.query.templateId,
          isFold: this.tis.block.isFold,
          sortId: this.tis.block.sortId,
          isUsed: this.tis.block.isUsed,
          hasNew: true,
          moduleObject: {
            isAllowAddFriendByScanWeChatQrcode: this.tis.initial.isAllowAddFriendByScanWeChatQrcode, // 是否允许通过扫描微信二维码添加好友
            webChatQrcodeImage: {  // 微信二维码
              imageName: webChatQrcodeImageList.length ? webChatQrcodeImageList[0].imageName : '',
              bucketName: webChatQrcodeImageList.length ? webChatQrcodeImageList[0].bucketName : '',
              ossKey: webChatQrcodeImageList.length ? webChatQrcodeImageList[0].ossKey : '',
              imageUrl: webChatQrcodeImageList.length ? (this.tis.$Global.isUrl(webChatQrcodeImageList[0].imageUrl) ? webChatQrcodeImageList[0].imageUrl : '') : '',
              fileSize: webChatQrcodeImageList.length ? webChatQrcodeImageList[0].fileSize : '',
              id: webChatQrcodeImageList.length ? webChatQrcodeImageList[0].id : '',
            },
            webChatQrcodeUrl: this.tis.initial.webChatQrcodeUrl // 二维码链接
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>

