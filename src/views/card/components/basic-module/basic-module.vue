<style lang="scss">
  @import "../../styles/mixin/mixin.scss";

  .card-detail__right {
    .basic-module-popup {
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
      @include b(field-layout) {
        @include b(l-list) {
          @include e(item) {
            float: left;
            height: 78px;
            width: 118px;
            margin-right: 10px;
            cursor: pointer;
            background-size: 118px auto;
            background-repeat: no-repeat;
            position: relative;
            overflow: hidden;
            .mark-check {
              display: none;
            }
            &.active {
              border: 1px solid #4caf50;
              .mark-check {
                position: absolute;
                z-index: 8;
                right: 1px;
                top: 0;
                font-size: 16px;
                color: #4caf50;
                display: block;
              }
            }
            &.first {
              background-image: url(http://static.clewm.net/static/images/vcard/layout-l@2x_b799bde.png);
            }
            &.second {
              background-image: url(//static.clewm.net/static/images/vcard/layout-m@2x_661deb3.png);
            }
            &.third {
              background-image: url(//static.clewm.net/static/images/vcard/layout-r@2x_4bfd7fa.png);
            }
          }
        }
      }
      @include b(img-list) {
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
    <a href="javascript:;" class="module-title">基本信息</a>
    <Form label-position="left" :label-width="100" class="form">
      <FormItem label="头像">
        <div class="img-list" v-for="(item,index) in initial.avatarList">
          <img :src="item.imageUrl" class="img-list--img">
          <div class="img-list__cover">
            <Icon type="ios-eye-outline" class="img-list__cover--icon"
                  @click.native="handleView({type:0,item:item})"></Icon>
            <Icon type="ios-trash-outline" class="img-list__cover--icon"
                  @click.native="handleRemove({type:0,index:index})"></Icon>
          </div>
        </div>
        <div v-if="initial.avatarList && !initial.avatarList.length">
          <Button type="default" @click="getUpload({type:0})">
            上传头像
          </Button>
        </div>
      </FormItem>
      <FormItem label="封面图">
        <div class="img-list" v-for="(item,index) in initial.coverList">
          <img :src="item.imageUrl" class="img-list--img">
          <div class="img-list__cover">
            <Icon type="ios-eye-outline" class="img-list__cover--icon"
                  @click.native="handleView({type:1,item:item})"></Icon>
            <Icon type="ios-trash-outline" class="img-list__cover--icon"
                  @click.native="handleRemove({type:1,index:index})"></Icon>
          </div>
        </div>
        <div v-if="initial.coverList && !initial.coverList.length">
          <Button type="default" @click="getUpload({type:1})">
            选择封面图
          </Button>
        </div>
      </FormItem>
      <FormItem label="姓名" v-for="(item,index) in initial.fullName" :key="index">
        <Input style="width: 400px" v-model="item.value" placeholder="必填"></Input>
      </FormItem>
      <FormItem label="职位" v-for="(item,index) in initial.position" :key="index">
        <Input style="width: 400px" v-model="item.value"></Input>
      </FormItem>
      <FormItem :label="key === 0 && '公司'" class="form__item" v-for="(item,key) in initial.departMentList" :key="key">
        <Input class="form__item--title" v-model="item.name" v-if="key !== 0"></Input>
        <Input style="width: 400px" v-model="item.value"></Input>
        <Icon type="plus-circled" class="form__item--icon" @click.native="onCompanyPlus" v-if="key === 0"></Icon>
        <Icon type="ios-trash" class="form__item--icon form__item--trash" @click.native="onCompanyTrash(key)"
              v-if="key !== 0"></Icon>
      </FormItem>
      <FormItem label="展示位置">
        <div class="field-layout">
          <ul class="l-list" v-if="initial.layOut && initial.layOut.length">
            <li :class="['l-list__item',{'active' : item.layOut === (initial.layOut[0].value)},item.value]"
                v-for="item in layOutList"
                @click="initial.layOut[0].value = item.layOut">
              <Icon type="checkmark-circled" class="mark-check"></Icon>
            </li>
          </ul>
        </div>
      </FormItem>
    </Form>
    <div id="avatarPicker" class="upload-target"></div>
    <div id="coverPicker" class="upload-target"></div>
  </popup-modal>
</template>

<script>
  import {mapGetters} from 'vuex';
  import popupModal from '../popup-modal/modal.vue';

  export default {
    name: "basic-module",
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
        avatarUploader: null, //上传头像对象
        coverUploader: null, //上传封面对象
        layOutList: [
          {
            layOut: 0,
            value: 'first'
          },
          {
            layOut: 1,
            value: 'second'
          },
          {
            layOut: 2,
            value: 'third'
          }
        ]
      }
    },
    mounted() {
      this.initAvatarImageUpload();
      this.initBackGroundImageUpload();
      this.toolFunctor = new ToolFunctor(this);
      this.toolFunctor._get({});
    },
    methods: {
      onClose() {
        this.$emit('update:cardType', null);
      },
      initAvatarImageUpload() {
        if (this.avatarUploader) this.avatarUploader.destroy();

        /* 初始化上传插件 */
        this.avatarUploader = WebUploader.create({
          pick: {
            id: '#avatarPicker',
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
        this.avatarUploader.on('fileQueued', (_file) => {
          _file.progress = 0;

          return this.avatarUploader.makeThumb(_file, (err, src) => {
            this.initial.avatarList = new Array({
              imageName: _file.name,
              bucketName: '',
              ossKey: '',
              imageUrl: src,
              fileSize: WebUploader.Base.formatSize(_file.size),
              id: ''
            })
          });
        });

        this.avatarUploader.on('uploadFinished', (file, response) => {
          this.avatarUploader.reset();
        });

        this.avatarUploader.on('uploadError', (file, reason) => {
          this.$Message.info('上传失败', 5000);
          this.avatarUploader.reset();
        });
        return this.avatarUploader.on('error', (type) => {
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
      initBackGroundImageUpload() {
        if (this.coverUploader) this.coverUploader.destroy();

        /* 初始化上传插件 */
        this.coverUploader = WebUploader.create({
          pick: {
            id: '#coverPicker',
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
        this.coverUploader.on('fileQueued', (_file) => {
          _file.progress = 0;

          return this.coverUploader.makeThumb(_file, (err, src) => {
            this.initial.coverList = new Array({
              imageName: _file.name,
              bucketName: '',
              ossKey: '',
              imageUrl: src,
              fileSize: WebUploader.Base.formatSize(_file.size),
              id: ''
            })
          });
        });

        this.coverUploader.on('uploadFinished', (file, response) => {
          this.coverUploader.reset();
        });

        this.coverUploader.on('uploadError', (file, reason) => {
          this.$Message.info('上传失败', 5000);
          this.coverUploader.reset();
        });
        return this.coverUploader.on('error', (type) => {
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
        (param.type === 0 && this.initial.avatarList.splice(param.index, 1)) || (param.type === 1 && this.initial.coverList.splice(param.index, 1))
      },
      onCompanyPlus() {
        this.initial.departMentList.push({
          name: '部门',
          value: ''
        })
      },
      onCompanyTrash(key) {
        this.initial.departMentList.splice(key, 1)
      },
      getUpload(param) {
        const picker = () => {
          switch (param.type) {
            case 0:
              document.querySelector('#avatarPicker .webuploader-element-invisible').click();
              break;
            case 1:
              document.querySelector('#coverPicker .webuploader-element-invisible').click();
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
            this.avatarUploader.options.server = `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${resolve}`;
            this.coverUploader.options.server = `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${resolve}`;
            this.$store.dispatch('setUploadId', resolve);
            picker();
          }, (reject) => {
            this.$Message.error(reject);
          })
        } else {
          picker();
        }
      },
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
      // 头像
      target.avatarList = res.avatarImage ? res.avatarImage : [];
      // 封面图
      target.coverList = res.backGroundImage ? res.backGroundImage : [];
      // 姓名
      target.fullName = res.fullName ? res.fullName : '';
      // 职位
      target.position = res.position ? res.position : '';
      // 公司
      target.departMentList = res.company ? res.company.departMentList : (() => {
        return new Array({
          name: '公司',
          value: ''
        });
      })();

      target.layOut = res.layOut ? res.layOut : 0;

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);
      let avatarList = this.tis.initial.avatarList;
      let coverList = this.tis.initial.coverList;

      target.cardBaseInfo = (() => {
        let options;
        options = {
          avatarImage: { // 头像
            imageName: avatarList.length ? avatarList[0].imageName : '',
            bucketName: avatarList.length ? avatarList[0].bucketName : '',
            ossKey: avatarList.length ? avatarList[0].ossKey : '',
            imageUrl: avatarList.length ? (this.tis.$Global.isUrl(avatarList[0].imageUrl) ? avatarList[0].imageUrl : '') : '',
            fileSize: avatarList.length ? avatarList[0].fileSize : '',
            id: avatarList.length ? avatarList[0].id : '',
          },
          backGroundImage: { // 封面图
            imageName: coverList.length ? coverList[0].imageName : '',
            bucketName: coverList.length ? coverList[0].bucketName : '',
            ossKey: coverList.length ? coverList[0].ossKey : '',
            imageUrl: coverList.length ? (this.tis.$Global.isUrl(coverList[0].imageUrl) ? coverList[0].imageUrl : '') : '',
            fileSize: coverList.length ? coverList[0].fileSize : '',
            id: coverList.length ? coverList[0].id : '',
          },
          fullName: this.tis.$Global.isArray(this.tis.initial.fullName) ? this.tis.initial.fullName[0].value : this.tis.initial.fullName, // 姓名
          position: this.tis.$Global.isArray(this.tis.initial.position) ? this.tis.initial.position[0].value : this.tis.initial.position, // 职位
          company: { // 公司
            departMentList: this.tis.initial.departMentList
          },
          layOut: this.tis.$Global.isArray(this.tis.initial.layOut) ? this.tis.initial.layOut[0].value : this.tis.initial.layOut // 展示位置
        };

        return options
      })();

      return target;
    }
  }
</script>

