<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__right {
    .web-nav-module-popup {
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
        margin-bottom: 15px;
        .module-control-label {
          @include module-control-label;
        }
        .module-control-content {
          float: left;
          width: 75%;
          .l-list {
            @include e(item) {
              display: flex;
              margin-bottom: 5px;
              border-bottom: 1px solid #e0e0e0;
              &:last-child {
                border-bottom: 0;
              }
              @include m(img) {
                width: 22px;
                height: 22px;
                float: left;
              }
              @include m(name) {
                margin-left: 10px;
                vertical-align: middle;
              }
              @include m(icon) {
                font-size: 16px;
                margin-right: 10px;
                cursor: pointer;
              }
            }
            @include e(icon) {
              width: 30%;
              padding: 11px 0;
            }

          }
          .module-main-panel {
            @include module-main-panel(8px 0);
            .mobile-visible-panel {
              .inline {
                vertical-align: middle;
                margin-right: 15px
              }
            }
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

  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }

  .component-fade-enter, .component-fade-leave-to {
    opacity: 0;
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveWebNavModulePopup">
    <a href="javascript:;" class="module-title">网址模块操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">模块标题</label>
      <div class="module-control-content">
        <Input style="width: 300px" v-model="block.moduleTitle"></Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">图片</label>
      <div class="module-control-content">
        <div class="upload-list" v-for="item in initial.imageList">
          <img :src="item.imageUrl" style="max-width: 100%;height: 100%">
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
      <label class="module-control-label">导航内容</label>
      <div class="module-control-content">
        <ul class="l-list" v-if="initial.navigationList && initial.navigationList.length">
          <li class="l-list__item" v-for="(item,index) in initial.navigationList">
            <div class="l-list__icon">
              <img :src="item.icon.iconUrl" class="l-list__item--img">
              <span class="l-list__item--name">{{item.navigationName}}</span>
            </div>
            <div style="padding: 14px 10px">
              <Icon type="arrow-up-c" class="l-list__item--icon l-list__item--arrowup"
                    @click.native="sortChange('up',index)"></Icon>
              <Icon type="arrow-down-c" class="l-list__item--icon l-list__item--arrowdown"
                    @click.native="sortChange('down',index)"></Icon>
              <Icon type="edit" class="l-list__item--icon l-list__item--arrowdown"
                    @click.native="showModal({type:1,index:index})"></Icon>

              <Icon type="trash-a" class="l-list__item--icon l-list__item--trash"
                    @click.native="trash(index)"></Icon>
            </div>
          </li>
        </ul>
        <Button @click.native="showModal({type:0})">
          <Icon type="plus-round" size="12"></Icon>&nbsp;添加
        </Button>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">导航样式</label>
      <div class="module-control-content">
        <div class="module-main-panel">
          <div class="mobile-visible-panel" style="padding: 0 10px">
            <RadioGroup v-model="initial.navigationType">
              <Radio :label="item.key" v-for="(item,index) in initial.navigationTypeList" :key="index">{{item.value}}
              </Radio>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>

    <transition name="component-fade" mode="out-in">
      <component
        v-bind:is="currentTabComponent"
        :key="index"
        :navigationNative.sync="initial.navigationNative"
        :navigationList.sync="initial.navigationList"
        :currentModal.sync="currentModal"
      ></component>
    </transition>
    <div id="uploadPicker" class="upload-target"></div>
  </popup-modal>
</template>

<script>
  import popupModal from '../popup-modal/modal.vue';
  import webNavNature from './modal/web-nav-nature.vue';

  export default {
    name: "web-nav-module",
    components: {
      popupModal,
      webNavNature
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
        currentModal: '', // 当前Modal
        modalDialog: ['web-nav-nature']
      }
    },
    computed: {
      currentTabComponent() {
        return this.currentModal.toLowerCase()
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
       * 显示网址弹窗
       * @param option
       */
      showModal(option) {
        this.$Global.timeout(100).then(() => {
          this.currentModal = this.modalDialog[0];
        });

        switch (option.type) {
          case 0:
            this.initial.navigationNative = new Object({
              modalType: option.type,
              navigationName: '',
              icon: {
                iconName: '',
                iconUrl: 'https://static.clewm.net/static/images/module_title_icon/n/39_small_155713f.png',
                bucketName: '',
                ossKey: '',
                fileSize: '',
                id: ''
              },
              actionType: 0, // 0链接  1页面定位  2素材
              linkUrl: '', // 模板编号 actionType为0值时
              pageNavigationName: '', // 页面定位 actionType为1值时 页面定位 的意思 就是点 可以立即定位到下面的某个位置，例如：它对应的是素材下的某个模块;维护模板下的巡检记录;图文模块;标题 总之任何一个moduleId
              pageNavigationId: '',
              templateName: '',
              templateId: '' // 模板编号 actionType为2值时
            });

            console.log(this.initial.navigationNative);
            break;
          case 1:
            let index = option.index;
            this.initial.navigationNative = Object.assign({}, {
              modalType: option.type,
              currentIndex: option.index
            }, this.initial.navigationList[index]);
            console.log(this.initial.navigationNative);
            break;
        }
      },
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
       * 排序
       * @param sortType
       * @param index
       */
      sortChange(sortType, index) {
        // arr数组，index当前元素下标，endIndex拖动到的位置下标
        const sort = (() => {
          return (arr, index, endIndex) => {
            if (index > endIndex) {
              arr.splice(endIndex, 0, arr[index]);
              arr.splice(index + 1, 1);
            } else {
              arr.splice(endIndex + 1, 0, arr[index]);
              arr.splice(index, 1);
            }
          }
        })();

        const formatSort = (() => {
          return (list) => {
            for (let i = 0, len = list.length; i < len; i++) {
              list[i].sortId = i;
            }
          }
        })();

        switch (sortType) {
          case 'up':
            let list = this.initial.navigationList;
            sort(list, index, index === 0 ? list.length - 1 : index - 1);
            formatSort(list);
            break;
          case 'down':
            let list1 = this.initial.navigationList;
            sort(list1, index, index === list1.length - 1 ? 0 : index + 1);
            formatSort(list1);
            break;
        }
      },
      /**
       * 移除网址
       * @param index
       */
      trash(index) {
        this.initial.navigationList.splice(index, 1)
      },
      /**
       * 保存网址
       */
      saveWebNavModulePopup() {
        let param = new ToolFunctor(this)._set();
        this.$api.qrcodeInterface.saveModuleNavigationVO(param).then(res => {
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
      target.navigationNative = new Object(null);
      target.imageList = (() => {
        let a = null;

        if (res.moduleObject && res.moduleObject.image && !this.tis.$Global.isBlank(res.moduleObject.image.imageUrl)) {
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

      target.navigationTypeList = this._JSON().navigationTypeList;

      target.navigationList = (() => {
        let a = [];
        if (res.moduleObject && res.moduleObject.navigationList && res.moduleObject.navigationList.length) {
          let navigationList = res.moduleObject.navigationList;
          [...navigationList].forEach(m => {
            a.push({
              navigationName: m.navigationName,// 导航名称
              icon: m.icon,
              actionType: m.actionType,// 0链接  1页面定位  2素材
              linkUrl: m.linkUrl,// 模板编号 actionType为0值时
              pageNavigationName: m.pageNavigationName, // 页面定位 actionType为1值时 页面定位 的意思 就是点 可以立即定位到下面的某个位置，例如：它对应的是素材下的某个模块;维护模板下的巡检记录;图文模块;标题 总之任何一个moduleId
              pageNavigationId: m.pageNavigationId,
              templateName: m.templateName,
              templateId: m.templateId // 模板编号 actionType为2值时
            })
          })
        } else {
          a = [];
        }

        return a;
      })();

      // 导航样式 0一行一项 1一行两项 2一行三项 3一行四项 4智能排列
      target.navigationType = res.moduleObject && res.moduleObject.navigationType ? res.moduleObject.navigationType : 4;

      return this.tis.initial = target;
    }

    _JSON() {
      let navigationTypeList = [{
        key: 0,
        value: '一行一项'
      },
        {
          key: 1,
          value: '一行两项'
        },
        {
          key: 2,
          value: '一行三项'
        },
        {
          key: 3,
          value: '一行四项'
        },
        {
          key: 4,
          value: '智能排列'
        }];

      return {
        navigationTypeList
      }
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
            image: {
              imageName: imageList.length ? imageList[0].imageName : '',
              bucketName: imageList.length ? imageList[0].bucketName : '',
              ossKey: imageList.length ? imageList[0].ossKey : '',
              imageUrl: imageList.length ? (this.tis.$Global.isUrl(imageList[0].imageUrl) ? imageList[0].imageUrl : '') : '',
              fileSize: imageList.length ? imageList[0].fileSize : '',
              id: imageList.length ? imageList[0].id : '',
            },
            navigationType: this.tis.initial.navigationType,
            navigationList: (() => {
              let a = this.tis.initial.navigationList;
              [...a].forEach(m => {
                m.icon.iconUrl = this.tis.$Global.isUrl(m.icon.iconUrl) ? m.icon.iconUrl : '';
              });

              return a;
            })()
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>

