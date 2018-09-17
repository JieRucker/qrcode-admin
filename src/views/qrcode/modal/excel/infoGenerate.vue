<style lang="scss" scoped>

</style>

<template>
  <Row :gutter="10" style="margin-top: 30px;">
    <Col span="24">
      <Progress :percent="percent">
        <Icon type="checkmark-circled"></Icon>
        <span>成功</span>
      </Progress>
    </Col>
  </Row>
</template>

<script>
  export default {
    name: "infoGenerate",
    data() {
      return {
        percent: 0,
        timer: null
      }
    },
    mounted() {
      this.timer = setInterval(() => {
        this.percent += 10;

        if (this.percent >= 100) {
          clearInterval(this.timer)
        }
      }, 100)
    }
  }
</script>
