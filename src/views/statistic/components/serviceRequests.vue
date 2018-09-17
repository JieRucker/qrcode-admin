<template>
  <div style="width:100%;height:100%;" id="service_request_con"></div>
</template>

<script>
  import echarts from 'echarts';

  export default {
    name: 'serviceRequests',
    data() {
      return {
        options: {
          tooltip: {
            trigger: 'axis',
          },
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
              boundaryGap: false,
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '记录（个）',
            }
          ],
          series: [
            {
              name: '记录',
              type: 'line',
              stack: '总量',
              data: []
            }
          ]
        }
      }
    },
    mounted() {
      this.initServiceRequests();
    },
    methods: {
      initServiceRequests() {
        const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
        serviceRequestCharts.setOption(this.options);

        window.addEventListener('resize', function () {
          serviceRequestCharts.resize();
        });
      }
    }
  };
</script>
