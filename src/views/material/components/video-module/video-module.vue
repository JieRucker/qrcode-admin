<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .material-detail__right {
    .video-module-popup {
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
            .mobile-visible-panel {
              .inline {
                vertical-align: middle;
                margin-right: 15px
              }
            }
            .mobile-userGroup-panel {
              margin-top: 10px;
              .inline {
                vertical-align: middle;
                margin-right: 15px
              }
            }
            .mobile-password-panel {
              margin-top: 10px;
              .inline {
                vertical-align: middle;
                margin-right: 15px
              }
            }
          }
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveVideoModulePopup">
    <a href="javascript:;" class="module-title">视频模块操作教程</a>
    <div class="module-group clearfix">
      <label class="module-control-label">模块标题</label>
      <div class="module-control-content">
        <Input style="width: 300px" v-model="block.moduleTitle"></Input>
      </div>
    </div>
    <div class="module-group clearfix">
      <label class="module-control-label">文件</label>
      <div class="module-control-content">
        <div class="upload-list" v-for="(item,index) in initial.videoList" style="margin-bottom: 10px">
          <Input style="width: 200px" v-model="item.videoName"></Input>
          <Input style="width: 200px;margin-left: 5px" v-model="item.videoUrl"></Input>
          <Icon type="ios-trash-outline" size="18" style="vertical-align: middle;margin-left: 5px;cursor: pointer"
                class="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
        </div>

        <Button @click="getUpload" v-if="initial.videoList && !initial.videoList.length">上传文件</Button>
      </div>
    </div>

    <div class="module-group clearfix">
      <label class="module-control-label">权限设置</label>
      <div class="module-control-content">
        <div class="module-main-panel">
          <div class="mobile-visible-panel">
            <label class="inline">
              手机端显示:
              <Tooltip content="支持在手机端显示的权限设置" placement="right">
                <Icon type="help-circled" size="14" color="#bbb"></Icon>
              </Tooltip>
            </label>
            <Radio v-model="item.checked" :label="item.value" :key="index"
                   v-for="(item,index) in initial.displayAuthStateList" @on-change="checkPhoneShowLabel(index)"></Radio>
          </div>
          <div class="mobile-userGroup-panel" v-if="initial.displayAuthState === 2">
            <label class="inline">
              请选择用户组:
            </label>
            <Checkbox v-model="item.checked" :key="index"
                      v-for="(item,index) in initial.displayAuthGroupList">{{item.authGroupName}}
            </Checkbox>
          </div>
          <div class="mobile-password-panel" v-if="initial.displayAuthState === 3">
            <label class="inline">
              设置访问密码:
            </label>
            <Input v-model="initial.password" :maxlength="4" placeholder="请输入4位数字密码"
                   style="width: 150px"></Input>
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
    name: "video-module",
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
            extensions: 'mp4,swf,mkv,flv,avi,rmvb,mpeg,ogv,mov,wmv,webm',
            mimeTypes: '.mp4,.swf,.mkv,.flv,.avi,.rmvb,.mpeg,.ogv,.mov,.wmv,.webm'
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
            this.initial.videoList = new Array({
              videoName: _file.name,
              bucketName: '',
              ossKey: '',
              videoUrl: src,
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
       * 手机端显示的权限设置
       * @param index
       */
      checkPhoneShowLabel(index) {
        this.initial.displayAuthState = index;
        this.initial.displayAuthStateList.forEach((m) => {
          m.checked = false
        });

        this.initial.displayAuthStateList[index].checked = true;
        this.initial.displayAuthState = this.initial.displayAuthStateList[index].key;
      },
      /**
       * 移除视频
       * @param index
       */
      handleRemove(index) {
        this.initial.videoList.splice(index, 1)
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
       * 保存视频
       * @returns {*}
       */
      saveVideoModulePopup() {
        if ((() => {
          let key = 0;
          this.initial.displayAuthStateList.forEach((m) => {
            if (m.checked) key = m.key
          });

          return key;
        })() === 3 && this.$Global.isBlank(this.initial.password)) {
          return this.$Message.info('请输入密码')
        }

        let param = new ToolFunctor(this)._set();
        this.$api.qrcodeInterface.saveModuleVideoVO(param).then(res => {
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
      target.videoList = (() => {
        let a = [];
        if (res.moduleObject) {

          a = new Array({
            videoName: res.moduleObject.videoName,
            videoUrl: res.moduleObject.videoUrl,
            bucketName: res.moduleObject.bucketName,
            ossKey: res.moduleObject.ossKey,
            fileSize: res.moduleObject.fileSize,
            id: res.moduleObject.id
          })

        } else {
          a = []
        }

        return a;
      })();

      // 手机端显示的用户组号数组
      target.displayAuthGroupList = (() => {
        const promise = new Promise((resolve, reject) => {
          this.tis.$api.authUserInterface.listAuthGroup({}).then(res => {
            res = res.data;
            if (res.success) {
              resolve(res.data);
            }
          }).catch(err => console.error(err))
        });


        if (res.moduleObject) {
          let a = [];
          promise.then((resolve) => {
            [...resolve].forEach(m => {
              res.moduleObject.displayAuthGroupList.forEach(k => {
                if (m.authGroupId === k.authGroupId) {
                  m.checked = true
                }
              });

              a.push(m)
            })
          });

          return a;
        } else {
          let a = [];
          promise.then((resolve) => {
            [...resolve].forEach(m => {
              a.push(m)
            })
          });
          return a;
        }
      })();

      // 手机端显示状态数组
      target.displayAuthStateList = (() => {
        if (res.moduleObject) {
          let a = this._JSON().displayAuthStateList;
          a.forEach(m => {
            m.checked = false;
            if (res.moduleObject.displayAuthState === m.key) {
              m.checked = true;
            }
          });
          return a;
        } else {
          return this._JSON().displayAuthStateList;
        }
      })();

      // 手机端显示 0不显示 1所有人可见 2用户组 3密码
      target.displayAuthState = res.moduleObject ? res.moduleObject.displayAuthState : 0;
      // 权限密码 4位
      target.password = res.moduleObject ? res.moduleObject.displayAuthPassword : '';

      return this.tis.initial = target;
    }

    _JSON() {
      let displayAuthStateList = [{
        key: 0,
        value: '不显示',
        checked: false
      },
        {
          key: 1,
          value: '所有人可见',
          checked: true
        },
        {
          key: 2,
          value: '用户组',
          checked: false
        },
        {
          key: 3,
          value: '密码',
          checked: false
        }];

      return {
        displayAuthStateList
      }
    }

    _set() {
      let target = new Object(null);
      let videoList = this.tis.initial.videoList;
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
            displayAuthState: (() => {
              let key = null;
              this.tis.initial.displayAuthStateList.forEach((m) => {
                if (m.checked) key = m.key
              });

              return key;
            })(), //权限设置 0不显示 1所有人可见 2用户组 3密码
            displayAuthGroupList: (() => {
              let a = [];
              this.tis.initial.displayAuthGroupList.forEach(m => {
                if (m.checked) {
                  a.push({
                    authGroupName: m.authGroupName,
                    authGroupId: m.authGroupId
                  })
                }
              });
              return a;
            })(),
            displayAuthPassword: this.tis.initial.password,
            videoName: videoList.length ? videoList[0]['videoName'] : '',
            videoUrl: videoList.length ? (this.tis.$Global.isUrl(videoList[0]['videoUrl']) ? videoList[0]['videoUrl'] : '') : '',
            bucketName: videoList.length ? videoList[0]['bucketName'] : '',
            ossKey: videoList.length ? videoList[0]['ossKey'] : '',
            fileSize: videoList.length ? videoList[0]['fileSize'] : '',
            id: videoList.length ? videoList[0]['id'] : ''
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>

