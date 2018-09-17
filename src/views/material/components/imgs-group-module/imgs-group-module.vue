<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__right {
    .imgs-group-module-popup {
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
          @include module-control-label;
        }
        .module-control-content {
          float: left;
          width: 75%;
          .module-main-panel {
            @include module-main-panel(6px 0);
          }
        }
      }

      .upload-list-item {
        float: left;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 5px;
        &:hover {
          .upload-list-cover {
            opacity: 1;
          }
        }
        .upload-list-cover {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, .6);
          opacity: 0;
          transition: all ease .3s;
          .ios-eye-outline {
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
          }
          .ios-trash-outline {
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
          }
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveImgsGroupModulePopup">
    <a href="javascript:;" class="module-title">图集模块操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">模块标题</label>
      <div class="module-control-content">
        <Input style="width: 300px" v-model="block.moduleTitle"></Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">图片</label>
      <div class="module-control-content">
        <Button @click.native="getUpload" style="margin-bottom: 10px">上传图片</Button>
        <div class="upload-list">
          <div class="upload-list-item" v-for="(item,index) in initial.imageList">
            <img :src="item.imageUrl" style="max-width: 100%;height: 100%">
            <div class="upload-list-cover">
              <Icon type="ios-eye-outline" class="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-trash-outline" class="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="uploadPicker" class="upload-target"></div>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';

  export default {
    name: "imgs-group-module",
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
        uploader: null, //上传对象
      }
    },
    mounted() {
      this.initUpload();
      this.initial = new Object(null);

      this.$api.qrcodeInterface.getModule({
        moduleId: this.block.moduleId
      }).then(res => {
        if (res.data.success) {
          new ToolFunctor(this)._get({...res.data.data});
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
      initUpload() {
        if (this.uploader) this.uploader.destroy();

        /* 初始化上传插件 */
        this.uploader = WebUploader.create({
          pick: {
            id: '#uploadPicker',
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
          server: `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${this.uploadId}`,
          duplicate: true,
          fileSingleSizeLimit: 1024 * 1024 * 1024,
          fileNumLimit: 50, //最大上传数目1000
          fileSizeLimit: 1024 * 1024 * 1024 * 1024 //单次文件上传限制1024G
        });

        /* 向队列里加入一个文件 */
        this.uploader.on('fileQueued', (_file) => {
          _file.progress = 0;

          return this.uploader.makeThumb(_file, (err, src) => {
            this.initial.imageList.push({
              imageName: _file.name,
              bucketName: '',
              ossKey: '',
              imageUrl: src,
              fileSize: WebUploader.Base.formatSize(_file.size),
              id: ''
            })
          });
        });

        this.uploader.on('uploadFinished', (file, response) => {
          this.uploader.reset();
        });

        this.uploader.on('uploadError', (file, reason) => {
          this.$Message.info('上传失败', 5000);
          this.uploader.reset();
        });
        return this.uploader.on('error', (type) => {
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
       * @param item
       */
      handleView(item) {
        this.$Modal.confirm({
          title: '预览图片',
          render: (h) => {
            return h('Img', {
              attrs: {
                src: item.imageUrl,
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
       * 移除图片
       * @param index
       */
      handleRemove(index) {
        this.initial.imageList.splice(index, 1);
      },
      /**
       * 获取uploadId
       */
      getUpload() {
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

          promise.then((resolve) => {
            this.uploader.options.server = `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${resolve}`;
            this.uploadId = resolve;
            document.querySelector('#uploadPicker .webuploader-element-invisible').click()
          }, (reject) => {
            this.$Message.error(reject);
          })
        } else {
          document.querySelector('#uploadPicker .webuploader-element-invisible').click()
        }
      },
      /**
       * 保存图集
       */
      saveImgsGroupModulePopup() {
        let param = new ToolFunctor(this)._set();
        this.$api.qrcodeInterface.saveModuleAtlasVO(param).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
          }
        }).catch(err => {
          console.error(err)
        })
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

    equal(fn) {
      return (...args) => {
        return fn.apply(this, args);
      }
    }

    _get(res) {
      let target = new Object(null);
      target.imageList = (() => {
        let a = [];
        if (res.moduleObject) {
          res.moduleObject.imageList.forEach(m => {
            a.push({
              imageName: m.imageName,
              imageUrl: m.imageUrl,
              bucketName: m.bucketName,
              ossKey: m.ossKey,
              fileSize: m.fileSize,
              id: m.id
            })
          });
        } else {
          a = []
        }

        return a;
      })();

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);
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
        let options = {
          moduleId: this.tis.block.moduleId,
          moduleTitle: this.tis.block.moduleTitle,
          moduleType: this.tis.block.moduleType,
          templateId: this.tis.$route.query.templateId,
          isFold: this.tis.block.isFold,
          sortId: this.tis.block.sortId,
          isUsed: this.tis.block.isUsed,
          hasNew: true,
          moduleObject: {
            imageList: (() => {
              let a = [];
              [...this.tis.initial.imageList].forEach(m => {
                a.push({
                  imageName: m.imageName,
                  bucketName: m.bucketName,
                  ossKey: m.ossKey,
                  imageUrl: this.tis.$Global.isUrl(m.imageUrl) ? m.imageUrl : '',
                  fileSize: m.fileSize ? m.fileSize : '',
                  id: m.id ? m.id : '',
                })
              });

              return a;
            })(),
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>

