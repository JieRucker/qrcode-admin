<style lang="scss">
  @import "./styles/state-list.scss";
</style>

<template>
  <div class="state-list">
    <div class="main">
      <div class="main__header clearfix">
        <div class="main__tip">
          <p class="main__tip--title">状态组列表</p>
        </div>
        <div class="main__action">
          <Button type="primary" style="margin-right: 10px" @click="newStateModal">
            <Icon type="plus-round"></Icon>&nbsp;新建状态组
          </Button>
        </div>
      </div>
      <div class="main__section">
        <div class="card clearfix">
          <ul class="l-list">
            <li class="l-list__item" v-for="(item,index) in table.body" style="width:33.3%">
              <Card style="width:100%">
                <p slot="title">
                  {{item.recordStateTemplateName}}
                </p>
                <p slot="extra">
                  <Icon type="edit" class="l-list__item--edit" @click.native="editButton(index)"></Icon>
                  <Icon type="trash-a" class="l-list__item--trash" @click.native="trashButton(index)"></Icon>
                </p>
                <p>
                  <Tag type="dot" :color="child.color === 0 ?
                                'green' : child.color === 1 ?
                                'red' : child.color === 2 ?
                                'yellow' : child.color === 3 ?
                                'orange' : child.color === 4 ?
                                'blue' : child.color === 5 ?
                                'purple' : ''" class="l-list__item--tag"
                       v-for="(child,childIndex) in item.stateCfgList" :key="childIndex">{{child.itemName}}
                  </Tag>
                </p>
              </Card>
            </li>
          </ul>
        </div>
      </div>
      <div class="main__footer">
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="table.args.page.totalCount"
                  :current="table.args.page.currentPage"
                  :page-size="table.args.page.pageSize"
                  show-total @on-change="_changePage"></Page>
          </div>
        </div>
      </div>
    </div>

    <!--新建状态组-->
    <new-state-nature ref="newStateNature"></new-state-nature>
  </div>
</template>

<script>
  import newStateNature from "./modal/new-state-nature.vue";

  export default {
    name: "state-list",
    components: {
      newStateNature
    },
    data() {
      return {
        table: {
          body: [
            {
              recordStateTemplateName: '消防箱巡检',
              stateCfgList: [
                {
                  itemName: '正常',
                  color: 0
                },
                {
                  itemName: '异常',
                  color: 1
                },
                {
                  itemName: '缺件，需维护',
                  color: 2
                }
              ]
            }
          ],
          args: {
            page: {
              startPage: 0,
              pageSize: 12,
              currentPage: 1,
              totalCount: 0
            }
          }
        }
      }
    },
    mounted() {
      this._getRecordStateList()
    },
    methods: {
      _getRecordStateList() {
        this.table.body = [];
        this.$api.recordStateInterface.listRecordStateTemplate({...this.table.args.page})
          .then(res => {
            if (res.data.success) {
              this.table.body = res.data.data.dbPageList;
              this.table.args.page.totalCount = res.data.data.count;
            }
          }).catch(err => {
          console.error(err)
        })
      },
      _changePage(targetPage) {
        this.table.args.page.currentPage = targetPage;
        this.table.args.page.startPage = (targetPage - 1) * this.table.args.page.pageSize;
        this._getRecordStateList()
      },
      editButton(index) {
        let modal = this.$refs.newStateNature.modal.newStateModal;
        let body = this.table.body[index];
        let loop = (() => {
          return (modal, obj) => {
            Object.keys(obj).forEach((key) => {
              modal[key] = obj[key]
            });
          }
        })();

        loop(modal, {
          stateList: [],
          modalType: 1,
          recordStateId: body.recordStateTemplateId,
          recordStateName: body.recordStateTemplateName
        });

        [].forEach.call(body.stateCfgList, m => {
          modal['stateList'].push({
            itemName: m.itemName,
            color: m.color
          })
        });

        modal.show = true;
      },
      trashButton(index) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>一旦你删除状态组"设备状态"，所有与该状态组有关的信息将被永久删除。这是一个不可恢复的操作，请谨慎对待！</p>',
          onOk: () => {
            this.$api.recordStateInterface.removeRecordStateTemplate({
              recordStateId: this.table.body[index].recordStateTemplateId
            }).then(res => {
              if (res.data.success) {
                this.$Message.info('成功');
                this._getRecordStateList();
                this.$Global.timeout(1000).then(() => {
                  if (!this.table.body.length) {
                    this.table.args.startPage = 0;
                    this.table.args.currentPage = 1;
                    this._getRecordStateList();
                  }
                })
              }
            }).catch(err => {
              console.error(err)
            })
          }
        });
      },
      newStateModal() {
        this.$refs.newStateNature.modal.newStateModal.modalType = 0;
        this.$refs.newStateNature.modal.newStateModal.recordStateName = '';
        this.$refs.newStateNature.modal.newStateModal.stateList = [{
          itemName: '',
          color: 0
        }];
        this.$refs.newStateNature.modal.newStateModal.show = true;
      }
    }
  }
</script>

