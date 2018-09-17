<style lang="scss" scoped>
  @import "./styles/qrcode-list.scss";
</style>

<template>
  <div class="qrcode-list">
    <div class="main">
      <div class="main__header clearfix">
        <div class="main__tip">
          <span class="main__tip--link">当前产品共{{table.body.length}}个</span>
          <!--<a class="main__tip&#45;&#45;intro" href="javascript:;">查看操作指南</a>-->
        </div>
        <div class="main__action">
          <ButtonGroup>
            <Button @click="showSingleModal">单个创建</Button>
            <Button type="primary" @click="showMultipleModal">批量创建</Button>
          </ButtonGroup>
        </div>
      </div>
      <div class="main__section clearfix">
        <div class="header">
          <div class="header__select-all">
            <Checkbox v-model="table.args.selectAll" @on-change="selectAll">&nbsp;全选</Checkbox>
          </div>
          <div class="header__action">
            <Button class="header__action--style" @click="exportDownloadMult">下载码包</Button>
            <Button class="header__action--style" @click="gatherMult">生成总码</Button>

            <Poptip placement="bottom" width="250" trigger="click" ref="poptipLabel">
              <Button class="header__action--style" @click="_showLabel({type:-1})">备注</Button>
              <div class="header__label" slot="content">
                <Input v-model="table.header.labelKey" placeholder="请输入文字生成标签" style="width: 217px"></Input>
                <div style="text-align: right;margin-top: 10px;">
                  <Button type="text" @click="_showLabel({type:0})">取消</Button>
                  <Button type="primary" size="small" @click="_showLabel({type:1})">确定</Button>
                </div>
              </div>
            </Poptip>

            <Button class="header__action--style" @click="showMoveModal">转移</Button>
            <Button class="header__action--style" @click="exportRecord">批量导出</Button>
            <Button class="header__action--style" @click="trash({type:1})">删除</Button>

            <Input v-model="table.header.searchKey" placeholder="请输入名称" style="width:170px;display: inline-table">
            <Button slot="append" icon="ios-search" @click.native="handleSearch"></Button>
            </Input>
          </div>
        </div>
        <div class="body" v-for="(item,index) in table.body">
          <div class="body__wrap">
            <Checkbox v-model="item.selected" class="body__wrap--checkbox"></Checkbox>
            <h5 class="body__wrap--name">
              <span class="body__wrap--title" style="margin-right: 20px">{{item.templateName}}</span>

              <Tag closable v-for="(tag,tagIndex) in item.templateTagList" :key="index"
                   @on-close="handleTagClose(item,tag)">{{tag}}
              </Tag>

              <Poptip placement="bottom" width="250" trigger="click" ref="poptipItemLabel">
                <Button class="body__wrap--plus" type="small" shape="circle" style="padding: 0 8px;">
                  <Icon type="plus-round"></Icon>
                  标签
                </Button>
                <div class="body-label__content" slot="content">
                  <Input v-model="table.header.labelKey" placeholder="请输入文字生成标签" style="width: 217px"></Input>
                  <div style="text-align: right;margin-top: 10px;">
                    <Button type="text" size="small" @click.native="_showLabel({type:0})">取消</Button>
                    <Button type="primary" size="small" @click.native="_showLabel({type:2,item:item})">确定</Button>
                  </div>
                </div>
              </Poptip>
            </h5>
            <p class="body__wrap--desc">
              <span class="body__wrap--date">{{item.createDate}}</span>
              <span style="margin-left: 5px">产品编号：{{item.templateId}}</span>
            </p>
            <div class="action">
              <div class="action__btn">
                <a href="javascript:;" class="action__btn--link" @click="qPreview(index)">预览<span>|</span></a>
                <a href="javascript:;" class="action__btn--link" @click="qDownload(index)">推广<span>|</span></a>
                <!--<a href="javascript:;" class="action__btn&#45;&#45;link" @click="qChart">扫码统计<span>|</span></a>-->
                <a href="javascript:;" class="action__btn--link" @click="qCopy(index)">复制<span>|</span></a>
                <a href="javascript:;" class="action__btn--link"
                   @click="qEdit(index)">修改<span>|</span></a>
                <a href="javascript:;" class="action__btn--link" @click="trash({type:0,index:index})">删除</a></div>
            </div>
          </div>
          <div class="body__status">
            <div class="content" v-if="item.recordResultVO">
              <p class="content--tip" :title="item.recordResultVO.templateName+'：'+item.recordResultVO.radioResult">
                {{item.recordResultVO.templateName}}：{{item.recordResultVO.radioResult}}</p>
              <p style="color: #999;margin-top: 3px">{{item.recordResultVO.createDate}}&nbsp;{{item.recordResultVO.createrName}}</p>
            </div>
            <div class="content" v-if="!item.recordResultVO">
              <p class="content--tip">暂无维护模板</p>
              <a href="javascript:;" class="content--btn" style="margin-top: 3px" @click="routeRdTpl(index)">去添加</a>
            </div>

            <div class="content" style="margin-top: 5px" v-if="!item.templateRecordStateVO">
              <a href="javascript:;" class="content--btn" @click="showStateMdl(index)">状态设置</a>
            </div>
            <div class="content" style="margin-top: 5px" v-if="item.templateRecordStateVO">
              <Tooltip content="请在移动端扫码变更状态" placement="left">
                <p style="color: #999;">
                  状态：<span :class="[
                  {'green':item.templateRecordStateVO.itemColor === '0'},
                  {'red':item.templateRecordStateVO.itemColor === '1'},
                  {'yellow':item.templateRecordStateVO.itemColor === '2'},
                  {'orange':item.templateRecordStateVO.itemColor === '3'},
                  {'blue':item.templateRecordStateVO.itemColor === '4'},
                  {'purple':item.templateRecordStateVO.itemColor === '5'}
                  ]">{{item.templateRecordStateVO.itemValue}}</span>
                </p>
              </Tooltip>
            </div>
          </div>
        </div>
        <div class="footer">
          <p class="footer__data" v-if="!table.body.length">暂无数据</p>
          <div class="footer__page" v-if="table.body.length">
            <div style="float: right;">
              <Page :total="table.args.totalCount"
                    :current="table.args.currentPage"
                    :page-size="table.args.pageSize"
                    show-total @on-change="changeQrcodePage">
              </Page>
            </div>
          </div>
        </div>
      </div>
    </div>

    <loader :dataSourceList="getDataSourceFirstList" :confirmfunc="confirmfunc"></loader>
    <loader :dataSourceList="getDataSourceSecondList" :confirmfunc="confirmfunc"></loader>
  </div>
</template>

<script>
  // import jTree from '@/components/j-tree/jTree.vue';
  import loader from '@/components/launch/loader.vue';

  export default {
    name: 'qrcode-list',
    components: {
      // jTree,
      loader
    },
    props: {
      treeNode: {
        type: Object,
        default: {}
      },
      treeList: {
        /*目录数据*/
        type: Array,
        default: []
      }
    },
    computed: {
      getDataSourceFirstList() {
        return this.$store.getters.getDataSourceList()
      },
      getDataSourceSecondList() {
        return this.$store.getters.getDataSourceList('second')
      }
    },
    data() {
      return {
        table: {
          header: {
            labelKey: '', /*标签内容*/
            searchKey: '' /*搜索关键词*/
          },
          body: [],
          args: {
            selectAll: false, /*全选*/
            startRow: 0, /*起始页*/
            pageSize: 7, /*一页条数*/
            currentPage: 1, /*当前页*/
            totalCount: 0 /*总记录条数*/
          }
        },
        initial: new Object(null),
      };
    },
    mounted() {
      // this._getFoldGroup();


      setTimeout(() => {
        this._getTemplateList();
      }, 300)


    },
    methods: {
      /**
       * 批量更新二维码
       */
      _batchUpdateTemplate(args) {
        this.$api.qrcodeInterface.batchUpdateTemplate({...args}).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
            this._getTemplateList();
          }
        }).catch(err => {
          console.error(err)
        })
      },
      /**
       * 显示标签
       */
      _showLabel(args) {
        let _args = {...args};

        class Maybe {
          constructor(value) {
            this.value = value;
          }

          map(fn) {
            return this.value ? Maybe.of(fn(this.value)) : Maybe.of(null);
          }
        }

        Maybe.of = function (val) {
          return new Maybe(val);
        };

        let boolean = (() => {
          return () => {
            let flag = false;
            [...this.table.body].forEach(m => {
              flag = flag || m.selected
            });
            return flag;
          }
        })();

        Maybe.of(_args).map((s) => {
          // (type:-1 添加标签动作，type:0 关闭标签 ，type:1 头部添加标签确认按钮，type:2 单个添加标签确认按钮）
          switch (s.type) {
            case -1:
              let bool = boolean();
              bool ? (() => {
                this.$refs.poptipLabel.visible = true;
              })() : this.$Message.info('请选择二维码');
              break;
            case 0:
              this.$refs.poptipLabel.visible = false;
              [...this.$refs.poptipItemLabel].forEach(m => {
                m.visible = false;
              });
              break;
            case 1:
              let args = {
                templateIdListJson: (() => {
                  let a = [];
                  [...this.table.body].forEach(m => {
                    if (m.selected) {
                      a.push(m.templateId)
                    }
                  });
                  return JSON.stringify(a)
                })(),
                templateName: '',
                templateTagListJson: (() => {
                  let a = [];
                  a.push(this.table.header.labelKey);
                  return JSON.stringify(a)
                })(),
                templateFoldId: this.treeNode.templateFoldId
              };
              this._batchUpdateTemplate({...args});
              break;
            case 2:
              let s_args = {
                templateIdListJson: (() => {
                  return JSON.stringify([`${s.item.templateId}`])
                })(),
                templateName: '',
                templateTagListJson: (() => {
                  let a = [];
                  a.push(this.table.header.labelKey);
                  return JSON.stringify(a)
                })(),
                templateFoldId: this.treeNode.templateFoldId
              };
              this._batchUpdateTemplate({...s_args});
              break;
          }
        });
      },
      /**
       * 关闭标签
       */
      handleTagClose(item, tag) {
        this.$api.qrcodeInterface.removeTemplateTag({
          templateId: item.templateId,
          templateTagName: tag,
        }).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
            this._getTemplateList();
          }
        }).catch(err => {
          console.error(err)
        })
      },
      /**
       * 获取二维码模板数据
       */
      _getTemplateList() {
        this.table.body = [];
        this.$api.qrcodeInterface.listTemplate({
          templateName: this.table.header.searchKey,
          templateFoldId: !this.$Global.isEmpty(this.treeNode) ? this.treeNode.templateFoldId : '',
          templateType: 0,
          startRow: this.table.args.startRow,
          pageSize: this.table.args.pageSize
        }).then(res => {
          res = res.data;
          if (res.success) {
            [...res.data.dbPageList].forEach(m => {
              m.selected = false;
            });
            this.table.body = res.data.dbPageList;
            this.table.args.totalCount = res.data.count;
            this.table.header.labelKey = '';
          }
        }).catch(err => console.error(err))
      },
      /**
       * 二维码分页
       */
      changeQrcodePage(targetPage) {
        this.table.args.currentPage = targetPage;
        this.table.args.startRow = (targetPage - 1) * this.table.args.pageSize;
        this._getTemplateList();
      },
      handleSearch() {
        this._getTemplateList();
      },
      /**
       * 添加维护模板
       */
      routeRdTpl(index) {
        this.$router.push({
          name: 'qrcode-detail',
          query: {
            templateFoldId: this.treeNode.templateFoldId,
            templateId: this.table.body[index].templateId,
            mobUrl: `${this.table.body[index].qrcodeUrlHeader}`,
            pcUrl: `${this.table.body[index].qrcodeViewUrl}`,
            templateType: 0
          }
        });

        this.$Global.VueDB().setItem('sWRd', true)
        // this.$store.dispatch('setShowRecord', true);
      },
      /**
       * 单个建码
       */
      showSingleModal() {
        if (this.treeList) {
          this.$store.dispatch('setDataSourceList', {
            compName: 'qSingleMdl',
            compType: 'second',
            dataSource: {
              showModal: true,
              templateFoldId: this.treeNode.templateFoldId,
            }
          });
        } else {
          this.$Message.info('请先创建目录！');
        }
      },
      /**
       * 批量建码
       */
      showMultipleModal() {
        this.$store.dispatch('setDataSourceList', {
          compName: 'qMultipleMdl',
          compType: 'second',
          dataSource: {
            showModal: true,
            templateFoldId: this.treeNode.templateFoldId,
          }
        });
      },
      /**
       * 全选
       */
      selectAll() {
        [...this.table.body].forEach(m => (m.selected = this.table.args.selectAll));
      },
      /**
       * 打包下载
       */
      exportDownloadMult() {
        let boolean = (() => {
          let flag = false;
          let items = this.table.body;
          for (let i = 0, len = items.length; i < len; i++) {
            items[i]['selected'] && (flag = true)
          }
          return flag;
        })();

        if (boolean) {
          let a = [];
          this.table.body.forEach(m => m.selected && a.push(m.templateId));

          this.$api.qrcodeInterface.exportQrcodePackage({
            templateIdList: JSON.stringify(a)
          }).then(res => {
            res = res.data;
            if (res.retCode) {
              return this.$Message.info(res.retMsg)
            } else if (!res.retCode) {
              let url = `${process.env.api.commonUrl}/template/exportQrcodePackage`;
              let form = document.createElement('form');
              let input = document.createElement('input');
              let formTable = document.querySelector('#formTable');

              input.setAttribute('name', 'templateIdList');
              input.value = JSON.stringify(a);
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
        } else {
          this.$Message.info('请选择二维码')
        }
      },
      /**
       * 建汇总码
       */
      gatherMult() {
        let boolean = (() => {
          let flag = false;
          let items = this.table.body;
          for (let i = 0, len = items.length; i < len; i++) {
            items[i]['selected'] && (flag = true)
          }
          return flag;
        })();

        if (boolean) {
          let a = [];
          this.table.body.forEach(m => m.selected && a.push(m.templateId));
          this.$api.qrcodeInterface.createGatherTemplate({
            templateFoldId: this.treeNode.templateFoldId,
            templateIdList: JSON.stringify(a)
          }).then(res => {
            res = res.data;
            if (res.success) {
              this.$Message.info(res.retMsg);
              this._getTemplateList();
            }
          }).catch(err => console.error(err))
        } else {
          this.$Message.info('请选择二维码')
        }
      },
      /**
       * 移动
       */
      showMoveModal() {
        let boolean = (() => {
          let flag = false;
          let items = this.table.body;
          for (let i = 0, len = items.length; i < len; i++) {
            items[i]['selected'] && (flag = true)
          }
          return flag;
        })();

        if (boolean) {
          this.$store.dispatch('setDataSourceList', {
            compName: 'qMoveMdl',
            compType: 'second',
            dataSource: {
              showModal: true
            }
          });
        } else {
          this.$Message.info('请选择二维码')
        }
      },
      /**
       * 记录导出
       */
      exportRecord() {
        let boolean = (() => {
          let flag = false;
          let items = this.table.body;
          for (let i = 0, len = items.length; i < len; i++) {
            items[i]['selected'] && (flag = true)
          }
          return flag;
        })();

        if (boolean) {
          let a = [];
          this.table.body.forEach(m => m.selected && a.push(m.templateId));

          this.$api.qrcodeInterface.exportRecordByTemplateId({
            templateIdList: JSON.stringify(a)
          }).then(res => {
            res = res.data;

            if (res.retCode) {
              return this.$Message.info(res.retMsg)
            } else if (!res.retCode) {
              let url = `${process.env.api.commonUrl}/template/exportRecordByTemplateId`;
              let form = document.createElement('form');
              let input = document.createElement('input');
              let formTable = document.querySelector('#formTable');

              input.setAttribute('name', 'templateIdList');
              input.value = JSON.stringify(a);
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
        } else {
          this.$Message.info('请选择二维码')
        }
      },
      /**
       * 预览二维码
       */
      qPreview(index) {
        this.$store.dispatch('setDataSourceList', {
          compName: 'qVwMdl',
          compType: 'second',
          dataSource: {
            showModal: true,
            templateObj: {
              // templateId: this.table.body[index].templateId,
              mobUrl: `${this.table.body[index].qrcodeUrlHeader}`,
              pcUrl: `${this.table.body[index].qrcodeViewUrl}`
            }
          }
        });
      },
      /**
       * 下载二维码
       * @param index
       */
      qDownload(index) {
        this.$store.dispatch('setDataSourceList', {
          compName: 'qDownloadMdl',
          compType: 'second',
          dataSource: {
            showModal: true,
            templateObj: {
              templateId: this.table.body[index].templateId,
              mobUrl: `${this.table.body[index].qrcodeUrlHeader}`,
              pcUrl: `${this.table.body[index].qrcodeViewUrl}`
            }
          }
        });
      },
      /**
       * 弹窗回调函数callback
       * @param value
       */
      confirmfunc(value) {
        // 二维码移动
        if (value.isMoveFold) {
          let a = [];
          this.table.body.forEach(m => m.selected && a.push(m.templateId));
          this.$api.qrcodeInterface.updateTemplateFold({
            templateIdJsonArray: JSON.stringify(a),
            templateFoldId: value.templateFoldId
          }).then(res => {
            res = res.data;
            this.$Message.info('成功');
            if (res.success) {
              this._getTemplateList();
            }
          }).catch(err => console.error(err))
        }
        // 二维码下载
        value.isDownload && this.$Global.gtDloadByB64(value.qrcodeImg, `${value.templateId}.png`);
        // 状态设置
        if (value.isStateSetting) {
          this.initial.templateRecordStateVO.recordStateTemplateVO = value.recordStateTemplateVO;
          this.initial.templateRecordStateVO.editRecordStateAuthGroup = value.editRecordStateAuthGroup;
          this.initial.templateRecordStateVO.isOpenRecordStateChangeRemind = value.isOpenRecordStateChangeRemind;
          this.initial.templateRecordStateVO.recordStateChangeRemindAuthGroup = value.recordStateChangeRemindAuthGroup;
          this.initial.templateRecordStateVO.recordStateChangeRemindItemValue = value.recordStateChangeRemindItemValue;

          let param = new ToolFunctor(this)._set();
          this.$api.qrcodeInterface.updateSingleTemplate(param).then(res => {
            if (res.data.success) {
              this.$Message.info('成功');
              this._getTemplateList();
            }
          }).catch(err => {
            console.error(err)
          })
        }
      },
      /**
       * 状态设置
       */
      showStateMdl(index) {
        let item = this.table.body[index];
        new ToolFunctor(this)._get({...this.table.body[index]});

        console.log(this.initial);

        this.$store.dispatch('setDataSourceList', {
          compName: 'qStateSettingMdl',
          dataSource: {
            showModal: true,
            templateObj: {
              recordStateTemplateVO: this.initial.templateRecordStateVO.recordStateTemplateVO,
              editRecordStateAuthGroup: item.templateRecordStateVO ? this.initial.templateRecordStateVO.editRecordStateAuthGroup : [],
              recordStateChangeRemindAuthGroup: item.templateRecordStateVO ? this.initial.templateRecordStateVO.recordStateChangeRemindAuthGroup : [],
              isOpenRecordStateChangeRemind: item.templateRecordStateVO ? this.initial.templateRecordStateVO.isOpenRecordStateChangeRemind : false,
              recordStateChangeRemindItemValue: item.templateRecordStateVO ? this.initial.templateRecordStateVO.recordStateChangeRemindItemValue : '',
            },
            initial: this.initial
          }
        });
      },
      /**
       * 二维码复制
       * @param index
       */
      qCopy(index) {
        this.$api.qrcodeInterface.copyTemplate({
          templateId: this.table.body[index].templateId
        }).then(res => {
          res = res.data;
          this.$Message.info(res.retMsg);
          if (res.success) {
            this._getTemplateList();
          }
        }).catch(err => console.error(err))
      },
      /**
       * 二维码编辑
       * @param index
       */
      qEdit(index) {
        this.$router.push({
          name: 'qrcode-detail',
          query: {
            templateFoldId: this.treeNode.templateFoldId,
            templateId: this.table.body[index].templateId,
            mobUrl: `${this.table.body[index].qrcodeUrlHeader}`,
            pcUrl: `${this.table.body[index].qrcodeViewUrl}`,
            templateType: 0
          }
        });
      },
      /**
       * 删除二维码
       * @param param
       */
      trash(param) {
        // type：0 单个 type：1批量
        let type = param.type;
        switch (type) {
          case 0:
            this.$Modal.confirm({
              title: '提示',
              content: `<p>删除后将无法恢复，确定删除这个二维码吗？</p>`,
              onOk: () => {
                this.$api.qrcodeInterface.removeTemplate({
                  templateIdListJson: JSON.stringify([`${this.table.body[param.index].templateId}`]),
                }).then(res => {
                  res = res.data;
                  if (res.success) {
                    this._getTemplateList();
                    this.$Global.timeout(1000).then(() => {
                      if (!this.table.body.length) {
                        this.table.args.startRow = 0;
                        this.table.args.currentPage = 1;
                        this._getTemplateList();
                      }
                    })
                  }

                  this.$Message.info(res.retMsg)
                }).catch(err => console.error(err))
              }
            });
            break;
          case 1:
            let boolean = (() => {
              let flag = false;
              let items = this.table.body;
              for (let i = 0, len = items.length; i < len; i++) {
                items[i]['selected'] && (flag = true)
              }
              return flag;
            })();

            if (boolean) {
              let a = [];
              this.table.body.forEach(m => m.selected && a.push(m.templateId));
              this.$Modal.confirm({
                title: '提示',
                content: '<p>确定删除？</p>',
                onOk: () => {
                  this.$api.qrcodeInterface.removeTemplate({
                    templateIdListJson: JSON.stringify(a)
                  }).then(res => {
                    res = res.data;
                    this.table.args.selectAll = false;
                    this.table.args.startRow = 0;
                    this.table.args.currentPage = 1;

                    res.success && this._getTemplateList();
                    this.$Message.info(res.retMsg);
                  }).catch(err => console.error(err))
                }
              });
            } else {
              this.$Message.info('请选择二维码')
            }
            break;
        }
      }
    }
  };

  class ToolFunctor {
    constructor(tis) {
      if (!tis) {
        throw new Error('[SKETCHPAD]: Missing parameters (tis)');
      }

      this.tis = typeof(tis) !== 'undefined' ? tis : null;
    }

    _get(res) {

      let target = new Object(null);
      target.templateFoldId = res.templateFoldId ? res.templateFoldId : '';
      target.templateId = res.templateId ? res.templateId : '';
      target.templateName = res.templateName ? res.templateName : '';
      target.templateInfoVO = res.templateInfoVO ? res.templateInfoVO : null;
      target.templateRecordStateVO = res.templateRecordStateVO ? (() => {
        return res.templateRecordStateVO
      })() : {
        recordStateTemplateVO: {
          recordStateTemplateId: '',
          recordStateTemplateName: '',
          stateCfgList: []
        },
        isOpenRecordState: false,
        editRecordStateAuthGroup: [],
        isOpenRecordStateChangeRemind: false,
        recordStateChangeRemindItemValue: '', // 选中状态变更提醒颜色
        recordStateChangeRemindAuthGroup: [], // 状态变更提醒人员组
        templateId: res.templateId,
        recordStateResultId: '',
        itemValue: '暂无状态',
        itemColor: '-',
        lastItemValue: ''
      };
      target.recordResultJson = res.recordResultJson ? res.recordResultJson : null;

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);
      target.templateFoldId = this.tis.initial.templateFoldId;
      target.templateId = this.tis.initial.templateId;
      target.templateName = this.tis.initial.templateName;
      target.recordResultJson = this.tis.initial.recordResultJson;
      target.templateInfoListJson = JSON.stringify(this.tis.initial.templateInfoVO);
      target.templateRecordStateInfoJson = JSON.stringify(this.tis.initial.templateRecordStateVO);

      return target;
    }
  }
</script>
