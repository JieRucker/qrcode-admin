<style lang="scss">
  @import "./styles/card-list.scss";
</style>
<template>
  <div class="card-list">
    <div class="tree" style="background-color:#f8f8f8">
      <h2 class="tree--title">部门</h2>
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
          <span class="main__tip--link">当前名片共{{table.body.length}}个</span>
        </div>
        <div class="main__action">
          <Input placeholder="请输入名片名称" v-model="table.header.searchKey" style="width:200px;">
          <Button slot="append" icon="ios-search" @click="onSearch"></Button>
          </Input>
          <Button type="text">部门通讯录</Button>
          <Button type="primary" @click="buildCard">创建名片</Button>
        </div>
      </div>
      <div class="main__section clearfix">
        <div class="header">
          <div class="header__select-all">
            <Checkbox v-model="table.args.selectAll" @on-change="selectAll">&nbsp;全选</Checkbox>
          </div>
          <div class="header__action">
            <Button class="header__action--style" @click="trashCard({type:1})">删除</Button>
          </div>
        </div>
        <div class="body" v-for="(item,index) in table.body">
          <div class="body__wrap">
            <Checkbox v-model="item.selected" class="body__wrap--checkbox"></Checkbox>
            <div class="avatar">
              <Avatar icon="person" size="large" :src="item.imageUrl"/>
            </div>
            <div class="detail">
              <h5 class="body__wrap--title">{{item.fullName}}<span style="margin-left: 10px">{{item.position}}</span>
              </h5>
              <p class="body__wrap--desc">
                <span class="body__wrap--date">{{item.createDate}}</span>
                <!--<span class="body__wrap&#45;&#45;single">今日扫描{{item.single}}次</span>-->
                <!--<span class="body__wrap&#45;&#45;total">次累计扫描{{item.total}}次</span>-->
              </p>
              <p class="body__wrap--link">
                <span class="tel" v-if="item.telephone !== ''">
                  <Icon type="ios-telephone" class="icon" size="16"></Icon>
                  <span>{{item.telephone}}</span>
                </span>
                <span class="email" v-if="item.email !== ''">
                  <Icon type="ios-email" class="icon" size="16"></Icon>
                  <span>{{item.email}}</span>
                </span>
              </p>
            </div>
          </div>
          <div class="body__status">
            <a href="javascript:;" class="body__status--icon"
               @click="vwCard(index)">预览<span>|</span></a>
            <a href="javascript:;" class="body__status--icon"
               @click="qDownload(index)">推广<span>|</span></a>
            <a href="javascript:;" class="body__status--icon"
               @click="copyCard({index:index})">复制<span>|</span></a>
            <a href="javascript:;" class="body__status--icon"
               @click="editCard(index)">编辑<span>|</span></a>
            <a href="javascript:;" class="body__status--icon"
               @click="trashCard({type:0,index:index})">删除</a>
          </div>
        </div>
        <div class="footer">
          <p class="footer__data" v-if="!table.body.length">暂无数据</p>
          <div class="footer__page" v-if="table.body.length">
            <div style="float: right;">
              <Page :total="table.args.totalCount"
                    :current="table.args.currentPage"
                    :page-size="table.args.pageSize"
                    show-total @on-change="changeCardPage">
              </Page>
            </div>
          </div>
        </div>
      </div>
    </div>

    <loader :dataSourceList="getDataSourceList" :confirmfunc="confirmfunc"></loader>
  </div>
</template>

<script>
  import jTree from '@/components/j-tree/jTree.vue';
  import loader from '@/components/launch/loader.vue'

  export default {
    name: 'card-list',
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
          selectCardFoldId: '',
          nodeModel: null,
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
            pageSize: 15,
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
      _getFoldGroup() {
        this.treeList = [];
        this.$api.cardInterface.listCardfold()
          .then(res => {
            if (res.data.success) {
              [...res.data.data].forEach(m => {
                this.treeList.push({
                  parentCardFoldId: m.parentCardFoldId,
                  id: m.cardFoldId,
                  cardFoldId: m.cardFoldId,
                  name: m.cardFoldName,
                  open: false,
                  isFolder: false,
                  clickNode: false,
                  isEdit: false,
                  childNum: m.childNodes ? m.childNodes.length : 0,
                  childNodes: m.childNodes ? m.childNodes : []
                })
              });

              if (this.treeList.length > 0) {
                this.treeList[0].clickNode = true;
                this.tree.nodeModel = this.treeList[0];

                this.tree.selectCardFoldId = this.treeList[0].cardFoldId;
                this._getCardList();
              }

            } else {
              this.$Message.error(res.data.retMsg)
            }
          }).catch(err => {
          console.error(err)
        })
      },
      /**
       * 预览名片
       */
      vwCard(index) {
        this.$store.dispatch('setDataSourceList', {
          compName: 'qVwMdl',
          compType: 'second',
          dataSource: {
            showModal: true,
            templateObj: {
              templateId: this.table.body[index].cardId,
              mobUrl: `${this.table.body[index].qrcodeUrlHeader}`,
              pcUrl: `${this.table.body[index].qrcodeViewUrl}`
            }
          }
        });
      },
      editCard(index) {
        this.$router.push({
          name: 'card-detail',
          query: {
            cardFoldId: this.tree.selectCardFoldId,
            cardId: this.table.body[index].cardId,
            mobUrl: `${this.table.body[index].qrcodeUrlHeader}`,
            pcUrl: `${this.table.body[index].qrcodeViewUrl}`
          }
        });
      },
      qDownload(index) {
        this.$store.dispatch('setDataSourceList', {
          compName: 'qDownloadMdl',
          compType: 'second',
          dataSource: {
            showModal: true,
            templateObj: {
              templateId: this.table.body[index].cardId,
              mobUrl: `${this.table.body[index].qrcodeUrlHeader}`
            }
          }
        });
      },
      confirmfunc(value) {
        value.isDownload && this.$Global.gtDloadByB64(value.qrcodeImg, `${value.templateId}.png`)
      },
      copyCard(param) {
        this.$api.cardInterface.saveCardfromCardId({
          cardId: this.table.body[param.index].cardId
        }).then(res => {
          res = res.data;
          res.success && this._getCardList();
        }).catch(err => console.error(err))
      },
      trashCard(param) {
        let type = param.type;
        switch (type) {
          case 0:
            this.$Modal.confirm({
              title: '删除名片',
              content: '<p>名片删除后，扫码将无法显示，确定删除该名片吗？</p>',
              onOk: () => {
                this.$api.cardInterface.removeCard({
                  cardId: this.table.body[param.index].cardId
                }).then(res => {
                  res = res.data;
                  res.success && this._getCardList();
                  this.$Global.timeout(1000).then(() => {
                    if (!this.table.body.length) {
                      this.table.args.startRow = 0;
                      this.table.args.currentPage = 1;
                      this._getCardList();
                    }
                  });
                  this.$Message.info(res.retMsg);
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
              this.table.body.forEach(m => m.selected && a.push(m.cardId));
              this.$Modal.confirm({
                title: '提示',
                content: '<p>确定删除？</p>',
                onOk: () => {
                  this.$api.cardInterface.removeCard({
                    cardId: JSON.stringify(a)
                  }).then(res => {
                    res = res.data;
                    this.table.args.selectAll = false;
                    this.table.args.startRow = 0;
                    this.table.args.currentPage = 1;
                    res.success && this._getCardList();
                    this.$Message.info(res.retMsg);
                  }).catch(err => console.error(err))
                }
              });
            } else {
              this.$Message.info('请选择名片')
            }
            break;
        }
      },
      changeCardPage(targetPage) {
        this.table.args.currentPage = targetPage;
        this.table.args.startRow = (targetPage - 1) * this.table.args.pageSize;
        this._getCardList();
      },
      buildCard() {
        if (!this.treeList.length) {
          return this.$Message.info('请先创建目录')
        }
        this.$router.push({
          name: 'card-detail',
          query: {
            cardFoldId: this.tree.selectCardFoldId,
            cardId: null
          }
        });
      },
      selectAll() {
        this.table.body.forEach(m => m.selected = this.table.args.selectAll);
      },
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
              this.$api.cardInterface.saveCardfold({
                parentCardFoldId: -1,
                cardFoldName: this.tree.foldName,
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
      onPlus(model) {
        this.tree.nodeModel = model;
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
              this.$api.cardInterface.saveCardfold({
                parentCardFoldId: this.tree.nodeModel.cardFoldId,
                cardFoldName: this.tree.foldName,
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
            this.tree.createFileMenu = '';
          }
        })
      },
      onBlur(event, model) {
        event.target.value !== model.name ? (() => {
          this.$api.cardInterface.updateCardfold({
            cardfoldId: model.cardFoldId,
            cardfoldName: event.target.value,
          }).then((res) => {
            this.$Message.info(res.data.retMsg);
            this._getFoldGroup();
          }).catch((err) => {
            console.log(err)
          })
        })() : null
      },
      onRemove(model) {
        this.tree.nodeModel = model;
        this.$Modal.confirm({
          title: '提示',
          content: `<p>是否删除？</p>`,
          onOk: () => {
            this.$api.cardInterface.removeCardfold({
              cardFoldId: model.cardFoldId
            }).then((res) => {
              this.$Message.info(res.data.retMsg);
              this._getFoldGroup();
            }).catch((err) => {
              console.log(err)
            })
          },
          onCancel: () => {
          }
        })
      },
      onClick(model) {
        this.tree.nodeModel = model;
        this.tree.selectCardFoldId = model.cardFoldId;
        this._getCardList()
      },
      _getCardList() {
        this.table.body = [];
        this.$api.cardInterface.listCard({
          cardName: this.table.header.searchKey,
          cardFoldId: this.tree.selectCardFoldId,
          startRow: this.table.args.startRow,
          pageSize: this.table.args.pageSize
        }).then(res => {
          res = res.data;
          if (res.success) {
            [...res.data.dbPageList].forEach(m => {
              this.table.body.push({
                imageUrl: m.cardBaseInfo.avatarImage.imageUrl,
                fullName: m.cardBaseInfo.fullName,
                position: m.cardBaseInfo.position,
                email: (m.cardLinkInfo && m.cardLinkInfo.emailList.length) ? m.cardLinkInfo.emailList[0].value : '',
                telephone: (m.cardLinkInfo && m.cardLinkInfo.telephone) ? m.cardLinkInfo.telephone : '',
                createDate: m.createDate,
                cardId: m.cardId,
                qrcodeUrlHeader: m.qrcodeUrlHeader,
                selected: false
              })
            });

            this.table.args.totalCount = res.data.count;
          }
        }).catch(err => {
          console.error(err)
        })
      },
      expandClick(model) {
        this.tree.nodeModel = model;
        let childNodes = [...model.childNodes];
        if (model.isExpand) {
          model.loadNode = 1;
          model.loadNode = 2;
          model.isFolder = true;
          model.childNodes = [];
          [...childNodes].forEach((m) => {
            model.childNodes.push({
              parentCardFoldId: m.parentCardFoldId,
              id: m.cardFoldId,
              cardFoldId: m.cardFoldId,
              name: m.cardFoldName,
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
      onSearch() {
        this._getCardList();
      }
    }
  };
</script>
