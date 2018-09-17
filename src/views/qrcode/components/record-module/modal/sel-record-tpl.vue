<style lang="scss">
  @include b(sel-record-tpl) {
    @include b(panel-left) {
      padding: 10px;
      width: 35%;
      border-right: 1px solid #e9eaec;
      @include e(title) {
        font-size: 14px;
        height: 40px;
        line-height: 40px;
      }
      @include b(l-list) {
        @include e(item) {
          font-size: 14px;
          height: 35px;
          line-height: 35px;
          color: #333;
          padding: 0 10px;
          cursor: pointer;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          &:hover {
            background-color: #eee;
          }
          &.selected {
            color: #2d8cf0;
          }
        }
      }
    }
    @include b(panel-right) {
      padding: 10px;
      width: 65%;
      @include e(title) {
        font-size: 14px;
        height: 35px;
        line-height: 35px;
      }
      @include b(l-list) {
        @include e(item) {
          display: flex;
          font-size: 14px;
          justify-content: space-between;
          height: 35px;
          line-height: 35px;
          color: #333;
          width: 100%;
          padding: 0 10px;
          cursor: pointer;
          @include m(name) {
            width: 45%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          @include m(desc) {
            text-align: right;
            width: 55%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          &:hover {
            background-color: #eee;
          }
          &.selected {
            .l-list__item--name {
              color: #2d8cf0;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="body">
    <div class="sel-record-tpl">
      <div style="display: flex;min-height: 310px;">
        <div class="panel-left">
          <p class="panel-left__title">分组</p>
          <ul class="l-list">
            <li :class="[{'l-list__item selected':item.selected},'l-list__item']" v-for="(item,index) in tabs.tabList"
                @click="changePanelTab(index)" :title="item.categoryName">
              {{item.categoryName}}
            </li>
          </ul>
        </div>
        <div class="panel-right">
          <div style="display: flex;justify-content: space-between">
            <div class="panel-right__title">维护模板</div>
            <div style="display: flex;">
              <Input v-model="search.searchKey" style="margin-right: 10px" placeholder="请输入模板名称">
              <Button slot="append" icon="ios-search" @click.native="handleSearch"></Button>
              </Input>
              <Button type="default" style="margin-bottom: 7px;" @click.native="openTemplate">新建模板</Button>
            </div>
          </div>
          <ul class="l-list">
            <li :class="[{'l-list__item selected':item.selected},'l-list__item']"
                v-for="(item,index) in card.templateList" @click="changeCard(index)">
              <p class="l-list__item--name">
                <Checkbox v-model="item.selected">&nbsp;<span
                  :title="item.recordTemplateName">{{item.recordTemplateName}}</span></Checkbox>
              </p>
              <p class="l-list__item--desc">
                {{item.createDate}}&nbsp;<span :title="item.recordTemplateDesc">{{item.recordTemplateDesc}}</span>
              </p>
            </li>
          </ul>
          <p style="margin: 10px;text-align: center;" v-if="!card.templateList.length">暂无数据</p>
          <div style="margin: 10px;overflow: hidden" v-if="card.templateList.length">
            <div style="float: right;">
              <Page :total="card.totalCount" :current="card.currentPage" :page-size="card.length"
                    show-total @on-change="changePage"></Page>
            </div>
          </div>
        </div>
      </div>
      <div class="footer" style="text-align: center">
        <Button type="primary" size="large" v-if="showStep" @click="nextStep">下一步</Button>
        <Button type="primary" size="large" v-if="!showStep" @click="saveModule">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "sel-record-tpl",
    props: {
      showStep: {
        type: Boolean,
        default: true
      },
      autoClose: {
        type: Boolean,
        default: true
      },
      currentModal: String,
      confirmfunc: {
        type: Function,
      }
    },
    data() {
      return {
        show: true,
        search: {
          searchKey: ''
        },
        tabs: {
          selectTab: '',
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
        }
      }
    },
    computed: {
      get() {
        return this.$store.getters.getSource('qRecordMdl')
      }
    },
    mounted() {
      this.listTab();
    },
    methods: {
      /**
       * 获取分组
       * @param params
       */
      listTab(params = {recordTemplateCategoryId: '', recordTemplateName: ''}) {
        this.tabs.tabList = [];
        this.$api.recordTemplateInterface.listRecordTemplateCategory({
          recordTemplateCategoryId: params.recordTemplateCategoryId,
          recordTemplateName: params.recordTemplateName
        }).then(res => {
          if (res.data.success) {
            res.data.data.forEach((m, i) => {
              this.tabs.tabList.push({
                categoryName: m.recordTemplateCategoryName,
                categoryId: m.recordTemplateCategoryId,
                selected: i === 0 ? true : false
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
      /**
       * 获取分组对应的维护模板
       * @param params
       */
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
                selected: (() => {
                  let a = false;
                  if (this.get.dataSource.templateObj.recordTemplateId === m.recordTemplateId) {
                    a = true
                  }

                  return a;
                })()
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
      /**
       * 改变选中的分组
       * @param index
       */
      changePanelTab(index) {
        this.tabs.tabList.forEach(m => m.selected = false);
        this.tabs.tabList[index].selected = true;
        this.tabs.selectTab = this.tabs.tabList[index].categoryId;
        this.listRecordTemplate({
          recordTemplateCategoryId: this.tabs.selectTab
        });
      },
      /**
       * 改变选中维护模板
       * @param index
       */
      changeCard(index) {
        this.card.templateList.forEach(m => m.selected = false);
        this.card.templateList[index].selected = true;
      },
      /**
       * 切换分页
       * @param targetPage
       */
      changePage(targetPage) {
        this.card.currentPage = targetPage;
        this.card.start = (targetPage - 1) * this.card.length;
        this.listRecordTemplate({
          recordTemplateCategoryId: this.tabs.selectTab
        });
      },
      /**
       * 下一步
       * @returns {*}
       */
      nextStep() {
        const boolean = (() => {
          let flag = false;
          return (items) => {
            for (let i = 0, len = items.length; i < len; i++) {
              items[i]['selected'] && (flag = true)
            }
            return flag;
          }
        })();


        if (!boolean(this.card.templateList)) {
          return this.$Message.info('请选择一个模板');
        }

        const template = (() => {
          let a = null;
          [...this.card.templateList].forEach(m => {
            if (m.selected) {
              a = m
            }
          });
          return a;
        })();

        this.get.dataSource.templateObj = {
          recordTemplateName: template.recordTemplateName,
          recordTemplateId: template.recordTemplateId,
          authGroupList: this.get.dataSource.templateObj.authGroupList
        };

        this.$emit('update:currentModal', this.$Global.setValue('sel-auth-group'));
      },
      /**
       * 搜索
       */
      handleSearch() {
        this.listRecordTemplate({
          recordTemplateName: this.search.searchKey,
          recordTemplateCategoryId: this.tabs.selectTab
        });
      },
      /**
       * 新建模板
       */
      openTemplate() {
        const routeData = this.$router.resolve({
          name: "record-tpl",
          query: {}
        });
        window.open(routeData.href, '_blank');
      },
      /**
       * 保存维护模板
       */
      saveModule() {
        const template = (() => {
          let a = null;
          [...this.card.templateList].forEach(m => m.selected && (a = m));
          return a;
        })();

        if (!template) {
          return this.$Message.info('请选择模板');
        }
        (typeof this.confirmfunc === "function") && (this.confirmfunc.call(null, template));
        this.autoClose && this.$set(this.get.dataSource, 'showModal', false);
      }
    }
  }
</script>

