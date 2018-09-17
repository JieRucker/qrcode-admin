<style lang="scss">
  @include b(pic-select-modal) {
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
  <Modal v-model="modal.picSelectModal.show" width="400" class="pic-select-modal" @on-ok="savePicModal">
    <p slot="header" class="header">
      <span class="header--title">图片配置</span>
    </p>
    <div class="body">
      <ul class="l-list">
        <li class="l-list__item">
          <RadioGroup v-model="modal.picSelectModal.imageCfg.uploadType">
            <Radio :label="item.value" v-for="(item,index) in modal.picSelectModal.uploadTypeList" :key="index">
              <span>{{item.label}}</span>
            </Radio>
          </RadioGroup>
        </li>
        <li class="l-list__item">
          <span v-for="(item,index) in modal.picSelectModal.waterMarkList">
             <Checkbox v-model="item.selected">{{item.label}}</Checkbox>
          </span>
        </li>
      </ul>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: "new-single-select-nature",
    data() {
      return {
        modal: {
          picSelectModal: {
            show: false,
            index: 0,
            childIndex: 0,
            uploadTypeList: [
              {
                label: '拍照及相册上传',
                value: 0
              },
              {
                label: '只允许拍照上传',
                value: 1
              }
            ],
            waterMarkList: [
              {
                label: '文字水印',
                value: 0,
                selected: false
              },
              {
                label: '二维码水印',
                value: 1,
                selected: false
              }
            ],
            imageCfg: {
              uploadType: 0,//0拍照及相册上传　1只允许拍照
              waterMark: []  //图片水印　0文字水印　1二维码水印
            }
          }
        }
      }
    },
    methods: {
      recover() {
        let list = this.modal.picSelectModal.waterMarkList;
        let waterMark = this.modal.picSelectModal.imageCfg.waterMark;
        [].forEach.call(waterMark, m => {
          list.forEach(k => {
            k.selected = this.$Global.int2Bool(0);
            setTimeout(()=>{
              if (k.value === m) k.selected = this.$Global.int2Bool(1);
            },50)
          })
        })
      },
      savePicModal() {
        let list = this.modal.picSelectModal.waterMarkList;
        let waterMark = (() => {
          return (list) => {
            let arr = [];
            [].forEach.call(list, m => {
              if (m.selected) {
                arr.push(m.value)
              }
            });
            return arr
          }
        })();
        this.modal.picSelectModal.imageCfg.waterMark = waterMark(list);

        this.$parent.setCfg('pic',this.modal.picSelectModal.imageCfg, this.modal.picSelectModal.index, this.modal.picSelectModal.childIndex);
      }
    }
  }
</script>
