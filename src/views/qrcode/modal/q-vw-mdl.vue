<style lang="scss">
  @include b(q-vw-mdl) {
    @include b(ivu-modal-content) {
      background-color: transparent;
    }

    @include b(ivu-modal-close) {
      right: -66px;
      top: -12px;
    }

    @include b(ivu-icon-ios-close-empty) {
      color: #fff !important;
      font-size: 40px !important;
    }

    @include b(ivu-modal-header) {
      border-bottom: 0;
      padding: 0;
    }

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
      position: relative;
      @include m(title) {
        font-size: 16px;
      }
      @include b(back) {
        width: 70px;
        height: 40px;
        top: 24px;
        position: absolute;
        cursor: pointer;
      }
    }
    @include b(body) {
      background-color: #fff;
      @include b(card-1) {
        position: absolute;
        left: -160px;
        top: 0;
        @include b(ivu-card-body) {
          padding: 0;
        }
        img {
          width: 140px;
          height: 140px;
        }
      }
      @include b(card-2) {
        position: absolute;
        left: -160px;
        top: 141px;
      }
    }
  }
</style>

<template>
  <Modal v-model="showModal" width="375" class="q-vw-mdl" :styles="{top: '40px'}" @on-visible-change="onVisible">
    <div slot="header" class="header">
      <div :style="bgHeaderStyle"></div>
      <div class="back" @click="goBack"></div>
    </div>
    <div class="body">
      <iframe id="qVwIframe" frameborder="0" scrolling="yes"
              :src="qVwUrl"
              :style="iframeStyle"></iframe>
      <Card class="card-1" v-if="!hiddenQrcode">
        <p slot="title">请扫码查看</p>
        <div>
          <img :src="qrcodeImg">
        </div>
      </Card>

      <!--<Card class="card-2" shadow>
        <p slot="title">手机模拟</p>
        <div style="padding: 10px">
          <Select v-model="selectPhone" style="width:100px">
            <Option v-for="data in phoneList" :value="data.key" :key="data.key">{{data.value}}
            </Option>
          </Select>
        </div>
      </Card>-->
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
  import QRCode from 'qrcode';

  export default {
    name: "q-vw-mdl",
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
      qVwUrl() {
        return this.$store.getters.getSource('qVwMdl', 'second').dataSource.templateObj.pcUrl || ''
      },
      showModal() {
        return this.$store.getters.getSource('qVwMdl', 'second').dataSource.showModal
      },
      hiddenQrcode() {
        let bean = this.$store.getters.getSource('qVwMdl', 'second').dataSource.templateObj.hiddenQrcode;
        return bean ? bean : false;
      },
      get() {
        return this.$store.getters.getSource('qVwMdl', 'second')
      },
      bgHeaderStyle() {
        return {
          backgroundImage: `url(${process.env.api.staticUrl}static/images/qrcode/iphone7@2x.jpg)`,
          backgroundSize: '100% 64px',
          backgroundRepeat: 'no-repeat',
          height: '64px'
        }
      },
      iframeStyle() {
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        let height = clientHeight - 80 - 64;
        return {
          visibility: 'visible',
          height: `${height}px`,
          width: '100%'
        }
      }
    },
    data() {
      return {
        selectPhone: 0,
        phoneList: [
          {
            key: 0,
            value: 'iphone7'
          },
          {
            key: 1,
            value: 'iphone7 Plus'
          }
        ],
        qrcodeImg: '' // 二维码图片
      }
    },
    mounted() {
      let _url = this.get.dataSource.templateObj.mobUrl;
      if (_url) {
        QRCode.toDataURL(_url)
          .then(url => {
            this.qrcodeImg = url;
          })
          .catch(err => console.error(err));
      }
    },
    methods: {
      /**
       * 返回
       */
      goBack() {
        document.querySelector('#qVwIframe').contentWindow.parent.history.go(-1);
      },
      /**
       * 弹窗关闭destroy
       */
      onVisible(value) {
        value || this.$store.dispatch('setDestroy', {
          compType: 'second',
          compName: ['qVwMdl']
        });
      }
    }
  }
</script>
