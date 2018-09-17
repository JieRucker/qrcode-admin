<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .qrcode-detail__right {
    .imgs-module-popup {
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
            .mobile-editable-panel {
              margin-top: 10px;
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
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveImgsModulePopup">
    <a href="javascript:;" class="module-title">图片操作教程</a>
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
          <div class="mobile-editable-panel" v-if="initial.displayAuthState !== 0">
            <label class="inline">
              手机端编辑:
              <Tooltip content="支持在手机端显示的权限设置" placement="right">
                <Icon type="help-circled" size="14" color="#bbb"></Icon>
              </Tooltip>
            </label>
            <Radio v-model="item.checked" :label="item.value" :key="index"
                   v-for="(item,index) in initial.editAuthStateList" @on-change="checkPhoneEditLabel(index)"></Radio>
          </div>
          <div class="mobile-userGroup-panel" v-if="initial.displayAuthState !== 0 && initial.editAuthState === 1">
            <label class="inline">
              请选择用户组:
            </label>
            <Checkbox v-model="item.checked" :key="index"
                      v-for="(item,index) in initial.editAuthGroupList">{{item.authGroupName}}
            </Checkbox>
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
    name: "imgs-module",
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
       * 手机端编辑的权限设置
       * @param index
       */
      checkPhoneEditLabel(index) {
        this.initial.editAuthState = index;
        this.initial.editAuthStateList.forEach((m) => {
          m.checked = false
        });

        this.initial.editAuthStateList[index].checked = true;
        this.initial.editAuthState = this.initial.editAuthStateList[index].key;
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
       * 保存图片
       * @returns {*}
       */
      saveImgsModulePopup() {
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
        this.$api.qrcodeInterface.saveModuleImageVO(param).then(res => {
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

        if (res.moduleObject && !this.tis.$Global.isBlank(res.moduleObject.imageUrl)) {
          a = new Array({
            imageName: res.moduleObject.imageName,
            bucketName: res.moduleObject.bucketName,
            ossKey: res.moduleObject.ossKey,
            imageUrl: res.moduleObject.imageUrl,
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

      // 手机端可编辑的用户组号数组
      target.editAuthGroupList = (() => {
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
              res.moduleObject.editAuthGroupList.forEach(k => {
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

      // 手机端编辑状态数组
      target.editAuthStateList = (() => {
        if (res.moduleObject) {
          let a = this._JSON().editAuthStateList;
          a.forEach(m => {
            m.checked = false;
            if (res.moduleObject.editAuthState === m.key) {
              m.checked = true;
            }
          });
          return a;
        } else {
          return this._JSON().editAuthStateList;
        }
      })();

      // 手机端显示 0不显示 1所有人可见 2用户组 3密码
      target.displayAuthState = res.moduleObject ? res.moduleObject.displayAuthState : 0;
      // 0 不可编辑 1 可编辑
      target.editAuthState = res.moduleObject ? res.moduleObject.editAuthState : 0;
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

      let editAuthStateList = [{
        key: 0,
        value: '不可编辑',
        checked: true
      },
        {
          key: 1,
          value: '可编辑',
          checked: false
        }];

      return {
        displayAuthStateList,
        editAuthStateList
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
            displayAuthState: (() => {
              let key = null;
              this.tis.initial.displayAuthStateList.forEach((m) => {
                if (m.checked) key = m.key
              });

              return key;
            })(), //权限设置 0不显示 1所有人可见 2用户组 3密码
            displayAuthGroupList: (() => {
              let arr = [];
              this.tis.initial.displayAuthGroupList.forEach(m => {
                if (m.checked) {
                  arr.push({
                    authGroupName: m.authGroupName,
                    authGroupId: m.authGroupId
                  })
                }
              });
              return arr;
            })(),
            displayAuthPassword: this.tis.initial.password,
            editAuthState: (() => {
              let key = null;
              this.tis.initial.editAuthStateList.forEach((m) => {
                if (m.checked) key = m.key
              });

              return key;
            })(),
            editAuthGroupList: (() => {
              let arr = [];
              this.tis.initial.editAuthGroupList.forEach(m => {
                if (m.checked) {
                  arr.push({
                    authGroupName: m.authGroupName,
                    authGroupId: m.authGroupId
                  })
                }
              });
              return arr;
            })(),
            imageName: imageList.length ? imageList[0].imageName : '',
            bucketName: '',
            ossKey: '',
            imageUrl: imageList.length ? (this.tis.$Global.isUrl(imageList[0].imageUrl) ? imageList[0].imageUrl : '') : '',
            fileSize: imageList.length ? imageList[0].fileSize : '',
            id: imageList.length ? imageList[0].id : '',
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>

