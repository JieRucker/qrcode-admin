<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__right {
    .imgs-txt-module-popup {
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
            @include module-main-panel;
          }
        }
      }
      .upload-list {
        display: inline-block;
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
      .upload-icon {
        width: 58px;
        height: 58px;
        line-height: 58px;
        background: #fff;
        border: 1px dashed #dddee1;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: border-color .2s ease;
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveImgsTxtModulePopup">
    <a href="javascript:;" class="module-title">图文模块操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">模块标题</label>
      <div class="module-control-content">
        <Input style="width: 300px"
               v-model="block.moduleTitle">
        </Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">图片</label>
      <div class="module-control-content">
        <div class="upload-list" v-for="(item,index) in initial.imageList">
          <img :src="item.imageUrl" style="max-width: 100%;height: 100%;">
          <div class="upload-list-cover">
            <Icon type="ios-eye-outline" class="ios-eye-outline" @click.native="handleView(item)"></Icon>
            <Icon type="ios-trash-outline" class="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
          </div>
        </div>
        <div v-if="initial.imageList && !initial.imageList.length">
          <div class="upload-icon" @click="getUpload">
            <Icon type="camera" size="20"></Icon>
          </div>
        </div>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">正文内容</label>
      <div class="module-control-content">
        <div class="editor-panel">
          <quill-editor
            ref="imgsTxtEditor"
            v-model="initial.textContent"
            :config="quillEditorOption"
            @change="onImgsTxtEditorChange($event)">
          </quill-editor>
        </div>
      </div>
    </div>
    <div id="uploadPicker" class="upload-target"></div>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';
  import 'quill/dist/quill.snow.css';
  import {quillEditor} from 'vue-quill-editor';

  export default {
    name: "imgs-txt-module",
    components: {
      popupModal,
      quillEditor
    },
    props: {
      currentTab: String,
      block: Object,
    },
    computed: {
      imgsTxtEditor() {
        return this.$refs.imgsTxtEditor.quill
      }
    },
    data() {
      return {
        quillEditorOption: {}, // 文本编辑器设置
        initial: new Object(null),
        uploadId: null,
        uploader: null, //上传对象
      }
    },
    mounted() {
      this.initUpload();

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

          /* 第一步 */
          _file.progress = 0;

          return this.uploader.makeThumb(_file, (err, src) => {

            /* 第三步 */
            this.initial.imageList = new Array({
              imageName: _file.name,
              bucketName: '',
              ossKey: '',
              imageUrl: src,
              fileSize: WebUploader.Base.formatSize(_file.size),
              id: ''
            })
          });
        });

        /* 上传成功 */
        this.uploader.on('uploadFinished', (file, response) => {
          this.uploader.reset();
        });

        /* 上传失败 */
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
        this.initial.imageList.splice(index, 1)
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
       * 正文内容
       */
      onImgsTxtEditorChange({quill, html, text}) {
        this.initial.textContent = html;
      },
      /**
       * 保存图文
       */
      saveImgsTxtModulePopup() {
        let param = new ToolFunctor(this)._set();

        this.$api.qrcodeInterface.saveModuleImageTextVO(param).then(res => {
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
        let a = null;

        if (res.moduleObject && !this.tis.$Global.isBlank(res.moduleObject.image.imageUrl)) {
          a = new Array({
            imageName: res.moduleObject.image.imageName,
            bucketName: res.moduleObject.image.bucketName,
            ossKey: res.moduleObject.image.ossKey,
            imageUrl: res.moduleObject.image.imageUrl,
            fileSize: res.moduleObject.image.fileSize,
            id: res.moduleObject.image.id
          })
        } else {
          a = []
        }

        return a;
      })();

      // 正文内容
      target.textContent = res.moduleObject ? res.moduleObject.textContent : '';

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);
      let imageList = this.tis.initial.imageList;
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
            textContent: this.tis.initial.textContent, // 正文内容
            image: {
              imageName: imageList.length ? imageList[0].imageName : '',
              bucketName: imageList.length ? imageList[0].bucketName : '',
              ossKey: imageList.length ? imageList[0].ossKey : '',
              imageUrl: imageList.length ? (this.tis.$Global.isUrl(imageList[0].imageUrl) ? imageList[0].imageUrl : '') : '',
              fileSize: imageList.length ? imageList[0].fileSize : '',
              id: imageList.length ? imageList[0].id : '',
            }
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>

