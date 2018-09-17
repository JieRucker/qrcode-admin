<style lang="scss">
  @include b(q-download-mdl) {

    @include b(ivu-modal-footer) {
      border-top: 0;
      padding: 0;
    }

    @include b(ivu-modal-body) {
      padding: 0;
    }
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      background-color: #fff;
      @include b(card-1) {
        @include b(ivu-card-body) {
          padding: 0;
        }
        @include b(img) {
          text-align: center;
        }
        img {
          width: 200px;
          height: 200px;
        }
      }
      @include b(btn) {
        text-align: center;
        padding: 10px 0;
      }
    }
  }
</style>

<template>
  <Modal v-model="showModal" width="350" class="q-download-mdl" @on-visible-change="onVisible">
    <div slot="header" class="header">
      <span class="header--title">二维码</span>
    </div>
    <div class="body">
      <Card shadow class="card-1">
        <div class="img">
          <img :src="qrcodeImg">
        </div>
      </Card>

      <div class="btn">
        <Button type="primary" size="large" @click="qDload">下载</Button>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
  import QRCode from 'qrcode';

  export default {
    name: "q-download-mdl",
    components: {
      QRCode
    },
    props: {
      autoClose: {
        type: Boolean,
        default: true
      },
      confirmfunc: {
        type: Function,
      }
    },
    computed: {
      showModal() {
        return this.$store.getters.getSource('qDownloadMdl', 'second').dataSource.showModal
      },
      get() {
        return this.$store.getters.getSource('qDownloadMdl', 'second')
      }
    },
    data() {
      return {
        qrcodeImg: '' // 二维码图片
      }
    },
    mounted() {
      let _url = this.get.dataSource.templateObj.mobUrl;
      QRCode.toDataURL(_url)
        .then(url => {
          this.qrcodeImg = url;
        })
        .catch(err => console.error(err));
    },
    methods: {
      /**
       * 下载回调
       */
      qDload() {
        let templateId = this.get.dataSource.templateObj.templateId;
        (typeof this.confirmfunc === "function") && (this.confirmfunc.call(null, {
          isDownload: true,
          templateId: templateId,
          qrcodeImg: this.qrcodeImg
        }));
      },
      /**
       * 弹窗关闭destroy
       */
      onVisible(value) {
        value || this.$store.dispatch('setDestroy', {
          compType: 'second',
          compName: ['qDownloadMdl']
        });
      }
    }
  }
</script>
