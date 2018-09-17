<style lang="scss" scoped>
  .img {
    background-size: cover;
    width: 100%;
    height: 350px;
    float: left;
  }

  .action {
    float: left;
    margin-top: 22px;
    max-width: 340px;
    p {
      color: #999;
      margin-top: 10px;
    }
    @include b(l-list) {
      margin-top: 10px;
      @include e(item) {
        width: 165px;
        height: 24px;
        line-height: 24px;
      }
    }
  }
</style>

<template>
  <Row :gutter="10">
    <Col span="18">
      <div class="img" :style="excelImage"></div>
    </Col>
    <Col span="6">
      <div class="action">
        <Button type="primary" size="large" @click="_upload">上传Excel</Button>
        <p>支持5M以内的xls/xlsx/csv文件,整个文件不超过1000行、50列</p>
        <ul class="l-list clearfix">
          <li class="l-list__item" v-for="item in excelList">{{item.value}}</li>
        </ul>
      </div>
    </Col>
  </Row>
</template>

<script>
  export default {
    name: "infoUpload",
    props: {
      currentTab: String
    },
    data() {
      return {
        excelList: [ // excel表格数据
          {
            key: 0,
            value: '大型机械设备(例).xlsx'
          },
          {
            key: 1,
            value: '实测实量(例).xlsx'
          },
          {
            key: 2,
            value: '配电箱管理(例).xlsx'
          },
          {
            key: 3,
            value: '物资管理(例).xlsx'
          },
          {
            key: 4,
            value: '人员信息(例).xlsx'
          },
          {
            key: 5,
            value: '消防管理(例).xlsx'
          },
          {
            key: 6,
            value: '施工质量管理(例).xlsx'
          }
        ]
      }
    },
    computed: {
      excelImage() {
        return {
          backgroundImage: `url(${process.env.api.staticUrl}static/images/qrcode/excel.png)`,
        }
      },
    },
    mounted() {
      this.initUpload();
    },
    methods: {
      _upload() {
        this.$emit('update:currentTab', 'infoTable');
        this.$emit('update:currentStep', 1);
        // this.getUpload();
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
            title: 'Excel',
            extensions: 'csv,xls,xlsx',
            mimeTypes: '.csv,.xls,.xlsx'
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

        /* 上传完成 */

        this.uploader.on('uploadFinished', (file, response) => {
          this.$api.authUserInterface.batchSaveAuthUser({
            authUserGroupId: this.formData.list.authGroupId,
            uploadId: this.uploadId
          }).then(res => {
            res = res.data;
            this.$Message.info(res.retMsg);
            if (res.success) {
              this._getAuthGroup();
            }
          }).catch(err => {
            console.error(err.message)
          });

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
    }
  }
</script>


