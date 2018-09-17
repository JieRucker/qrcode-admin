<style lang="scss">
  @import "./styles/material-list.scss";
</style>
<template>
  <div class="material-list">
    <div class="tree" style="background-color:#f8f8f8">
      <h2 class="tree--title">素材目录</h2>
      <Button type="default" size="small" class="tree--button" @click="_setFolder">
        新建目录
      </Button>
      <j-tree
        :list="treeList"
        :click="onClick"
        :plus="onPlus"
        :blur="onBlur"
        :remove="onRemove"
        :expand="expandClick"
        :is-open="false">
      </j-tree>
    </div>

    <div class="main">
      <div class="main__header clearfix">
        <div class="main__tip">
          <span class="main__tip--link">当前素材共{{table.args.totalCount}}个</span>
        </div>
        <div class="main__action">
          <Input placeholder="请输入素材名" v-model="table.header.searchKey" style="width:200px;margin-right: 10px">
          <Button slot="append" icon="ios-search" @click="onSearch"></Button>
          </Input>
          <Button type="primary" @click="openMaterialDetail">创建素材</Button>
        </div>
      </div>
      <div class="main__section clearfix">
        <div class="header">
          <div class="header__select-all">
            <Checkbox v-model="table.args.selectAll" @on-change="selectAll">&nbsp;全选</Checkbox>
          </div>
          <div class="header__action">
            <Button class="header__action--style" @click="trashMaterial({type:1})">删除</Button>
          </div>
        </div>
        <div class="body" v-if="table.body.length">
          <Row class="body__content">
            <Col span="8" class="l-list" v-for="(item,index) in table.body" :key="index">
              <Card style="width:100%" class="l-list__item">
                <div class="l-list__img">
                  <img class="l-list__img--src" src="https://biz.cli.im/Public/images/sucai_default.png">
                  <Checkbox v-model="item.selected" class="l-list__img--checkbox"></Checkbox>
                </div>
                <div class="l-list__desc">
                  <div class="l-list__intro">
                    <p class="l-list__intro--name" :title="item.templateName">{{item.templateName}}</p>
                    <p class="l-list__intro--date">{{item.createDate}}</p>
                  </div>
                  <div class="l-list__action">
                    <a href="javascript:;" class="l-list__action--icon"
                       @click="showMaterial(index)">预览<span>|</span></a>
                    <a href="javascript:;" class="l-list__action--icon"
                       @click="editMaterial(index)">编辑<span>|</span></a>
                    <a href="javascript:;" class="l-list__action--icon"
                       @click="trashMaterial({type:0,index:index})">删除</a>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <div class="footer">
          <p class="footer__data" v-if="!table.body.length">暂无数据</p>
          <div class="footer__page" v-if="table.body.length">
            <div style="float: right;">
              <Page :total="table.args.totalCount"
                    :current="table.args.currentPage"
                    :page-size="table.args.pageSize"
                    show-total @on-change="changeMaterialPage">
              </Page>
            </div>
          </div>
        </div>
      </div>
    </div>

    <loader :dataSourceList="getDataSourceList"></loader>
  </div>
</template>

<script>
  import jTree from '@/components/j-tree/jTree.vue';
  import loader from '@/components/launch/loader.vue';

  export default {
    name: 'material-list',
    components: {
      jTree,
      loader
    },
    computed: {
      getDataSourceList() {
        return this.$store.getters.getDataSourceList('second')
      }
    },
    data() {
      return {
        tree: {
          selectTemplateFoldId: '',
          foldName: ''
        },
        table: {
          header: {
            searchKey: ''
          },
          body: [],
          args: {
            selectAll: false,
            startRow: 0,
            pageSize: 10,
            currentPage: 1,
            totalCount: 0
          }
        },
        treeList: []
      };
    },
    mounted() {
      this._getFoldGroup();
    },
    methods: {
      /**
       * 获取素材树接口
       */
      _getFoldGroup() {
        this.treeList = [];
        this.$api.qrcodeInterface.listTemplatefold({templateFoldType: 1}).then(res => {
          if (res.data.success) {
            [...res.data.data].forEach(m => {
              this.treeList.push({
                parentTemplateFoldId: m.parentTemplateFoldId,
                id: m.templateFoldId,
                templateFoldId: m.templateFoldId,
                name: m.templateFoldName,
                open: false,
                isFolder: false,
                clickNode: false,
                isEdit: false,
                childNum: m.childNodes ? m.childNodes.length : 0,
                childNodes: m.childNodes ? m.childNodes : []
              })
            });

            if (this.treeList.length) {
              this.treeList[0].clickNode = true;

              this.tree.selectTemplateFoldId = this.treeList[0].templateFoldId;
              this._getMaterialList();
            } else {
              this.table.body = [];
            }

          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      /**
       * 获取素材列表接口
       */
      _getMaterialList() {
        this.table.body = [];
        this.$api.qrcodeInterface.listTemplate({
          templateName: this.table.header.searchKey,
          templateFoldId: this.tree.selectTemplateFoldId,
          templateType: 1,
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
          }
        }).catch(err => {
          console.error(err)
        })
      },
      /**
       * 删除素材
       * @param param（type:0 删除单个 type:1 删除多个）
       */
      trashMaterial(param) {
        let type = param.type;
        switch (type) {
          case 0:
            this.$Modal.confirm({
              title: '删除素材',
              content: `<p>素材删除后，所有对该素材的引用都会失效，确定删除该素材吗？</p>`,
              onOk: () => {
                this.$api.qrcodeInterface.removeTemplate({
                  templateIdListJson: JSON.stringify([`${this.table.body[param.index].templateId}`]),
                }).then(res => {
                  res = res.data;
                  this.$Global.timeout(1000).then(() => {
                    if (!this.table.body.length) {
                      this.table.args.startRow = 0;
                      this.table.args.currentPage = 1;
                      this._getMaterialList();
                    }
                  });
                  res.success && this._getMaterialList();
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
                title: '删除素材',
                content: '<p>素材删除后，所有对该素材的引用都会失效，确定删除该素材吗？</p>',
                onOk: () => {
                  this.$api.qrcodeInterface.removeTemplate({
                    templateIdListJson: JSON.stringify(a)
                  }).then(res => {
                    res = res.data;
                    this.table.args.selectAll = false;
                    this.table.args.startRow = 0;
                    this.table.args.currentPage = 1;
                    res.success && this._getMaterialList();
                    this.$Message.info(res.retMsg)
                  }).catch(err => console.error(err))
                }
              });
            } else {
              this.$Message.info('请选择素材')
            }
            break;
        }
      },
      /**
       * 切换素材分页
       * @param targetPage 目标页
       */
      changeMaterialPage(targetPage) {
        this.table.args.currentPage = targetPage;
        this.table.args.start = (targetPage - 1) * this.table.args.length;
        this._getMaterialList();
      },
      /**
       * 新建素材接口
       */
      openMaterialDetail() {
        if (!this.treeList.length) {
          return this.$Message.info('请先创建目录')
        } else if (this.$Global.isBlank(this.tree.selectTemplateFoldId)) {
          return this.$Message.info('请先选择目录')
        }

        this.$api.qrcodeInterface.saveTemplate({
          templateFoldId: this.tree.selectTemplateFoldId,
          templateType: 1,
          templateJson: {
            templateId: '',
            isOpenCityDisplay: 0,
            cityList: [],
            cover: {
              imageName: '',
              bucketName: '',
              ossKey: '',
              imageUrl: '',
              fileSize: '',
              id: ''
            }
          }
        }).then((res) => {
          res = res.data;
          if (res.success) {
            this.$router.push({
              name: 'material-detail',
              query: {
                templateFoldId: this.tree.selectTemplateFoldId,
                templateId: res.data
              }
            });
          }
        }).catch(err => console.log(err))
      },
      /**
       * 全选
       */
      selectAll() {
        [...this.table.body].forEach(m => (m.selected = this.table.args.selectAll));
      },
      /**
       * 新建树目录（foldName：目录名称）
       * @private
       */
      _setFolder() {
        this.$Modal.confirm({
          title: '新建目录',
          render: (h) => {
            return h('Input', {
              style: {
                marginTop: '10px'
              },
              props: {
                value: this.tree.foldName,
                autofocus: true,
                placeholder: '请输入目录名'
              },
              on: {
                input: (val) => {
                  this.tree.foldName = val;
                }
              }
            })
          },
          onOk: () => {
            !this.$Global.isBlank(this.tree.foldName) ? (() => {
              this.$api.qrcodeInterface.saveTemplatefold({
                parentTemplateFoldId: -1,
                templateFoldName: this.tree.foldName,
                templateFoldType: 1
              }).then((res) => {
                this.$Message.info(res.data.retMsg);
                this.tree.foldName = this.$Global.setBlank();
                this._getFoldGroup();
              }).catch((err) => {
                console.log(err)
              })
            })() : this.$Message.info('请输入名称');
          },
          onCancel: () => {
            this.tree.foldName = '';
          }
        })
      },
      /**
       * 添加树目录
       * @param model（选中的内容）
       */
      onPlus(model) {
        this.$Modal.confirm({
          title: '新建目录',
          render: (h) => {
            return h('Input', {
              style: {
                marginTop: '10px'
              },
              props: {
                value: this.tree.foldName,
                autofocus: true,
                placeholder: '请输入目录名'
              },
              on: {
                input: (val) => {
                  this.tree.foldName = val;
                }
              }
            })
          },
          onOk: () => {
            if (!this.$Global.isBlank(this.tree.foldName)) {
              this.$api.qrcodeInterface.saveTemplatefold({
                parentTemplateFoldId: this.tree.selectTemplateFoldId,
                templateFoldName: this.tree.foldName,
                templateFoldType: 1
              }).then((res) => {
                this.$Message.info(res.data.retMsg);
                this.tree.foldName = this.$Global.setBlank();
                this._getFoldGroup();
              }).catch(err => console.log(err))
            } else {
              this.$Message.info('请输入名称');
            }
          },
          onCancel: () => {
            this.tree.foldName = '';
          }
        })
      },
      /**
       * 修改树名称
       * @param event（event：鼠标blur时间）
       * @param model
       */
      onBlur(event, model) {
        event.target.value !== model.name ? (() => {
          this.$api.qrcodeInterface.updateTemplatefold({
            templatefoldId: model.templateFoldId,
            templatefoldName: event.target.value,
          }).then((res) => {
            this.$Message.info(res.data.retMsg);
            this._getFoldGroup();
          }).catch((err) => {
            console.log(err)
          })
        })() : null
      },
      /**
       * 删除树
       * @param model
       */
      onRemove(model) {
        this.$Modal.confirm({
          title: '提示',
          content: `<p>是否删除？</p>`,
          onOk: () => {
            this.$api.qrcodeInterface.removeTemplatefold({
              templateFoldId: model.templateFoldId
            }).then((res) => {
              this.$Message.info(res.data.retMsg);
              this._getFoldGroup();
            }).catch((err) => {
              console.log(err)
            })
          }
        })
      },
      /**
       * 点击树
       * @param model
       */
      onClick(model) {
        this.tree.selectTemplateFoldId = model.templateFoldId;
        this._getMaterialList()
      },
      /**
       * 展开树
       * @param model
       */
      expandClick(model) {
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
              isEdit: false,
              childNum: m.childNodes ? m.childNodes.length : 0,
              childNodes: m.childNodes ? m.childNodes : []
            })
          })
        }
      },
      /**
       * 搜索
       */
      onSearch() {
        this._getMaterialList();
      },
      /**
       * 编辑素材
       * @param index（素材索引）
       */
      editMaterial(index) {
        this.$router.push({
          name: 'material-detail',
          query: {
            templateFoldId: this.tree.selectTemplateFoldId,
            templateId: this.table.body[index].templateId,
            mobUrl: `${this.table.body[index].qrcodeUrlHeader}`,
            pcUrl: `${this.table.body[index].qrcodeViewUrl}`,
            templateType: 1
          }
        });
      },
      /**
       * 预览素材
       * @param index（素材索引）
       */
      showMaterial(index) {
        this.$store.dispatch('setDataSourceList', {
          compName: 'qVwMdl',
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
      }
    }
  };
</script>
