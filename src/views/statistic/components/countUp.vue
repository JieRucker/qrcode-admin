<template>
  <div>
    <slot name="intro"></slot>
    <p :class="className" :style="{textAlign: textAlign, color: color, fontSize: countSize, fontWeight: countWeight}">
      <span v-cloak :id="idName">{{ startVal }}</span><span>{{ unit }}</span></p>
  </div>
</template>

<script>
  import CountUp from 'countup';

  export default {
    data() {
      return {
        unit: '',
        demo: {}
      };
    },
    name: 'countUp',
    props: {
      idName: String,
      className: String,
      startVal: {
        type: Number,
        default: 0
      },
      endVal: {
        type: Number,
        required: true
      },
      decimals: {
        type: Number,
        default: 0
      },
      duration: {
        type: Number,
        default: 2
      },
      delay: {
        type: Number,
        default: 500
      },
      options: {
        type: Object,
        default: () => {
          return {
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.'
          };
        }
      },
      textAlign: {
        type: String,
        default: 'right'
      },
      color: {
        type: String,
        default: '#fff'
      },
      countSize: {
        type: String,
        default: '30px'
      },
      countWeight: {
        type: Number,
        default: 700
      },
      introText: [String, Number]
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          let res = this.transformValue(this.endVal);
          let endVal = res.val;
          this.unit = res.unit;
          let demo = {};
          this.demo = demo = new CountUp(this.idName, this.startVal, endVal, this.decimals, this.duration, this.options);
          if (!demo.error) {
            demo.start();
          }
        }, this.delay);
      });
    },
    watch: {
      endVal(val) {
        let res = this.transformValue(val);
        let endVal = res.val;
        this.unit = res.unit;
        this.demo.update(endVal);
      }
    },
    methods: {
      transformValue(val) {
        let endVal = 0;
        let unit = '';

        switch (this.idName) {
          case 'actual-total-amount':
            endVal = val;
            unit = '个';
            break;
          case 'order-count':
            endVal = val;
            unit = '条';
            break;
          case 'device-count':
            endVal = val;
            unit = '人';
            break;
          case 'device-income-perday':
            endVal = val;
            unit = '元';
            break;
        }

        /*if (val < 1000) {
            endVal = val;
            unit = '元';
        } else if (val >= 1000 && val < 1000000) {
            endVal = parseInt(val / 1000);
            unit = '次';
        } else if (val >= 1000000 && val < 10000000000) {
            endVal = parseInt(val / 1000000);
            unit = '台';
        } else {
            endVal = parseInt(val / 1000000000);
            unit = '元';
        }*/
        return {
          val: endVal,
          unit: unit
        };
      }
    }
  };
</script>
