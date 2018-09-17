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
    <Modal v-model="modal.newStateModal.show" width="600" class="new-state-modal">
      <p slot="header" class="header">
        <span class="header--title">新增状态组</span>
      </p>
      <div class="body">
        <div class="body__form">
          <Form :model="modal.newStateModal" label-position="left">
            <FormItem label="状态组名称：" :label-width="110">
              <Input v-model="modal.newStateModal.groupName" placeholder="请输入" style="width: 200px"></Input>
            </FormItem>
            <FormItem label="添加状态：" :label-width="110">
              <ul class="l-list">
                <li class="l-list__item" v-for="(item,index) in modal.newStateModal.stateList" style="display: flex">

                  <Poptip placement="bottom" width="400" ref="tagPoptip">
                    <Tag type="dot" :color="item.color" class="l-list__item--tag" @click.native="showPoptip(index)">
                      {{item.label}}
                    </Tag>
                    <div class="content" slot="content">
                      <ul class="l-list">
                        <li class="l-list__li" v-for="(color,colorIndex) in item.colorList"
                            @click.stop="changeColor(index,colorIndex)">
                          <Icon type="record"
                                :class="color.selected ? 'l-list__li--icon selected' : 'l-list__li--icon'"
                                :style="[{color:color.color}]"></Icon>
                          {{color.label}}
                        </li>
                      </ul>
                    </div>
                  </Poptip>
                  <Input v-model="item.stateName" class="l-list__item--name" placeholder="请填写状态名称">
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
            type: 'custom',
            groupName: '',
            stateList: [
              {
                stateName: '',
                label: '正常',
                value: 0,
                color: 'green',
                colorList: [
                  {
                    label: '正常',
                    value: 0,
                    color: 'green',
                    selected: true
                  },
                  {
                    label: '异常',
                    value: 1,
                    color: 'red',
                    selected: false
                  },
                  {
                    label: '警示',
                    value: 2,
                    color: 'yellow',
                    selected: false
                  },
                  {
                    label: '其他',
                    value: 3,
                    color: 'orange',
                    selected: false
                  },
                  {
                    label: '其他',
                    value: 4,
                    color: 'blue',
                    selected: false
                  },
                  {
                    label: '其他',
                    value: 5,
                    color: 'purple',
                    selected: false
                  }
                ]
              },
              {
                stateName: '',
                label: '异常',
                value: 1,
                color: 'red',
                colorList: [
                  {
                    label: '正常',
                    value: 0,
                    color: 'green',
                    selected: true
                  },
                  {
                    label: '异常',
                    value: 1,
                    color: 'red',
                    selected: false
                  },
                  {
                    label: '警示',
                    value: 2,
                    color: 'yellow',
                    selected: false
                  },
                  {
                    label: '其他',
                    value: 3,
                    color: 'orange',
                    selected: false
                  },
                  {
                    label: '其他',
                    value: 4,
                    color: 'blue',
                    selected: false
                  },
                  {
                    label: '其他',
                    value: 5,
                    color: 'purple',
                    selected: false
                  }
                ]
              },
              {
                stateName: '',
                label: '警示',
                value: 2,
                color: 'yellow',
                colorList: [
                  {
                    label: '正常',
                    value: 0,
                    color: 'green',
                    selected: true
                  },
                  {
                    label: '异常',
                    value: 1,
                    color: 'red',
                    selected: false
                  },
                  {
                    label: '警示',
                    value: 2,
                    color: 'yellow',
                    selected: false
                  },
                  {
                    label: '其他',
                    value: 3,
                    color: 'orange',
                    selected: false
                  },
                  {
                    label: '其他',
                    value: 4,
                    color: 'blue',
                    selected: false
                  },
                  {
                    label: '其他',
                    value: 5,
                    color: 'purple',
                    selected: false
                  }
                ]
              }
            ]
          }
        }
      }
    },
    methods: {
      showPoptip(index) {
        this.$refs.tagPoptip.forEach(m => {
          m.handleClose();
        });
        this.$refs.tagPoptip[index].handleClick();
        window.poptip = this.$refs.tagPoptip
      },
      changeColor(index, colorIndex) {

        this.modal.newStateModal.stateList[index].colorList.forEach(m => {
          m.selected = false;
        });
        this.modal.newStateModal.stateList[index].colorList[colorIndex].selected = true;
        this.modal.newStateModal.stateList[index].color = this.modal.newStateModal.stateList[index].colorList[colorIndex].color;
        this.modal.newStateModal.stateList[index].label = this.modal.newStateModal.stateList[index].colorList[colorIndex].label;

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
          stateName: '',
          label: '正常',
          value: 0,
          color: 'green',
          colorList: [
            {
              label: '正常',
              value: 0,
              color: 'green',
              selected: true
            },
            {
              label: '异常',
              value: 1,
              color: 'red',
              selected: false
            },
            {
              label: '警示',
              value: 2,
              color: 'yellow',
              selected: false
            },
            {
              label: '其他',
              value: 3,
              color: 'orange',
              selected: false
            },
            {
              label: '其他',
              value: 4,
              color: 'blue',
              selected: false
            },
            {
              label: '其他',
              value: 5,
              color: 'purple',
              selected: false
            }
          ]
        })
      }
    }
  }
</script>
