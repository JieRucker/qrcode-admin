<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .qrcode-detail__right {
    .product-setting-module-popup {
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
          width: 100%;
          .field-form {
            border: 1px solid #dedede;
            background-color: #fafafa;
            margin-top: 30px;
            .set-form-table {
              width: 100%;
              border-bottom: 1px solid #ddd;
              margin: 0;
              background-color: #F2F2F2;
              display: table-row;
              .cols {
                display: table-cell;
                zoom: 1;
                text-align: center;
                padding: 4px 5px;
                background: #f2f2f2;
                border-left: 1px solid #ddd;
                label {
                  line-height: 30px;
                  height: 30px;
                  vertical-align: middle;
                  font-size: 14px;
                }
              }
              .cols1 {
                width: 194px;
                border-left: 0;
              }
              .cols2 {
                width: 114px;
              }
              .cols3 {
                width: 200px;
              }
              .cols4 {
                width: 80px;
              }
            }
            .data-list {
              background-color: #fafafa;
              border-bottom: 1px solid #dedede;
              .cols {
                zoom: 1;
                text-align: left;
                padding: 10px 5px;
                border-left: 1px solid #ddd;
                display: table-cell;
                height: 30px;
                vertical-align: middle;
              }
              .cols1 {
                width: 194px;
                border-left: 0;
                label {
                  input {
                    vertical-align: middle;
                    margin-right: 2px;
                    margin-left: 5px;
                    margin-top: -3px;
                  }
                }
              }
              .cols2 {
                width: 114px;
              }
              .cols3 {
                width: 200px;
                text-align: center;
              }
              .cols4 {
                width: 80px;
                text-align: center;
              }
            }
            .addform-box {
              padding: 10px;
              border-top: 0;
              .trans {
                display: block;
                border: 1px dashed #ccc;
                padding: 8px 0;
                text-align: center;
                color: #666;
                cursor: pointer;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
</style>

<template>
  <popup-modal :block="block" @on-close="onClose" @on-ok="saveProductSettingPanel">
    <a href="javascript:;" class="module-title">参数模块操作教程</a>
    <div class="module-group clearfix">
      <div class="module-control-content">
        <div class="field-form">
          <div class="set-form-table">
            <div class="cols cols1"><label>栏目名称</label></div>
            <div class="cols cols2"><label>数据类型</label></div>
            <div class="cols cols3"><label>内容</label></div>
            <div class="cols cols4"><label>操作</label></div>
          </div>
          <div class="data-list" v-for="(item,index) in initial.productParameterList">
            <div class="cols cols1">
              <Input style="width: 125px" v-model="item.paramName"></Input>
              <Checkbox v-model="item.displayable">显示
              </Checkbox>
            </div>
            <div class="cols cols2">
              <Select v-model="item.type" style="width:100px">
                <Option v-for="data in initial.typeList" :value="data.key" :key="data.key">{{data.value}}
                </Option>
              </Select>
            </div>
            <div class="cols cols3">
              <Input style="width: 180px" placeholder="请输入文本内容" v-if="item.type === 0"
                     v-model="item.text"></Input>
              <Button type="primary" v-if="item.type === 1" @click="getUpload(index)">上传图片</Button>
              <ul v-if="item.type === 1" style="display: inline-block;">
                <li v-if="item.image && item.image.imageUrl !== ''">
                  <img :src="item.image.imageUrl"
                       style="width: 40px;height: 30px;vertical-align: middle;"/>
                </li>
              </ul>
              <div v-if="item.type === 2">
                <Input style="width: 180px" placeholder="请输入链接名称" v-model="item.link.linkName"></Input>
                <Input style="width: 180px;margin-top:5px" placeholder="请输入链接地址" v-model="item.link.linkUrl"></Input>
              </div>
              <div v-if="item.type === 3">
                <Input type="textarea" :rows="2" placeholder="请输入文本内容" v-model="item.textarea"></Input>
              </div>
            </div>
            <div class="cols cols4">
              <Icon type="trash-a" size="18" @click.native="deleteIcon(index)" style="cursor: pointer"></Icon>
            </div>
          </div>
          <div class="addform-box">
            <div class="trans" @click="addNewItem">添加一个新的栏目</div>
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
    name: "product-setting-module",
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
        currentIndex: 0
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
            this.initial.productParameterList[this.currentIndex].image.imageName = _file.name;
            this.initial.productParameterList[this.currentIndex].image.imageUrl = src;
            this.initial.productParameterList[this.currentIndex].image.fileSize = WebUploader.Base.formatSize(_file.size);
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
       * 获取uploadId
       * @param index
       */
      getUpload(index) {
        this.currentIndex = index;

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
       * 添加参数
       */
      addNewItem() {
        let param = new ToolFunctor(this)._JSON().productParameterList[0];
        this.initial.productParameterList.push(param)
      },
      /**
       * 移除参数
       * @param index
       */
      deleteIcon(index) {
        this.initial.productParameterList.splice(index, 1)
      },
      /**
       * 保存参数
       */
      saveProductSettingPanel() {
        let param = new ToolFunctor(this)._set();
        this.$api.qrcodeInterface.saveModuleProductParameterVO(param).then(res => {
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

      target.typeList = (() => {
        return this._JSON().typeList;
      })();

      target.productParameterList = (() => {
        let a = [];
        if (res.moduleObject) {
          [...res.moduleObject.productParameterList].forEach(m => {
            a.push({
              paramName: m.paramName ? m.paramName : '',//栏目名称
              type: m.type ? m.type : 0,//类型 0文本 1图片 2链接 3多行文本 4分组名称
              displayable: m.displayable ? m.displayable : false, // 是否显示 false不显示 true显示
              text: m.text ? m.text : '',//文本
              image: {
                imageName: m.image ? m.image.imageName : '',
                bucketName: m.image ? m.image.bucketName : '',
                ossKey: m.image ? m.image.ossKey : '',
                imageUrl: m.image ? m.image.imageUrl : '',
                fileSize: m.image ? m.image.fileSize : '',
                id: m.image ? m.image.id : ''
              },
              link: {
                linkName: m.link ? m.link.linkName : '',
                linkUrl: m.link ? m.link.linkUrl : ''
              },
              textarea: m.textarea ? m.textarea : ''//多行文本
            })
          })
        } else {
          a = this._JSON().productParameterList
        }

        return a;
      })();

      return this.tis.initial = target;
    }

    _JSON() {
      let typeList = [{
        key: 0,
        value: '文本'
      },
        {
          key: 1,
          value: '图片'
        },
        {
          key: 2,
          value: '链接'
        },
        {
          key: 3,
          value: '多行文本'
        },
        {
          key: 4,
          value: '分组名称'
        }];

      let productParameterList = [{
        paramName: '',//栏目名称
        type: 0,//类型 0文本 1图片 2链接 3多行文本 4分组名称
        displayable: true, // 是否显示 false不显示 true显示
        text: '',//文本
        image: {
          imageName: '',
          bucketName: '',
          ossKey: '',
          imageUrl: '',
          fileSize: '',
          id: ''
        },
        link: {
          linkName: '',
          linkUrl: ''
        },
        textarea: ''//多行文本
      }];

      return {
        typeList,
        productParameterList
      }
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
            productParameterList: (() => {
              let a = [];

              const assign = (() => {
                return (object, options) => {
                  const DEFAULTS = {
                    paramName: object.paramName,
                    type: object.type,
                    displayable: object.displayable,
                    image: {
                      imageName: '',
                      bucketName: '',
                      ossKey: '',
                      imageUrl: '',
                      fileSize: '',
                      id: ''
                    },
                  };
                  return Object.assign({}, DEFAULTS, options);
                }
              })();


              [...this.tis.initial.productParameterList].forEach(m => {
                switch (m.type) {
                  case 0:
                    a.push(assign(m, {
                      text: m.text,
                    }));
                    break;
                  case 1:
                    a.push(assign(m, {
                      image: {
                        imageName: m.image.imageName,
                        bucketName: m.image.bucketName,
                        ossKey: m.image.ossKey,
                        imageUrl: (this.tis.$Global.isUrl(m.image.imageUrl) ? m.image.imageUrl : ''),
                        fileSize: m.image.fileSize,
                        id: m.image.id
                      }
                    }));
                    break;
                  case 2:
                    a.push(assign(m, {
                      link: {
                        linkName: m.link.linkName,
                        linkUrl: m.link.linkUrl
                      }
                    }));
                    break;
                  case 3:
                    a.push(assign(m, {
                      textarea: m.textarea,
                    }));
                    break;
                  case 4:
                    a.push(assign(m, {
                      textarea: m.textarea,
                    }));
                    break;
                }
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

