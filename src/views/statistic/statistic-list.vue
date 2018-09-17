<style lang="scss">
  .statistic-list {
    .info-card {
      margin-top: 10px;
      .ivu-card-head {
        .card-title {
          height: initial;
          line-height: initial;
        }
      }
      .ivu-card-bordered {
        border: 1px solid #eee;;
      }
    }
    @include b(chart-card) {
      margin-top: 10px;
      @include e(crumb) {
        padding: 5px 10px;
        display: flex;
        justify-content: space-between;
      }
    }

    @include b(qrcode-card) {
      @include b(qrcode-table) {
        border: 0;
        .ivu-table:after {
          background-color: #fff;
        }
        .ivu-table th {
          background: none;
        }
      }
      @include b(ivu-card-body) {
        padding: 0;
      }
    }
    @include b(line-card) {
      @include e(header) {
        display: flex;
        justify-content: space-between;
        @include m(date) {
          text-align: right;
          overflow: inherit;
        }
      }
      @include e(content) {
        @include m(group) {
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
        }
      }
    }

    @include b(pie-pillar-card) {
      @include e(header) {
        display: flex;
        @include m(title) {
          width: 10%;
        }
        @include m(name) {
          color: #999;
          margin-right: 5px;
        }
        @include m(select) {
          color: #666;
        }
        @include m(action) {
          text-align: left;
          overflow: inherit;
        }
        @include m(tip) {
          color: #999;
          margin-left: 5px;
        }
      }
      @include e(title) {
        @include m(name) {
          text-align: center;
          margin-bottom: 10px;
        }
      }
      @include e(content) {
        @include m(group) {
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
</style>

<template>
  <div class="statistic-list">
    <div class="info-card">
      <Row :gutter="10">
        <Col :md="24" :lg="24">
          <Card>
            <div class="data-info-row">
              <Row :gutter="10">
                <Col :xs="24" :sm="16" :md="8" :style="{marginBottom: '10px'}">
                  <infor-card
                    id-name="actual-total-amount"
                    :end-val="count.qrcodeNum"
                    iconType="qr-scanner"
                    bgColor="#0cc2aa"
                    color="#fff"
                    btnText="建码"
                    btnLink="qrcode-list"
                    :iconSize="22"
                    :intro-text="'二维码数'">
                  </infor-card>
                </Col>
                <Col :xs="24" :sm="16" :md="8" :style="{marginBottom: '10px'}">
                  <infor-card
                    id-name="order-count"
                    :end-val="count.recordNum"
                    iconType="android-list"
                    bgColor="#2d8cf0"
                    color="#fff"
                    btnText="查看"
                    btnLink="record-list"
                    :iconSize="28"
                    :intro-text="'维护明细'">
                  </infor-card>
                </Col>
                <Col :xs="24" :sm="16" :md="8" :style="{marginBottom: '10px'}">
                  <infor-card
                    id-name="device-count"
                    :end-val="count.recordCreaterNum"
                    iconType="person-stalker"
                    bgColor="#a88add"
                    btnText="添加"
                    btnLink="auth-list"
                    color="#fff"
                    :intro-text="'维护人员'">
                  </infor-card>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>

    <div class="chart-card">
      <Row :gutter="10">
        <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
          <Card class="qrcode-card">
            <div slot="title" class="card-title" style="display:flex;justify-content:space-between;">
              <p>二维码</p>
            </div>
            <div style="height: 379px;overflow-y: auto;">
              <Table class="qrcode-table" :columns="card.qrcode.table.header" :data="card.qrcode.table.body"></Table>
            </div>
          </Card>
        </Col>
        <Col :md="24" :lg="16" :style="{marginBottom: '10px'}">
          <Card class="line-card">
            <div slot="title" class="line-card__header">
              <p>记录</p>
              <p class="line-card__header--date">
                <Tag color="blue" v-for="(item,index) in charts.line.dateTagList" @click.native="changeTag(index)" :key="index">
                  {{item.name}}
                </Tag>
                选择日期：
                <DatePicker type="date" size="small" ref="startTimePicker" placeholder="起始时间"
                            style="width: 120px"></DatePicker>
                <DatePicker type="date" size="small" ref="endTimePicker" placeholder="结束时间"
                            style="width: 120px"></DatePicker>
                <Button type="primary" size="small" @click="handleSearch">查询</Button>
              </p>
            </div>
            <!--<div class="line-card__content&#45;&#45;group">
              <ButtonGroup shape="circle">
                <Button type="ghost">时间</Button>
                <Button type="ghost">人员</Button>
              </ButtonGroup>
            </div>-->
            <div class="line-card__content" style="height: 347px;">
              <service-requests ref="serviceRequests"></service-requests>
            </div>
          </Card>
        </Col>
      </Row>
      <Row :gutter="10">
        <Col :md="24" :lg="24" :style="{marginBottom: '10px'}">
          <Card class="pie-pillar-card">
            <div slot="title" class="pie-pillar-card__header">
              <p class="pie-pillar-card__header--title">未维护统计</p>
              <p class="pie-pillar-card__header--action">
                <span class="pie-pillar-card__header--name">选择维护模板：</span>
                <a href="javascript:;" class="pie-pillar-card__header--select" @click="showRdTpl">
                  <span v-if="rdTplObj">{{rdTplObj.recordTemplateName}}</span>
                  <span v-else>请选择</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <Dropdown trigger="click" style="margin-left: 10px">
                  <Button type="primary" size="small">{{charts.pillar.checkCycle.select.value}}</Button>
                  <DropdownMenu slot="list">
                    <DropdownItem
                      :name="item.key"
                      :key="index"
                      v-for="(item,index) in charts.pillar.checkCycle.list"
                      @click.native="onChangeDropDown(item)">
                      {{item.value}}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <!--<span class="pie-pillar-card__header&#45;&#45;tip">共有 0 个记录码在使用这个模板</span>-->
              </p>
            </div>
            <div class="pie-pillar-card__content--group">
              <ButtonGroup shape="circle">
                <Button
                  :type="item.selected ? 'primary' : 'ghost'"
                  @click="changeUndetectDateMode(item)"
                  :key="index"
                  v-for="(item,index) in charts.pillar.dateMode.list[charts.pillar.checkCycle.select.key].date">
                  {{item.value}}
                </Button>
              </ButtonGroup>
            </div>
            <div class="pie-pillar-card__title">
              <Row :gutter="10">
                <Col :md="24" :lg="12">
                  <p class="pie-pillar-card__title--name">维护统计占比</p>
                </Col>
                <Col :md="24" :lg="12">
                  <p class="pie-pillar-card__title--name">{{charts.pillar.check.select.value}}统计的前10个模板目录</p>
                </Col>
              </Row>
            </div>
            <div class="pie-pillar-card__content" style="height: 370px;">
              <Row :gutter="10" :style="{height: '100%'}">
                <Col :md="24" :lg="12" :style="{height: '100%'}">
                  <data-source-pie ref="dataSourcePie" @on-pie-click="onPieClick"
                                   @on-legend-click="onPieClick"></data-source-pie>
                </Col>
                <Col :md="24" :lg="12" :style="{height: '100%'}">
                  <visite-volume ref="visiteVolume"></visite-volume>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
      <Row :gutter="10">
        <Col :md="24" :lg="24" class="chart-card__crumb">
          <p>
            <Button>{{charts.pillar.dateMode.select.value}}</Button>
            <Button>{{charts.pillar.check.select.value}}</Button>
            <Button>共{{card.statistic.table.args.totalCount}}条</Button>
          </p>
          <p>
            <Button type="primary" @click="_getExport">Excel导出</Button>
          </p>
        </Col>
      </Row>
      <Row :gutter="10">
        <Col :md="24" :lg="24">
          <div class="table">
            <Table :columns="card.statistic.table.header" :data="card.statistic.table.body"></Table>
            <!--<div style="margin: 10px;overflow: hidden">
              <div style="float: right;">
                <Page :total="card.statistic.table.args.totalCount"
                      :current="card.statistic.table.args.currentPage"
                      :page-size="card.statistic.table.args.length"
                      show-total @on-change="changeStatisticPage"></Page>
              </div>
            </div>-->
          </div>
        </Col>
      </Row>
    </div>

    <loader :dataSourceList="getDataSourceList" :confirmfunc="confirmfunc"></loader>
  </div>
</template>

<script>
  import loader from '@/components/launch/loader.vue';
  import inforCard from './components/inforCard.vue';
  import serviceRequests from './components/serviceRequests.vue';
  import dataSourcePie from './components/dataSourcePie.vue';
  import visiteVolume from './components/visiteVolume.vue';

  export default {
    name: "statistic-list",
    components: {
      loader,
      inforCard,
      serviceRequests,
      dataSourcePie,
      visiteVolume
    },
    computed: {
      getDataSourceList() {
        return this.$store.getters.getDataSourceList()
      }
    },
    data() {
      return {
        // 选择维护模板
        rdTplObj: this.$Global.VueDB().getItem('rdTplObj').toJson() ? this.$Global.VueDB().getItem('rdTplObj').toJson() : null,
        count: {
          currentMonth: new Date().getMonth() + 1,
          qrcodeNum: 0,
          recordNum: 0,
          recordCreaterNum: 0
        },
        charts: {
          line: {
            totalAmount: 0,
            dateTagList: [
              {
                name: '今日',
                type: 1
              },
              {
                name: '昨天',
                type: 2
              },
              {
                name: '最近7天',
                type: 3
              },
              {
                name: '最近30天',
                type: 4
              }
            ],
            queryType: 1 // 0按时间计算 1今天 2昨天 3一周 4一个月
          },
          pillar: {
            dateMode: { // 未维护时间模式
              select: {
                key: 0,
                value: '昨天'
              },
              list: [
                {
                  date: [
                    {
                      key: 0,
                      value: '昨天',
                      selected: false
                    },
                    {
                      key: 1,
                      value: '本周',
                      selected: false
                    }
                  ]
                },
                {
                  date: [
                    {
                      key: 0,
                      value: '上周',
                      selected: false
                    },
                    {
                      key: 1,
                      value: '本月',
                      selected: false
                    }
                  ]
                },
                {
                  date: [
                    {
                      key: 0,
                      value: '上月',
                      selected: false
                    },
                    {
                      key: 1,
                      value: '今年',
                      selected: false
                    }
                  ]
                }
              ]
            },
            checkCycle: { // 巡检周期 0每日巡检 1每周巡检 2每月巡检
              select: {
                key: 0,
                value: '每日巡检'
              },
              list: [
                {
                  key: 0,
                  value: '每日巡检'
                },
                {
                  key: 1,
                  value: '每周巡检'
                },
                {
                  key: 2,
                  value: '每月巡检'
                }
              ]
            },

            check: {
              select: {
                value: '未维护'
              },
            },
            startRow: 0,
            pageSize: 10
          }
        },
        card: {
          qrcode: {
            table: {
              header: [
                {
                  title: '文件夹',
                  key: 'templateFoldName'
                },
                {
                  title: '数量',
                  key: 'countFromFold'
                }
              ],
              body: []
            }
          },
          statistic: {
            table: {
              header: [
                {
                  title: '所在目录',
                  key: 'templateFoldName'
                },
                {
                  title: '巡检码',
                  key: 'templateId'
                },
                {
                  title: '维护模板',
                  key: 'recordTemplateName'
                },
                {
                  title: '二维码名称',
                  key: 'templateName'
                },
                {
                  title: '时间',
                  key: 'createDate'
                },
                /*{
                  title: '状态',
                  key: 'state'
                }*/
              ],
              body: [],
              args: {
                start: 0,
                length: 15,
                currentPage: 1,
                totalCount: 0
              }
            }
          }
        }
      }
    },
    mounted() {
      // this._getLsRdTpl(); // 查询维护模板
      this._getLsStaticRpt(); // 查询静态统计
      this._getLsRdResRpt(); // 查询记录报表
      // this._getlsUndetectedRpt(); // 查询未维护报表
      this._getlsUndetectedRpt().then((resolve) => {
        this.card.statistic.table.body = resolve.data.undetectedDetailList.dbPageList;
        this.card.statistic.table.args.totalCount = resolve.data.undetectedDetailList.count;
      });
    },
    methods: {
      onPieClick(value) {
        console.log(value);

        this.charts.pillar.check.select.value = value.name;
        switch (value.name) {
          case '未维护':
            this._getlsUndetectedRpt().then((resolve) => {
              this.card.statistic.table.body = resolve.data.undetectedDetailList.dbPageList;
              this.card.statistic.table.args.totalCount = resolve.data.undetectedDetailList.count;

              this.$refs.visiteVolume.options.xAxis[0].data = (() => {
                let a = [];
                [...resolve.data.undetectedFold].forEach(m => {
                  a.push(m.recordFoldName)
                });
                return a;
              })();
              this.$refs.visiteVolume.options.series[0].data = (() => {
                let a = [];
                [...resolve.data.undetectedFold].forEach(m => {
                  a.push(m.count)
                });
                return a;
              })();

              this.$refs.visiteVolume.initVisiteVolume();


            });

            break;
          case '已维护':
            this._getlsUndetectedRpt().then((resolve) => {
              this.card.statistic.table.body = resolve.data.checkDetailList.dbPageList;
              this.card.statistic.table.args.totalCount = resolve.data.checkDetailList.count;

              this.$refs.visiteVolume.options.xAxis[0].data = (() => {
                let a = [];
                [...resolve.data.checkFold].forEach(m => {
                  a.push(m.recordFoldName)
                });
                return a;
              })();
              this.$refs.visiteVolume.options.series[0].data = (() => {
                let a = [];
                [...resolve.data.checkFold].forEach(m => {
                  a.push(m.count)
                });
                return a;
              })();

              this.$refs.visiteVolume.initVisiteVolume();

            });

            break;
        }
      },
      /**
       * 选择维护模板弹窗
       */
      showRdTpl() {
        this.$store.dispatch('setDataSourceList', {
          compName: 'qRecordMdl',
          dataSource: {
            showModal: true,
            templateObj: {
              compName: 'sel-record-tpl',
              showStep: false,
              recordTemplateId: this.rdTplObj ? this.rdTplObj.recordTemplateId : '',
            },
            initial: this.initial
          }
        });
      },
      /**
       * 维护模板回调函数callback
       */
      confirmfunc(value) {
        this.$Global.VueDB().setItem('rdTplObj', JSON.stringify(value));
        this.rdTplObj = value;
        this._getlsUndetectedRpt();
      },
      /**
       * 查询维护模板
       * @private
       */
      /*_getLsRdTpl() {
        this.$api.reportInterface.listRecordTemplate()
          .then(res => {
            if (res.data.success) {

            }
          }).catch(err => console.error(err))
      },*/
      /**
       * 查询静态统计
       * @private
       */
      _getLsStaticRpt() {
        this.$api.reportInterface.listStaticReport()
          .then(res => {
            res = res.data;
            if (res.success) {
              this.count.qrcodeNum = res.data.qrcodeNum;
              this.count.recordNum = res.data.recordNum;
              this.count.recordCreaterNum = res.data.recordCreaterNum;
              this.card.qrcode.table.body = res.data.templateReportVO.listTemplateFromFold;
            }
          }).catch(err => console.error(err))
      },
      /**
       * 查询记录报表
       * @private
       */
      _getLsRdResRpt() {
        this.$refs.serviceRequests.options.xAxis[0].data = [];
        this.$refs.serviceRequests.options.series[0].data = [];

        const query = (() => {
          return (res) => {
            [...res.data.countRecordResultVOList].forEach(m => {
              this.$refs.serviceRequests.options.xAxis[0].data.push((() => {
                let tmp = ['hour', 'day', 'month'];
                let a = null;
                [...tmp].forEach(v => (m.hasOwnProperty(v)) && (a = v));
                return m[a]
              })());
              this.$refs.serviceRequests.options.series[0].data.push(m.count);
            });
          }
        })();

        this.$api.reportInterface.listRecordResultReport({
          startTime: `${this.$refs.startTimePicker.publicStringValue} 00:00:00`,
          endTime: `${this.$refs.endTimePicker.publicStringValue} 00:00:00`,
          queryType: this.charts.line.queryType
        }).then(res => {
          res = res.data;
          if (res.success) {
            query(res);
            this.$refs.serviceRequests.initServiceRequests();
          }
        }).catch(err => console.error(err))
      },
      /**
       * 查询未维护报表
       * @private
       */
      _getlsUndetectedRpt() {
        const promise = new Promise((resolve, reject) => {
          this.$api.reportInterface.listUndetectedReport({
            checkCycle: this.charts.pillar.checkCycle.select.key, // 巡检周期 0每日巡检 1每周巡检 2每月巡检
            dateMode: this.charts.pillar.dateMode.select.key, // 昨天/上周/上月为0 本周/本月/今年为1
            recordTemplateId: this.rdTplObj ? this.rdTplObj.recordTemplateId : '', // 维护模板ID
            startRow: this.charts.pillar.startRow,
            pageSize: this.charts.pillar.pageSize,
          }).then(res => {
            res = res.data;
            if (res.success) {
              resolve(res);
            }
          }).catch(err => console.error(err))
        });
        return promise;
      },
      /**
       * 切换未维护时间模式
       */
      changeUndetectDateMode(item) {
        this.charts.pillar.dateMode.list[this.charts.pillar.checkCycle.select.key].date.forEach(m => m.selected = false);
        item.selected = true;
        this.charts.pillar.dateMode.select.key = item.key;
        this.charts.pillar.dateMode.select.value = item.value;

        this._getlsUndetectedRpt().then((resolve) => {
          this.$refs.dataSourcePie.options.series[0].data = (() => {
            let a = [];
            a.push({
              value: resolve.data.undetectedDetailList.count,
              name: '未维护',
              itemStyle: {
                normal: {color: '#9bd598'}
              }
            });

            a.push({
              value: resolve.data.checkDetailList.count,
              name: '已维护',
              itemStyle: {
                normal: {color: '#ffd58f'}
              }
            });
            return a;
          })();

          this.$refs.dataSourcePie.initSourcePie();
        });

        switch (this.charts.pillar.check.select.value) {
          case '未维护':
            this._getlsUndetectedRpt().then((resolve) => {
              this.card.statistic.table.body = resolve.data.undetectedDetailList.dbPageList;
              this.card.statistic.table.args.totalCount = resolve.data.undetectedDetailList.count;

              this.$refs.visiteVolume.options.xAxis[0].data = (() => {
                let a = [];
                [...resolve.data.undetectedFold].forEach(m => {
                  a.push(m.recordFoldName)
                });
                return a;
              })();
              this.$refs.visiteVolume.options.series[0].data = (() => {
                let a = [];
                [...resolve.data.undetectedFold].forEach(m => {
                  a.push(m.count)
                });
                return a;
              })();

              this.$refs.visiteVolume.initVisiteVolume();
            });
            break;
          case '已维护':
            this._getlsUndetectedRpt().then((resolve) => {
              this.card.statistic.table.body = resolve.data.checkDetailList.dbPageList;
              this.card.statistic.table.args.totalCount = resolve.data.checkDetailList.count;

              this.$refs.visiteVolume.options.xAxis[0].data = (() => {
                let a = [];
                [...resolve.data.checkFold].forEach(m => {
                  a.push(m.recordFoldName)
                });
                return a;
              })();
              this.$refs.visiteVolume.options.series[0].data = (() => {
                let a = [];
                [...resolve.data.checkFold].forEach(m => {
                  a.push(m.count)
                });
                return a;
              })();
              this.$refs.visiteVolume.initVisiteVolume();

            });
            break;
        }


      },
      /**
       * 导出Excel
       * @private
       */
      _getExport() {
        let checkCycle = this.charts.pillar.checkCycle.select.key; // 巡检周期 0每日巡检 1每周巡检 2每月巡检
        let dateMode = this.charts.pillar.dateMode.select.key; // 昨天/上周/上月为0 本周/本月/今年为1
        let kind = 0; // 0只导出未维护的，1只导出已维护的，2未维护和已维护同时导出
        let recordTemplateId = this.rdTplObj ? this.rdTplObj.recordTemplateId : ''; // 维护模板ID

        this.$api.qrcodeInterface.addExportInfo({
          checkCycle: checkCycle,
          dateMode: dateMode,
          kind: kind,
          recordTemplateId: recordTemplateId
        }).then(res => {
          res = res.data;

          if (res.retCode) {
            return this.$Message.info(res.retMsg)
          } else if (!res.retCode) {
            let url = `${process.env.api.commonUrl}/report/addExportInfo`;
            let form = document.createElement('form');
            let input = document.createElement('input');
            let formTable = document.querySelector('#formTable');
            input.setAttribute('name', 'checkCycle');
            input.setAttribute('name', 'dateMode');
            input.setAttribute('name', 'kind');
            input.setAttribute('name', 'recordTemplateId');

            input.value = checkCycle;
            input.value = dateMode;
            input.value = kind;
            input.value = recordTemplateId;

            form.id = 'formTable';
            form.style.display = 'none';
            form.setAttribute('method', 'post');
            form.setAttribute('action', url);
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
            formTable && formTable.remove();
          }
        }).catch(err => {
          console.error(err.message)
        });
      },
      /**
       * 搜索
       */
      handleSearch() {
        if (this.$Global.isBlank(this.$refs.startTimePicker.publicStringValue)) {
          return this.$Message.info('请选择开始时间')
        } else if (this.$Global.isBlank(this.$refs.endTimePicker.publicStringValue)) {
          return this.$Message.info('请选择结束时间')
        }

        this.charts.line.queryType = 0;
        this._getLsRdResRpt();
      },
      /**
       * 切换记录显示时间
       */
      changeTag(index) {
        this.charts.line.queryType = this.charts.line.dateTagList[index].type;
        this._getLsRdResRpt();
      },
      /**
       * 未维护列表分页
       * @param targetPage 目标页
       */
      /*changeStatisticPage(targetPage) {
        this.card.statistic.table.args.currentPage = targetPage;
        this.card.statistic.table.args.start = (targetPage - 1) * this.card.statistic.table.args.length;
      },*/
      /**
       * 修改巡检计划（每日，每周，每月）
       * @param item
       */
      onChangeDropDown(item) {
        this.charts.pillar.checkCycle.select.value = item.value;
        this.charts.pillar.checkCycle.select.key = item.key;
        this._getlsUndetectedRpt();
      }
    }
  }
</script>

