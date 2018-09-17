<style lang="scss" scoped>

</style>

<template>
  <Row :gutter="10" style="margin-top: 30px;">
    <Col span="24">
      <Form label-position="top">
        <FormItem label="设置导入字段类型，并选定二维码的名称列（ 二维码的名称不可重复 ）">
          <Table ref="excelTable" :height="table.body.length > 6 ? 377 : ''" :columns="table.header"
                 :data="table.body"></Table>
        </FormItem>
      </Form>
    </Col>
    <Col span="24" style="text-align: right;">
      <Button type="text" size="large" @click.native="preStep">上一步</Button>
      <Button type="primary" size="large" @click.native="startUpload">开始导入</Button>
    </Col>
  </Row>
</template>

<script>
  export default {
    name: "infoType",
    data() {
      return {
        select: {
          key: 0,
          list: [
            {
              key: 0,
              value: '设备信息表'
            },
            {
              key: 1,
              value: 'sheet'
            }
          ]
        },
        table: {
          header: [
            {
              title: '设备名称',
              key: 'deviceName'
            },
            {
              title: '型号',
              key: 'deviceId'
            },
            {
              title: '生产厂家',
              key: 'deviceMade'
            },
            {
              title: '检测时间',
              key: 'createDate'
            },
            {
              title: '所在位置',
              key: 'position'
            },
          ],
          body: [
            {
              deviceName: '1#塔 吊',
              deviceId: 0,
              deviceMade: '中联重科',
              createDate: '2016.12.24',
              position: '东区2#'
            },
            {
              deviceName: '1#塔 吊',
              deviceId: 0,
              deviceMade: '中联重科',
              createDate: '2016.12.24',
              position: '东区2#'
            },
            {
              deviceName: '1#塔 吊',
              deviceId: 0,
              deviceMade: '中联重科',
              createDate: '2016.12.24',
              position: '东区2#'
            },
            {
              deviceName: '1#塔 吊',
              deviceId: 0,
              deviceMade: '中联重科',
              createDate: '2016.12.24',
              position: '东区2#'
            },
            {
              deviceName: '1#塔 吊',
              deviceId: 0,
              deviceMade: '中联重科',
              createDate: '2016.12.24',
              position: '东区2#'
            }, {
              deviceName: '1#塔 吊',
              deviceId: 0,
              deviceMade: '中联重科',
              createDate: '2016.12.24',
              position: '东区2#'
            }, {
              deviceName: '1#塔 吊',
              deviceId: 0,
              deviceMade: '中联重科',
              createDate: '2016.12.24',
              position: '东区2#'
            }
          ],
          args: {
            start: 0,
            length: 15,
            currentPage: 1,
            totalCount: 0
          }
        },
      }
    },
    methods: {
      preStep() {
        this.$emit('update:currentTab', 'infoTable');
        this.$emit('update:currentStep', 1);
      },
      startUpload() {
        this.$emit('update:currentTab', 'infoGenerate');
        this.$emit('update:currentStep', 3);
      }
    }
  }
</script>
