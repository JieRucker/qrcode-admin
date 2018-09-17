<template>
  <div style="width:100%;height:100%;" id="data_source_con"></div>
</template>

<script>
  import echarts from 'echarts';

  export default {
    name: 'dataSourcePie',
    data() {
      return {
        options: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            data: ['未维护', '已维护']
          },
          series: [
            {
              name: '统计',
              type: 'pie',
              radius: '66%',
              center: ['50%', '60%'],
              data: [
                // {value: 5, name: '未维护', itemStyle: {normal: {color: '#9bd598'}}},
                // {value: 2, name: '已维护', itemStyle: {normal: {color: '#ffd58f'}}}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      };
    },
    mounted() {
      this.initSourcePie();
    },
    methods: {
      initSourcePie() {
        let _this = this;
        this.$nextTick(() => {
          let dataSourcePie = echarts.init(document.getElementById('data_source_con'));
          dataSourcePie.setOption(this.options);
          window.addEventListener('resize', function () {
            dataSourcePie.resize();
          });

          dataSourcePie.on('click', function (params) {
            _this.$emit('on-pie-click', params)
          });


          dataSourcePie.on('legendselectchanged', function (params) {
            _this.$emit('on-legend-click', params)
          });
        });
      }
    }
  };
</script>
