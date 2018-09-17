<style lang="scss">
  @import "./styles/record-list.scss";
</style>

<template>
  <div class="record-list">
    <div class="tree" v-if="treeList.length>0" style="background-color:#f8f8f8">
      <h2 class="tree--title">产品目录</h2>
      <j-tree
        :list="treeList"
        :click="onClick"
        :expand="expandClick"
        :show-plus-icon="false"
        :show-edit-icon="false"
        :show-delete-icon="false"
        :is-open="false">
      </j-tree>
    </div>

    <div class="main">
      <div class="main__header clearfix">
        <!--<div class="main__tip">
          <span class="main__tip&#45;&#45;link">工程001&nbsp;共0条维护记录</span>
        </div>-->
        <div class="main__action">
          <!--<ButtonGroup>-->
          <!--<Button>搜索</Button>-->
          <Button type="primary" @click="_exportRecord">导出</Button>
          <!--</ButtonGroup>-->
        </div>
      </div>
      <div class="main__section clearfix">
        <div class="nav">
          <div class="nav__action">
            <DatePicker type="datetime" ref="dateSrartTimePicker" placeholder="选择起始时间"
                        style="width: 160px"></DatePicker>
            <DatePicker type="datetime" ref="dateEndTimePicker" placeholder="选择截止时间" style="width: 160px"></DatePicker>

            <Poptip placement="bottom" width="800">
              <Button class="nav__action--style" @click.native="_listRecordTemplate">
                {{search.selectTemplate}}
                <Icon class="nav__action--icon" type="close" v-if="search.selectTemplate !== '选择维护模板'"
                      @click.native="closeSearch(0)"></Icon>
              </Button>
              <div class="nav__dropdown" slot="content">
                <ul class="l-list clearfix">
                  <li class="l-list__item" v-for="(item,index) in search.templateList"
                      @click.stop="changeSearch(0,index)">{{item.recordTemplateName}}
                  </li>
                </ul>
              </div>
            </Poptip>

            <Poptip placement="bottom" width="800">
              <Button class="nav__action--style" @click.native="_listManager">
                {{search.selectUser}}
                <Icon class="nav__action--icon" type="close" v-if="search.selectUser !== '选择维护人员'"
                      @click.native="closeSearch(1)"></Icon>
              </Button>
              <div class="nav__dropdown" slot="content">
                <ul class="l-list clearfix">
                  <li class="l-list__item" v-for="(item,index) in search.userList"
                      @click.stop="changeSearch(1,index)">{{item.authUserName}}
                  </li>
                </ul>
              </div>
            </Poptip>
            <Poptip placement="bottom" width="800">
              <Button class="nav__action--style" @click.native="_listTemplate">
                {{search.selectTemplateFold}}
                <Icon class="nav__action--icon" type="close" v-if="search.selectTemplateFold !== '选择产品码'"
                      @click.native="closeSearch(2)"></Icon>
              </Button>
              <div class="nav__dropdown" slot="content">
                <ul class="l-list clearfix">
                  <li class="l-list__item" v-for="(item,index) in search.templateFoldList"
                      @click.stop="changeSearch(2,index)">
                    {{item.templateName}}
                  </li>
                </ul>
              </div>
            </Poptip>
            <Input placeholder="请输入产品编号" v-model="search.templateId" style="width: 150px"></Input>
            <Button type="primary" @click.native="handleSearch">搜索</Button>
          </div>
        </div>
        <div class="table">
          <Table ref="recordTable" :columns="table.header" :data="table.body" @on-expand="onExpand"></Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="table.args.totalCount"
                    :current="table.args.currentPage"
                    :page-size="table.args.length"
                    show-total @on-change="changeRecordPage"></Page>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import jTree from '@/components/j-tree/jTree.vue';
  import recordExpand from './record-expand.vue';

  export default {
    name: "record-list",
    components: {
      jTree,
      recordExpand
    },
    data() {
      return {
        nodeTree: {
          createFileMenu: '',
          nodeModel: null
        },
        args: {
          treeStart: 0,
          treeLength: 50,
          templateStart: 0,
          templateLength: 10,
        },
        treeList: [],

        search: {
          startTime: '',
          endTime: '',
          templateId: '',
          selectTemplateValue: '',
          selectUserValue: '',
          selectTemplateFoldValue: '', // 目录id
          selectTemplate: '选择维护模板',
          selectUser: '选择维护人员',
          selectTemplateFold: '选择产品码',
          templateList: [],
          userList: [],
          templateFoldList: []
        },

        table: {
          header: [
            {
              type: 'expand',
              width: 50,
              render: (h, params) => {
                return h('div', [this.$slots.default, (() => {
                  return h(recordExpand, {
                    attrs: {
                      // class: 'foo',
                    },
                    props: {
                      detail: params.row.detail
                    }
                  })
                })()])
              }
            },
            {
              title: '产品名称',
              key: 'templateName'
            },
            {
              title: '状态转换',
              render: (h, params) => {
                return h('div', [
                  h('Span', {
                    style: {
                      color: (() => {
                        let color = null;
                        let recordBeforeStateColor = params.row.recordBeforeStateColor;
                        if (typeof recordBeforeStateColor !== 'undefined') {
                          switch (recordBeforeStateColor) {
                            case '0':
                              color = 'green';
                              break;
                            case '1':
                              color = 'red';
                              break;
                            case '2':
                              color = 'yellow';
                              break;
                            case '3':
                              color = 'orange';
                              break;
                            case '4':
                              color = 'blue';
                              break;
                            case '5':
                              color = 'purple';
                              break;
                          }
                        }

                        return color;
                      })()
                    }
                  }, `${params.row.recordBeforeStateName ? params.row.recordBeforeStateName : ''}`),
                  h('Span', `${params.row.recordBeforeStateName ? '->' : ''}`),
                  h('Span', {
                    style: {
                      color: (() => {
                        let color = null;
                        let recordAfterStateColor = params.row.recordAfterStateColor;
                        if (typeof recordAfterStateColor !== 'undefined') {
                          switch (recordAfterStateColor) {
                            case '0':
                              color = 'green';
                              break;
                            case '1':
                              color = 'red';
                              break;
                            case '2':
                              color = 'yellow';
                              break;
                            case '3':
                              color = 'orange';
                              break;
                            case '4':
                              color = 'blue';
                              break;
                            case '5':
                              color = 'purple';
                              break;
                          }
                        }

                        return color;
                      })()
                    }
                  }, `${params.row.recordAfterStateName ? params.row.recordAfterStateName : ''}`)
                ])
              }
            },
            {
              title: '维护类型',
              key: 'recordTemplateName',
              render: (h, params) => {
                return h('Span', `${params.row.recordTemplateName ? params.row.recordTemplateName : '/'}`)
              }
            },
            {
              title: '维护结果',
              key: 'recordResultName',
              render: (h, params) => {
                return h('Span', `${params.row.recordResultValue ? `${params.row.recordResultName}:${params.row.recordResultValue}` : '/'}`)
              }
            },
            {
              title: '维护人员',
              key: 'createrName'
            },
            {
              title: '维护时间',
              key: 'createDate'
            }
          ],
          body: [],
          args: {
            startRow: 0,
            pageSize: 15,
            currentPage: 1,
            totalCount: 0
          }
        }
      }
    },
    mounted() {
      this._getRecordGroup();
    },
    methods: {
      _getRecordGroup() {
        this.treeList = [];
        this.$api.recordInterface.listTemplatefold({
          startRow: 0,
          pageSize: 100,
          templateFoldId: '',
          templateName: ''
        }).then(res => {
          if (res.data.success) {

            [].forEach.call(res.data.data, m => {
              this.treeList.push({
                // parentTemplateFoldId: m.parentTemplateFoldId,
                id: m.templateFoldId,
                templateFoldId: m.templateFoldId,
                name: m.templateFoldName,
                open: false,
                isFolder: false,
                clickNode: false,
                isModify: false,
                childNum: m.childNodes ? m.childNodes.length : 0,
                childNodes: m.childNodes ? m.childNodes : []
              })
            });

            if (this.treeList.length > 0) {
              this.treeList[0].clickNode = true;
              this.nodeTree.nodeModel = this.treeList[0];

              this.search.selectTemplateFoldValue = this.treeList[0].templateFoldId;
              this._getRecordStateList();
            }

          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      _getRecordStateList() {
        this.table.body = [];
        this.$api.recordInterface.listRecordStateResult({
          authUserId: this.search.selectUserValue,
          startTime: this.$refs.dateSrartTimePicker.publicStringValue,
          endTime: this.$refs.dateEndTimePicker.publicStringValue,
          recordTemplateId: this.search.selectTemplateValue,
          templateFoldId: this.search.selectTemplateFoldValue,
          templateId: this.search.templateId,
          startRow: this.table.args.startRow,
          pageSize: this.table.args.pageSize
        }).then(res => {
          res = res.data;
          if (res.success) {
            let a = [];
            [...res.data.dbPageList].forEach((m, i) => {
              if (m) {
                m.detail = {};
                m.index = i;
                a.push(m)
              }
            });

            this.table.body = a;
            this.table.args.totalCount = res.data.count;
          }
        }).catch(err => {
          console.error(err)
        })
      },
      handleSearch() {
        this._getRecordStateList();
      },
      onExpand(row, status) {
        let recordTable = this.$refs.recordTable;
        if (status) {
          this.$api.recordInterface.getRecordResult({
            recordResultId: row.recordResultId
          }).then(res => {
            res = res.data;
            if (res.success) {
              row.detail = res.data;
              recordTable.$refs.tbody.data[`${row.index}`].detail = row.detail
            }
          }).catch(err => {
            console.error(err)
          })
        }
      },
      _listRecordTemplate() {
        this.search.templateList = [];
        this.$api.recordInterface.listRecordTemplate()
          .then(res => {
            if (res.data.success) {
              this.search.templateList = res.data.data;
            }
          }).catch(err => {
          console.error(err)
        })
      },
      _listManager() {
        this.search.userList = [];
        this.$api.recordInterface.listManager()
          .then(res => {
            if (res.data.success) {
              this.search.userList = res.data.data;
            }
          }).catch(err => {
          console.error(err)
        })
      },
      _listTemplate() {
        this.search.templateFoldList = [];
        this.$api.recordInterface.listTemplate()
          .then(res => {
            if (res.data.success) {
              this.search.templateFoldList = res.data.data;
            }
          }).catch(err => {
          console.error(err)
        })
      },
      changeSearch(type, index) {
        this.swapInfo('custom', type, index);
      },
      swapInfo(state, type, index) {
        switch (type) {
          case 0:
            this.search.selectTemplate = (() => {
              let result = null;
              if (state === 'custom') {
                result = this.search.templateList[index].recordTemplateName;
                this.search.selectTemplateValue = this.search.templateList[index].recordTemplateId;
              } else if (state === 'reset') {
                result = '选择维护模板';
                this.search.selectTemplateValue = '';
              }
              return result;
            })();
            break;
          case 1:
            this.search.selectUser = (() => {
              let result = null;
              if (state === 'custom') {
                result = this.search.userList[index].authUserName;
                this.search.selectUserValue = this.search.userList[index].authUserId;
              } else if (state === 'reset') {
                result = '选择维护人员';
                this.search.selectUserValue = '';
              }
              return result;
            })();
            break;
          case 2:
            this.search.selectTemplateFold = (() => {
              let result = null;
              if (state === 'custom') {
                result = this.search.templateFoldList[index].templateName;
                this.search.selectTemplateFoldValue = this.search.templateFoldList[index].templateId;
              } else if (state === 'reset') {
                result = '选择巡检码';
                this.search.selectTemplateFoldValue = '';
              }
              return result;
            })();
            break;
        }
      },
      closeSearch(type) {
        this.swapInfo('reset', type);
      },
      _exportRecord() {
        this.$api.recordInterface.exportRecordResult({
          templateFoldId: this.search.selectTemplateFoldValue
        }).then(res => {
          res = res.data;
          if (res.retCode) {
            return this.$Message.info(res.retMsg)
          } else if (!res.retCode) {
            let url = `${process.env.api.commonUrl}/recordResult/exportRecordResult`;
            let form = document.createElement('form');
            let input = document.createElement('input');
            let formTable = document.querySelector('#formTable');
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
      changeRecordPage(targetPage) {
        this.table.args.currentPage = targetPage;
        this.table.args.startRow = (targetPage - 1) * this.table.args.pageSize;
        this._getRecordStateList();
      },
      onClick(model) {
        this.nodeTree.nodeModel = model;
        this.search.selectTemplateFoldValue = model.templateFoldId;
        this._getRecordStateList();
      },
      expandClick(model) {
        this.nodeTree.nodeModel = model;
        let childNodes = [...model.childNodes];

        if (model.isExpand) {
          model.loadNode = 1;
          model.loadNode = 2;
          model.isFolder = true;
          model.childNodes = [];
          [...childNodes].forEach((m) => {
            model.childNodes.push({
              parentTemplateFoldId: m.parentTemplateFoldId,
              id: m.templateFoldId,
              templateFoldId: m.templateFoldId,
              name: m.templateFoldName,
              open: false,
              isFolder: false,
              clickNode: false,
              isModify: false,
              childNum: m.childNodes ? m.childNodes.length : 0,
              childNodes: m.childNodes ? m.childNodes : []
            })
          })
        }
      }
    }
  }
</script>
