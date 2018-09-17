<style lang="scss">
  .infor-card-icon-con {
    height: 100%;
  }

  .height-100 {
    height: 100%;
  }

  .infor-card-con {
    height: 100px;
  }

  .infor-intro {
    font-size: 14px;
    margin-left: 15px;
    font-weight: 500;
    color: #999999;
    @include m(icon) {
      vertical-align: middle;
      color: #fff;
    }
    @include m(text) {
      vertical-align: middle;
      margin-left: 3px;
      color: #fff;
    }
    @include m(button) {
      position: absolute;
      top: 20px;
      right: 20px;
      background-color: rgba(0, 0, 0, .2) !important;
      padding: 5px 10px !important;
    }
    @include m(arrow) {
      margin-left: 3px;
    }
  }
</style>

<template>
  <Card :padding="0" :style="{backgroundColor:bgColor}">
    <div class="infor-card-con">
      <!-- <Col class="infor-card-icon-con" :style="{backgroundColor: color, color: 'white'}" span="8">
           <Row class="height-100" type="flex" align="middle" justify="center">
               <Icon :type="iconType" :size="iconSize"></Icon>
           </Row>
       </Col>-->
      <Col span="24" class="height-100">
        <Row type="flex" align="middle" justify="space-between" class="height-100">
          <count-up
            class="infor-card-count user-created-count"
            :id-name="idName"
            :end-val="endVal"
            :countSize="countSize"
            :countWeight="countWeight">
            <p class="infor-intro" slot="intro">
              <Icon :type="iconType" :size="iconSize" class="infor-intro--icon" :color="color"></Icon>
              <span class="infor-intro--text">{{introText}}</span>
              <Button type="primary" shape="circle" size="small" class="infor-intro--button"
                      @click.native="btnForward(btnLink)">{{btnText}}
                <Icon
                  type="android-arrow-forward" size="14" class="infor-intro--arrow"></Icon>
              </Button>
            </p>
          </count-up>
        </Row>
      </Col>
    </div>
  </Card>
</template>

<script>
  import countUp from './countUp.vue';

  export default {
    name: 'inforCard',
    components: {
      countUp
    },
    props: {
      idName: String,
      endVal: Number,
      bgColor: String,
      color: String,
      iconType: String,
      introText: String,
      btnText: String,
      btnLink: String,
      countSize: {
        type: String,
        default: '20px'
      },
      countWeight: {
        type: Number,
        default: 700
      },
      iconSize: {
        type: Number,
        default: 24
      }
    },
    methods: {
      btnForward(link) {
        const routeData = this.$router.resolve({
          name: link,
          query: {}
        });
        window.open(routeData.href, '_blank');
      }
    }
  };
</script>

