<style lang="scss">
  @include b(new-state-modal) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }

    @include b(body) {
      @include e(form) {
        @include b(l-list) {
          @include e(item) {
            margin-bottom: 10px;
            @include b(content) {
              @include b(l-list) {
                @include e(li) {
                  float: left;
                  margin-right: 10px;
                  cursor: pointer;
                  &:last-child {
                    margin-right: 0;
                  }
                  @include m(icon) {
                    margin-right: 3px;
                    padding: 4px;
                    height: 18px;
                    width: 19px;
                    border-radius: 50px;
                    &.selected {
                      background-color: #ddd;
                    }
                  }
                }
              }
            }
            .ivu-input-group-append {
              padding: 0;
              background: none;
              button {
                margin: 0;
              }
            }
            @include m(name) {
              input {
                padding: 18px 7px;
                border-bottom-left-radius: 0 !important;
                border-top-left-radius: 0 !important;
              }
            }
            @include m(tag) {
              display: block;
              width: 77px;
              border-right: 0 !important;
              margin: 1px 0 0 0;
              height: 38px;
              line-height: 38px;
              border-bottom-right-radius: 0 !important;
              border-top-right-radius: 0 !important;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div>
    <Modal ref="modal" v-model="modal.newStateModal.show" width="600" :mask-closable="false" class="new-state-modal">
      <p slot="header" class="header">
        <span class="header--title" v-if="modal.newStateModal.modalType === 0">新增状态模板</span>
        <span class="header--title" v-if="modal.newStateModal.modalType === 1">编辑状态模板</span>
      </p>
      <div class="body">
        <div class="body__form">
          <Form :model="modal.newStateModal" label-position="left">
            <FormItem label="状态模板名称：" :label-width="110">
              <Input v-model="modal.newStateModal.recordStateName" placeholder="请输入" style="width: 200px"></Input>
            </FormItem>
            <FormItem label="添加状态：" :label-width="110">
              <ul class="l-list">
                <li class="l-list__item" v-for="(item,index) in modal.newStateModal.stateList" style="display: flex">

                  <Poptip placement="bottom" width="400" ref="tagPoptip">
                    <Tag type="dot" :color="item.color === 0 ?
                                'green' : item.color === 1 ?
                                'red' : item.color === 2 ?
                                'yellow' : item.color === 3 ?
                                'orange' : item.color === 4 ?
                                'blue' : item.color === 5 ?
                                'purple' : ''" class="l-list__item--tag" @click.native="showPoptip(index)">
                      {{item.color === 0 ? '正常' : item.color === 1 ? '异常' : item.color === 2 ? '警示' : item.color === 3 ?
                      '其他' : item.color === 4 ? '其他' : item.color === 5 ? '其他' : ''}}
                    </Tag>
                    <div class="content" slot="content">
                      <ul class="l-list">
                        <li class="l-list__li" v-for="(color,colorIndex) in modal.newStateModal.colorList"
                            @click.stop="changeColor(index,colorIndex)">
                          <Icon type="record"
                                class="l-list__li--icon"
                                :style="[{color:color.color === 0 ?
                                'green' : color.color === 1 ?
                                'red' : color.color === 2 ?
                                'yellow' : color.color === 3 ?
                                'orange' : color.color === 4 ?
                                'blue' : color.color === 5 ?
                                'purple' : ''}]">
                          </Icon>
                          {{color.label}}
                        </li>
                      </ul>
                    </div>
                  </Poptip>
                  <Input v-model="item.itemName" class="l-list__item--name" placeholder="请填写状态名称" style="width: 380px">
                  <Button slot="append" icon="close" @click.native="deleteRow(index)"></Button>
                  </Input>
                </li>
                <Button type="primary" @click="newStateButton">
                  <Icon type="plus-round"></Icon>&nbsp;添加状态
                </Button>
              </ul>
            </FormItem>
          </Form>
        </div>
      </div>

      <div slot="footer">
        <Button type="text" size="large" @click.native="cancel">取消</Button>
        <Button type="primary" size="large" @click.native="saveStateModal">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "new-state-nature",
    data() {
      return {
        modal: {
          newStateModal: {
            show: false,
            modalType: 0,
            recordStateId: '',
            recordStateName: '',
            colorList: [
              {
                label: '正常',
                color: 0
              },
              {
                label: '异常',
                color: 1
              },
              {
                label: '警示',
                color: 2
              },
              {
                label: '其他',
                color: 3
              },
              {
                label: '其他',
                color: 4
              },
              {
                label: '其他',
                color: 5
              }
            ],
            stateList: [
              {
                itemName: '',
                color: 0
              },
              {
                itemName: '',
                color: 1
              },
              {
                itemName: '',
                color: 2
              }
            ]
          }
        }
      }
    },
    methods: {
      saveStateModal() {
        let modalType = this.modal.newStateModal.modalType;
        let httpUrl = null;
        let httpParams = null;

        if (this.$Global.isBlank(this.modal.newStateModal.recordStateName)) {
          return this.$Message.info('状态组名称不能为空')
        }

        const isNullState = () => {
          let flag = false;
          [...this.modal.newStateModal.stateList].forEach(m => {
            if (this.$Global.isBlank(m.itemName)) {
              flag = true;
            }
          });
          return flag;
        };

        if (isNullState()) {
          return this.$Message.info('状态名称不能为空')
        }

        switch (modalType) {
          case 0:
            httpUrl = 'saveRecordStateTemplate';
            httpParams = {
              recordStateJson: (() => {
                return JSON.stringify(this.modal.newStateModal.stateList)
              })(),
              recordStateName: this.modal.newStateModal.recordStateName
            };
            break;
          case 1:
            httpUrl = 'updateRecordStateTemplate';
            httpParams = {
              recordStateId: this.modal.newStateModal.recordStateId,
              recordStateJson: (() => {
                return JSON.stringify(this.modal.newStateModal.stateList)
              })(),
              recordStateName: this.modal.newStateModal.recordStateName
            };
            break;
        }
        this.$api.recordStateInterface[`${httpUrl}`](httpParams).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
            this.$parent._getRecordStateList();
            this.cancel();
          }
        }).catch(err => {
          console.error(err)
        })
      },
      showPoptip(index) {
        this.$refs.tagPoptip.forEach(m => {
          m.handleClose();
        });
        this.$refs.tagPoptip[index].handleClick();
        window.poptip = this.$refs.tagPoptip
      },
      changeColor(index, colorIndex) {
        this.modal.newStateModal.stateList[index].color = this.modal.newStateModal.colorList[colorIndex].color;
        this.modal.newStateModal.stateList[index].label = this.modal.newStateModal.colorList[colorIndex].label;
        this.$refs.tagPoptip[index].handleClose();
      },
      newSingleSelectModal() {
        this.$refs.newSingleSelectNature.modal.newSingleSelectModal.show = true;
      },
      deleteRow(index) {
        this.modal.newStateModal.stateList.splice(index, 1);
      },
      newStateButton() {
        this.modal.newStateModal.stateList.push({
          itemName: '',
          color: 0
        })
      },
      cancel() {
        this.$refs.modal.cancel()
      }
    }
  }
</script>
