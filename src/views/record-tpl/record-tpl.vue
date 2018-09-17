<style lang="scss">
  @import "./styles/record-tpl.scss";
</style>

<template>
  <div class="record-tpl-list">
    <div class="main">
      <div class="main__header clearfix">
        <div class="main__tip">
          <p class="main__tip--title">模板列表</p>
        </div>
        <div class="main__action">
          <Input v-model="search.searchKey" style="width:200px;margin-right: 10px" placeholder="请输入模板名称">
          <Button slot="append" icon="ios-search" @click.native="handleSearch"></Button>
          </Input>
          <Button type="primary" style="margin-right: 10px" @click="newTemplateModal">
            <Icon type="plus-round"></Icon>&nbsp;创建模板
          </Button>
        </div>
      </div>
      <div class="main__section clearfix">
        <Tabs :animated="false" :value="tabs.selectTab" @on-click="changePanelTab" style="height: 100%">
          <TabPane :label="item.categoryName" :name="item.categoryId" v-for="(item,index) in tabs.tabList" :key="index">
          </TabPane>
          <Button @click="handleTabsAdd" slot="extra">
            <Icon type="plus-round"></Icon>&nbsp;添加分组
          </Button>
        </Tabs>
        <div class="card">
          <ul class="l-list clearfix">
            <li class="l-list__item" v-for="(item,index) in card.templateList" style="width:33.3%">
              <Card style="width:100%">
                <p class="l-list__item--name">{{item.recordTemplateName}}</p>
                <p class="l-list__item--remark">{{item.recordTemplateDesc}}</p>
                <p class="l-list__item--date">{{item.createDate}}</p>
                <div class="l-list__footer">
                  <a href="javascript:;" class="l-list__footer--icon"
                     @click="cardEyeButton(index)">预览<span>|</span></a>
                  <a href="javascript:;" class="l-list__footer--icon"
                     @click="cardEditButton(index)">编辑<span>|</span></a>
                  <a href="javascript:;" class="l-list__footer--icon"
                     @click="cardMessButton(index)">提醒<span>|</span></a>
                  <Poptip title="设置巡检周期" placement="bottom-start">
                    <a href="javascript:;" class="l-list__footer--icon">周期<span>|</span></a>
                    <div class="calendar" slot="content">
                      <ul class="calendar-l-list">
                        <li class="calendar-l-list__item" v-for="(calendarItem,calendarIndex) in calendar"
                            :style="{'color':item.checkCycle === calendarIndex ? '#f00' : ''}"
                            @click.stop="cardCalendarButton(index,calendarIndex)" v-text="calendarItem.label">
                        </li>
                      </ul>
                    </div>
                  </Poptip>
                  <Poptip title="转移至" placement="bottom-start">
                    <a href="javascript:;" class="l-list__footer--icon">转移<span>|</span></a>
                    <div class="group-poptip" slot="content">
                      <ul class="group-poptip__l-list">
                        <li class="group-poptip__item" v-for="(tab,tabIndex) in tabs.tabList"
                            style="padding: 6px 5px;cursor: pointer;font-size: 14px;"
                            @click.stop="cardPlusButton(index,tab.categoryId)"
                            v-if="tabs.selectTab !== tab.categoryId">{{tab.categoryName}}
                        </li>
                      </ul>
                    </div>
                  </Poptip>
                  <a href="javascript:;" class="l-list__footer--icon" @click="cardTrashButton(index)">删除</a>
                </div>
              </Card>
            </li>
          </ul>
        </div>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="card.totalCount" :current="card.currentPage" :page-size="card.length"
                  show-total @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </div>

    <new-template-nature ref="newTemplateNature"></new-template-nature>
    <new-mess-nature ref="newMessNature"></new-mess-nature>
    <new-group-nature ref="newGroupNature"></new-group-nature>

    <loader :dataSourceList="getDataSourceList"></loader>
  </div>
</template>

<script>
  import newTemplateNature from "./modal/new-template-nature";
  import newMessNature from "./modal/new-mess-nature";
  import newGroupNature from "./modal/new-group-nature";
  import loader from '@/components/launch/loader.vue';

  export default {
    name: "record-tpl",
    components: {
      newTemplateNature,
      newMessNature,
      newGroupNature,
      loader
    },
    computed: {
      getDataSourceList() {
        return this.$store.getters.getDataSourceList('second')
      }
    },
    data() {
      return {
        search: {
          searchKey: ''
        },
        tabs: {
          selectTab: 0,
          start: 0,
          length: 10,
          tabList: []
        },
        card: {
          start: 0,
          length: 10,
          currentPage: 1,
          totalCount: 0,
          templateList: []
        },
        calendar: [
          {
            label: '每日巡检',
            value: 0
          },
          {
            label: '每周巡检',
            value: 1
          },
          {
            label: '每月巡检',
            value: 2
          }
        ]
      }
    },
    mounted() {
      this.listTab()
    },
    methods: {
      handleSearch() {
        this.listRecordTemplate({
          recordTemplateName: this.search.searchKey,
          recordTemplateCategoryId: this.tabs.selectTab
        });
      },
      listTab(params = {recordTemplateCategoryId: '', recordTemplateName: ''}) {
        this.tabs.tabList = [];
        this.$api.recordTemplateInterface.listRecordTemplateCategory({
          recordTemplateCategoryId: params.recordTemplateCategoryId,
          recordTemplateName: params.recordTemplateName
        }).then(res => {
          if (res.data.success) {
            res.data.data.forEach(m => {
              this.tabs.tabList.push({
                categoryName: m.recordTemplateCategoryName,
                categoryId: m.recordTemplateCategoryId
              })
            });

            if (this.tabs.tabList.length) {
              this.tabs.selectTab = this.tabs.tabList[0].categoryId;
              this.listRecordTemplate({
                recordTemplateCategoryId: this.tabs.tabList[0].categoryId
              });
            }
          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      listRecordTemplate(params = {recordTemplateCategoryId: '', recordTemplateName: ''}) {
        this.card.templateList = [];

        this.$api.recordTemplateInterface.listRecordTemplate({
          recordTemplateCategoryId: params.recordTemplateCategoryId,
          recordTemplateName: params.recordTemplateName,
          startRow: this.card.start,
          pageSize: this.card.length
        }).then(res => {
          if (res.data.success) {
            res.data.data.dbPageList.forEach(m => {
              this.card.templateList.push({
                checkCycle: m.checkCycle,
                createDate: m.createDate,
                sumaryTitle: m.recordSumaryTitle,
                recordTemplateDesc: m.recordTemplateDesc,
                recordTemplateId: m.recordTemplateId,
                recordTemplateName: m.recordTemplateName,
                recordTemplateViewUrl: m.recordTemplateViewUrl
              })
            });
            this.card.totalCount = res.data.data.count;
          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      changePage(targetPage) {
        this.card.currentPage = targetPage;
        this.card.start = (targetPage - 1) * this.card.length;
        this.listRecordTemplate({
          recordTemplateCategoryId: this.tabs.selectTab
        });
      },
      handleTabsAdd() {
        this.$refs.newGroupNature.modal.newGroupModal.categoryName = '';
        this.$refs.newGroupNature.modal.newGroupModal.show = true;
      },
      newTemplateModal() {
        if (!this.tabs.tabList.length) {
          return this.$Message.info('请先添加分组')
        }

        Object.assign(this.$refs.newTemplateNature.$data, this.$refs.newTemplateNature.$options.data());
        this.$refs.newTemplateNature.modal.newTemplateModal.modalType = 0;
        this.$refs.newTemplateNature.modal.newTemplateModal.categoryId = this.tabs.selectTab;
        this.$refs.newTemplateNature.modal.newTemplateModal.show = true;
      },
      changePanelTab(value) {
        this.tabs.selectTab = value;
        this.listRecordTemplate({
          recordTemplateCategoryId: this.tabs.selectTab
        });
      },
      cardEyeButton(index) {
        this.$store.dispatch('setDataSourceList', {
          compName: 'qVwMdl',
          compType: 'second',
          dataSource: {
            showModal: true,
            templateObj: {
              hiddenQrcode: true,
              pcUrl: `${this.card.templateList[index].recordTemplateViewUrl}`
            }
          }
        });
      },
      cardEditButton(index) {
        this.$api.recordTemplateInterface.getRecordTemplateByRecordTemplateId({
          recordTemplateId: this.card.templateList[index].recordTemplateId
        }).then(res => {
          if (res.data.success) {
            this.$refs.newTemplateNature.modal.newTemplateModal.modalType = 1;
            this.$refs.newTemplateNature.modal.newTemplateModal.recordTemplateId = this.card.templateList[index].recordTemplateId;

            this.$refs.newTemplateNature.modal.newTemplateModal.checkCycle = res.data.data.checkCycle;
            this.$refs.newTemplateNature.modal.newTemplateModal.recordResultName = res.data.data.recordSumaryTitle;
            this.$refs.newTemplateNature.modal.newTemplateModal.selectRecordResultType = res.data.data.recordSummaryType;
            this.$refs.newTemplateNature.modal.newTemplateModal.categoryId = res.data.data.recordTemplateCategoryId;
            this.$refs.newTemplateNature.modal.newTemplateModal.templateDesc = res.data.data.recordTemplateDesc;
            this.$refs.newTemplateNature.modal.newTemplateModal.templateName = res.data.data.recordTemplateName;
            this.$refs.newTemplateNature.modal.newTemplateModal.recordGroupList = res.data.data.recordGroupList;

            this.$refs.newTemplateNature.modal.newTemplateModal.radioBoxList = res.data.data.radioBoxList ? res.data.data.radioBoxList : [];

            this.$refs.newTemplateNature.modal.newTemplateModal.recordResultDefaultContent = res.data.data.recordSummaryTypeTextDefaultContent;
            this.$refs.newTemplateNature.modal.newTemplateModal.shortMsgRemindVO = res.data.data.shortMsgRemindVO;

            this.$refs.newTemplateNature.modal.newTemplateModal.show = true;
          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      cardMessButton(index) {
        this.$refs.newMessNature.modal.newMessModal.recordTemplateId = this.card.templateList[index].recordTemplateId;
        this.$refs.newMessNature.getShortMsg();
        this.$refs.newMessNature.modal.newMessModal.show = true;
      },
      cardCalendarButton(index, type) {
        this.$api.recordTemplateInterface.updateCheckCycle({
          checkCycle: type,
          recordTemplateId: this.card.templateList[index].recordTemplateId
        }).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
            this.listRecordTemplate({
              recordTemplateName: this.search.searchKey,
              recordTemplateCategoryId: this.tabs.selectTab
            });
          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      cardPlusButton(index, categoryId) {
        this.$api.recordTemplateInterface.updateMoveRecordTemplate({
          recordTemplateCategoryId: categoryId,
          recordTemplateId: this.card.templateList[index].recordTemplateId
        }).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
            this.listRecordTemplate({
              recordTemplateCategoryId: this.tabs.selectTab
            });
          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      cardTrashButton(index) {
        this.$Modal.confirm({
          title: '删除模板',
          content: '<p>一旦你删除该维护模板，所有与该维护模板有关的信息将被永久删除，这是一个不可恢复的操作，请谨慎对待！</p>',
          onOk: () => {
            this.$api.recordTemplateInterface.removeRecordTemplate({
              recordTemplateId: this.card.templateList[index].recordTemplateId
            }).then(res => {
              if (res.data.success) {
                this.$Message.info('删除成功');
                this.listRecordTemplate({
                  recordTemplateCategoryId: this.tabs.selectTab
                });

                this.$Global.timeout(1000).then(() => {
                  if (!this.card.templateList.length) {
                    this.card.start = 0;
                    this.card.currentPage = 1;
                    this.listRecordTemplate({
                      recordTemplateCategoryId: this.tabs.selectTab
                    });
                  }
                })
              } else {
                this.$Message.error(res.data.retMsg)
              }
            }).catch(err => {
              console.error(err)
            })
          }
        });
      }
    }
  }
</script>

