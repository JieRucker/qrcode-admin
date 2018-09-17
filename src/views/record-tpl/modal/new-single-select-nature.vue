<style lang="scss">
  @include b(new-single-select-modal) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {
      @include b(l-list) {
        @include e(item) {
          margin-bottom: 10px;
        }
      }
    }
  }
</style>

<template>
  <Modal v-model="modal.newSingleSelectModal.show" width="400" class="new-single-select-modal" @on-ok="saveSelectModal">
    <p slot="header" class="header">
      <span class="header--title">{{modal.newSingleSelectModal.selectType === 0 ? '多项选择' : '单项选择'}}</span>
    </p>
    <div class="body">
      <ul class="l-list">
        <draggable v-model="modal.newSingleSelectModal.selectList" @update="datadragEnd">
          <li class="l-list__item" v-for="(item,index) in modal.newSingleSelectModal.selectList">
            <Input v-model="item.value" class="l-list__item--name" placeholder="请输入选项名称">
            <span slot="prepend"><Checkbox v-model="item.defaultSelected"
                                           @click.native="changeOnSelect(index)">默认选中</Checkbox></span>
            <Button slot="append" icon="close" @click.native="deleteRow(index)"></Button>
            </Input>
          </li>
        </draggable>
        <li class="l-list__item">
          <Button type="ghost" @click="handleLiAdd">
            <Icon type="plus-round"></Icon>&nbsp;添加选项
          </Button>
        </li>
      </ul>
    </div>
  </Modal>
</template>

<script>
  import draggable from 'vuedraggable';

  export default {
    name: "new-single-select-nature",
    components: {
      draggable
    },
    data() {
      return {
        modal: {
          newSingleSelectModal: {
            index: 0,
            childIndex: 0,
            selectType: 0,//选中类型0 多选；1 单选
            show: false,
            selectList: [
              /*{
                value: '',
                sortId: 0,
                defaultSelected: false,
              }*/
            ]
          }
        }
      }
    },
    methods: {
      datadragEnd(evt) {
        let list = this.modal.newSingleSelectModal.selectList;
        for (let i = 0, len = list.length; i < len; i++) {
          list[i].sortId = i;
        }
      },
      saveSelectModal() {
        switch (this.modal.newSingleSelectModal.selectType) {
          case 0:
            this.$parent.setCfg('checkbox', this.modal.newSingleSelectModal.selectList, this.modal.newSingleSelectModal.index, this.modal.newSingleSelectModal.childIndex);
            break;
          case 1:
            this.$parent.setCfg('radio', this.modal.newSingleSelectModal.selectList, this.modal.newSingleSelectModal.index, this.modal.newSingleSelectModal.childIndex);
            break;
          case 2:
            this.$parent.setResultCfg('radio', this.modal.newSingleSelectModal.selectList);
            break;
        }
      },
      changeOnSelect(index) {
        switch (this.modal.newSingleSelectModal.selectType) {
          case 1:
            let list = this.modal.newSingleSelectModal.selectList;
            list.forEach(m => {
              m.defaultSelected = false;
            });
            this.modal.newSingleSelectModal.selectList[index].defaultSelected = true;
            break;
          case 3:
            let list1 = this.modal.newSingleSelectModal.selectList;
            list1.forEach(m => {
              m.defaultSelected = false;
            });
            this.modal.newSingleSelectModal.selectList[index].defaultSelected = true;
            break;
        }
      },
      deleteRow(index) {
        this.modal.newSingleSelectModal.selectList.splice(index, 1);
      },
      handleLiAdd() {
        console.log(this.modal.newSingleSelectModal.selectList)
        this.modal.newSingleSelectModal.selectList.push({
          value: '',
          sortId: this.modal.newSingleSelectModal.selectList.length,
          defaultSelected: false,
        })
      }
    }
  }
</script>
