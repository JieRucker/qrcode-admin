<style lang="scss" scoped>

</style>

<template>
  <Row :gutter="10">
    <Col span="24">
      <Form label-position="top" style="margin-top: 30px;">
        <FormItem label="请选择需要导入数据的工作表，并指定一行作为标题">
          <Card :dis-hover="false" style="width:100%">
            选择工作表：
            <Select v-model="select.key" style="width:100px;margin-left:5px;">
              <Option v-for="item in select.list" :value="item.key" :key="item.key">
                {{item.value}}
              </Option>
            </Select>
          </Card>
        </FormItem>
        <FormItem label="预览数据:草料示例--大型机械设备 (1).xlsx">
          <Table ref="excelTable" :height="table.body.length > 6 ? 377 : ''" :columns="table.header"
                 :data="table.body"></Table>
        </FormItem>
      </Form>
    </Col>
    <Col span="24" style="text-align: right;">
      <Button type="text" size="large" @click.native="preStep">上一步</Button>
      <Button type="primary" size="large" @click.native="nextStep">下一步</Button>
    </Col>
  </Row>
</template>

<script>
  export default {
    name: "infoTable",
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
        this.$emit('update:currentTab', 'infoUpload');
        this.$emit('update:currentStep', 0);
      },
      nextStep() {
        this.$emit('update:currentTab', 'infoType');
        this.$emit('update:currentStep', 2);
      }
    }
  }
</script>

