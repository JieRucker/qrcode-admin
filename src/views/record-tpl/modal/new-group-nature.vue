<style lang="scss">
  @include b(new-group-modal) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      @include e(top) {
        @include m(name) {
          width: 200px;
        }
      }
      @include e(middle) {
        @include m(title) {
          font-size: 16px;
          border-bottom: 1px solid #e9eaec;
          padding: 10px;
          color: #999;
        }
      }
      @include e(middle-content) {
        max-height: 300px;
        overflow-y: auto;
        @include b(l-list) {
          @include e(item) {
            height: 35px;
            line-height: 35px;
            padding: 0 10px;
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            &:hover {
              background-color: #f2f2f2;
            }
            @include m(name) {
              max-width: 280px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            @include m(edit) {
              font-size: 16px;
              cursor: pointer;
              margin-right: 10px;
              color: #999;
            }
            @include m(trash) {
              font-size: 16px;
              cursor: pointer;
              color: #999;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <Modal v-model="modal.newGroupModal.show" width="400" class="new-group-modal" @on-ok="saveGroup">
    <p slot="header" class="header">
      <span class="header--title">分组</span>
    </p>
    <div class="body">
      <div class="body__top">
        <Input v-model="modal.newGroupModal.categoryName" class="body__top--name" placeholder="请输入模板分组"></Input>
        <!--<Button type="primary" @click="newGroupButton">添加</Button>-->
      </div>
      <div class="body__middle">
        <p class="body__middle--title">分组</p>
        <div class="body__middle-content">
          <ul class="l-list">
            <li class="l-list__item" v-for="(item,index) in $parent.tabs.tabList">
              <p class="l-list__item--name" :title="item.categoryName">{{item.categoryName}}</p>
              <div>
                <Icon type="edit" class="l-list__item--edit" @click.native="editButton(index)"></Icon>
                <Icon type="trash-a" class="l-list__item--trash" @click.native="trashButton(index)"></Icon>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "new-group-nature",
    data() {
      return {
        modal: {
          newGroupModal: {
            show: false,
            categoryName: '',
            categoryList: [
              {
                categoryName: '系统模板库',
                categoryId: '',
                selected: false
              },
              {
                categoryName: '模板库001',
                categoryId: '',
                selected: false
              }
            ]
          }
        }
      }
    },
    methods: {
      saveGroup() {
        if (this.$Global.isBlank(this.modal.newGroupModal.categoryName)) {
          return this.$Message.info('请输入名称')
        }


        this.$api.recordTemplateInterface.saveRecordTemplateCategory({
          recordTemplateCategoryName: this.modal.newGroupModal.categoryName,
        }).then(res => {
          if (res.data.success) {
            this.$parent.listTab()
          } else {
            this.$Message.error(res.data.retMsg)
          }
        }).catch(err => {
          console.error(err)
        })
      },
      editButton(index) {
        this.$Modal.confirm({
          title: '提示',
          render: (h) => {
            return h('div', [
              h('Input', {
                style: {
                  marginTop: '10px'
                },
                props: {
                  value: this.$parent.tabs.tabList[index].categoryName,
                  placeholder: '请输入名称'
                },
                on: {
                  input: (val) => {
                    this.categoryName = val;
                  }
                }
              })
            ])
          },
          onOk: () => {
            this.$api.recordTemplateInterface.updateRecordTemplateCategory({
              recordTemplateCategoryId: this.$parent.tabs.tabList[index].categoryId,
              recordTemplateCategoryName: this.categoryName
            }).then(res => {
              if (res.data.success) {
                this.$Message.info('修改成功');
                setTimeout(() => {
                  this.$parent.listTab()
                }, 500)
              } else {
                this.$Message.error(res.data.retMsg)
              }
            }).catch(err => {
              console.error(err)
            })
          },
          onCancel: () => {
            this.categoryName = '';
          }
        });
      },
      trashButton(index) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定删除？</p>',
          onOk: () => {
            this.$api.recordTemplateInterface.removeRecordTemplateCategory({
              recordTemplateCategoryId: this.$parent.tabs.tabList[index].categoryId,
              recordTemplateCategoryName: this.$parent.tabs.tabList[index].categoryName
            }).then(res => {
              if (res.data.success) {
                this.$Message.info('删除成功');
                this.$parent.listTab()
              } else {
                this.$Message.error(res.data.retMsg)
              }
            }).catch(err => {
              console.error(err)
            })
          }
        });
      },
      newGroupButton() {

      },
      deleteRow(index) {
        this.modal.newGroupModal.applyList.splice(index, 1)
      }
    }
  }
</script>
