<template>
  <div style="width:100%;height:100%;" id="visite_volume_con"></div>
</template>

<script>
  import echarts from 'echarts';

  export default {
    name: 'visiteVolume',
    data() {
      return {
        options: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          /*legend: {
            data: ['项目目录', '未命名目录', '未命名目录1']
          },*/
          grid: {
            top: '10%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '目录',
              // splitNumber: 6
            }
          ],
          series: [
            {
              name: '数量',
              type: 'bar',
              barWidth: '50%',
              data: []
            }
          ]
        }
      };
    },
    mounted() {
      this.initVisiteVolume();
    },
    methods: {
      initVisiteVolume() {
        this.$nextTick(() => {
          let visiteVolume = echarts.init(document.getElementById('visite_volume_con'));
          visiteVolume.setOption(this.options);
          window.addEventListener('resize', function () {
            visiteVolume.resize();
          });
        });
      }
    }
  };
</script>
