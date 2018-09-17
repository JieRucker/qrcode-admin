<style lang="scss">
  @include b(make-qrcode-modal) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      height: 160px;
      display: flex;
      padding: 20px;
      @include e(qrcode) {
        @include m(img) {
          width: 120px;
          height: 120px;
        }
      }
      @include e(desc) {
        margin-left: 20px;
        padding-top: 10px;
        @include m(line) {
          margin-top: 10px;
          &:first-child {
            margin-top: 0;
          }
        }
        @include m(tip) {
          margin-left: 22px;
          color: #999;
        }
      }
    }
    @include b(footer) {
      @include e(notify) {
        text-align: center;
      }
    }
  }
</style>

<template>
  <Modal v-model="show" width="450" class="make-qrcode-modal">
    <p slot="header" class="header">
      <span class="header--title">批量验证</span>
    </p>
    <div class="body">
      <div class="body__qrcode">
        <img class="body__qrcode--img" :src="qrcodeImg">
      </div>
      <div class="body__desc">
        <p class="body__desc--line" v-for="(item,index) in stepList">
          <span class="body__desc--circle" v-text="index + 1 + '、'"></span>
          <span class="body__desc--text" v-text="item.label"></span>
        </p>
        <p class="body__desc--line">
          <span class="body__desc--tip">维护人员短信验证通过后，就可以添加维护记录</span>
        </p>
      </div>
    </div>
    <!--<div class="footer">
      <p class="footer__notify">
        授权完成后关注<span>二维码公众号</span>，及时接收状态变更通知和每周
        <a href="javascript:;" target="_blank" v-on:click="skipRoute">管理报表</a>
      </p>
    </div>-->
  </Modal>
</template>

<script>
  import QRCode from 'qrcode';

  export default {
    name: "make-qrcode-nature",
    components: {
      QRCode
    },
    data() {
      return {
        show: false,
        tempQrcodeImg:'',
        qrcodeImg: '',
        stepList: [
          {
            label: '下载左侧的批量验证二维码',
            value: 0
          },
          {
            label: '邀请未验证维护人微信扫码验证',
            value: 1
          },
          {
            label: '未验证维护人员输入手机号，完成验证',
            value: 2
          }
        ]
      }
    },
    methods: {
      getQrcode() {
        QRCode.toDataURL(this.tempQrcodeImg)
          .then(url => {
            console.log(url)
            this.qrcodeImg = url;
          })
          .catch(err => {
            console.error(err)
          })

        /*this.$api.authUserInterface.makeQrcode()
          .then(res => {
            if (res.data.success) {
              QRCode.toDataURL(res.data.data)
                .then(url => {
                  console.log(url)
                  this.qrcodeImg = url;
                })
                .catch(err => {
                  console.error(err)
                })

            } else {
              this.$Message.error(res.data.retMsg)
            }
          }).catch(err => {
          console.error(err)
        })*/
      },
      skipRoute() {
        this.$router.push({
          name: 'statistic-list'
        })
      }
    }
  }
</script>
