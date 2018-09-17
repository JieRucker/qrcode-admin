<style lang="scss">
  @include b(interact-preview) {
    @include b(form) {
      @include e(mt10) {
        margin-top: 10px;
      }
      @include e(mb5) {
        margin-bottom: 5px;
        display: block;
      }
      @include e(mt5) {
        margin-top: 5px;
        display: block;
      }
      @include b(red) {
        color: #f00;
      }
    }
    @include b(footer) {
      margin-top: 10px;
    }
    @include b(checkbox-group) {
      label {
        display: block;
        margin-bottom: 5px;
      }
    }
  }
</style>

<template>
  <div class="interact-preview">
    <div v-if="!showAdvance">
      <div class="form">
        <div class="form__title form__mt10" v-for="item in initial.moduleInteractInfoList">
          <div v-if="item.moduleInteractInfoCfg.recordType === 0">
            <p class="form__mb5">
              {{item.moduleInteractInfoCfg.recordTitle}}
              <span v-if="item.moduleInteractInfoCfg.nullable" class="red">*</span></p>
            <Input style="width: 100%" v-model="item.moduleInteractInfoResult.textResult"></Input>
            <p class="form__mt5">{{item.moduleInteractInfoCfg.annotation}}</p>
          </div>
          <div v-if="item.moduleInteractInfoCfg.recordType === 1">
            <p class="form__mb5">
              {{item.moduleInteractInfoCfg.recordTitle}}
              <span v-if="item.moduleInteractInfoCfg.nullable" class="red">*</span></p>
            <Input type="textarea" :rows="4" v-model="item.moduleInteractInfoResult.textareaResult"></Input>
            <p class="form__mt5">{{item.moduleInteractInfoCfg.annotation}}</p>
          </div>
          <div v-if="item.moduleInteractInfoCfg.recordType === 2">
            <p class="form__mb5">
              {{item.moduleInteractInfoCfg.recordTitle}}
              <span v-if="item.moduleInteractInfoCfg.nullable" class="red">*</span></p>
            <CheckboxGroup vertical>
              <Checkbox v-model="checkbox.defaultSelected" v-for="(checkbox,checkboxIndex) in item.moduleInteractInfoCfg.checkBoxList" :key="checkboxIndex">
                {{checkbox.value}}
              </Checkbox>
            </CheckboxGroup>
            <p class="form__mt5">{{item.moduleInteractInfoCfg.annotation}}</p>
          </div>
          <div v-if="item.moduleInteractInfoCfg.recordType === 3">
            <p class="form__mb5">
              {{item.moduleInteractInfoCfg.recordTitle}}
              <span v-if="item.moduleInteractInfoCfg.nullable" class="red">*</span></p>
            <RadioGroup v-model="item.moduleInteractInfoResult.radioBoxResult.value">
              <Radio :label="radio.value"
                     v-for="(radio,radioIndex) in item.moduleInteractInfoCfg.radioBoxList" :key="radioIndex">
              </Radio>
            </RadioGroup>
            <p class="form__mt5">{{item.moduleInteractInfoCfg.annotation}}</p>
          </div>
          <div v-if="item.moduleInteractInfoCfg.recordType === 4">
            <p class="form__mb5">
              {{item.moduleInteractInfoCfg.recordTitle}}
              <span v-if="item.moduleInteractInfoCfg.nullable" class="red">*</span></p>
            <Select style="width:150px" v-model="item.moduleInteractInfoResult.singleSelectBoxResult.value">
              <Option v-for="select in item.moduleInteractInfoCfg.singleSelectBox" :value="select.value"
                      :key="select.value">{{select.value}}
              </Option>
            </Select>
            <p class="form__mt5">{{item.moduleInteractInfoCfg.annotation}}</p>
          </div>
          <div v-if="item.moduleInteractInfoCfg.recordType === 5">
            <p class="form__mb5 form__mt5">{{item.moduleInteractInfoCfg.annotation}}</p>
          </div>
          <div v-if="item.moduleInteractInfoCfg.recordType === 6">
            <p class="form__mb5">
              {{item.moduleInteractInfoCfg.recordTitle}}
              <span v-if="item.moduleInteractInfoCfg.nullable" class="red">*</span></p>
            <Input style="width: 100%" v-model="item.moduleInteractInfoResult.phoneNumResult"></Input>
            <p class="form__mt5">{{item.moduleInteractInfoCfg.annotation}}</p>
          </div>

        </div>
      </div>
      <div class="footer">
        <Button type="primary" @click="submit">提交</Button>
        <Button @click="returnBack({type:0})">返回</Button>
      </div>
    </div>
    <div v-else>
      <div v-if="initial.mapType === 0">
        <RadioGroup v-model="initial.radioBoxResult.value" vertical>
          <Radio :label="map.value" v-for="(map,mapIndex) in initial.mapList" :key="mapIndex">
            {{map.name}}，{{map.value}}
          </Radio>
        </RadioGroup>
      </div>
      <div v-if="initial.mapType === 1">
        <CheckboxGroup class="checkbox-group">
          <Checkbox v-model="map.defaultSelected" v-for="(map,mapIndex) in initial.mapList" :key="mapIndex">
            {{map.name}}，{{map.value}}
          </Checkbox>
        </CheckboxGroup>
      </div>
      <div class="footer">
        <Button type="primary" @click="submitResult">确定</Button>
        <Button @click="returnBack({type:1})">返回</Button>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "interact-preview",
    data() {
      return {
        initial: new Object(null),
        showAdvance: false
      }
    },
    mounted() {
      this.$api.qrcodeInterface.getModule({
        moduleId: this.$route.query.moduleId
      }).then(res => {
        res = res.data;
        if (res.success) {
          this.block = res.data;
          new ToolFunctor(this)._get({...res.data});
        }
      }).catch(err => console.error(err));
    },
    methods: {
      /**
       * 提交表单
       */
      submit() {
        let list = [...this.initial.moduleInteractInfoList];
        for (let i = 0; i < list.length; i++) {
          let m = list[i];
          let result = m.moduleInteractInfoResult;
          let cfg = m.moduleInteractInfoCfg;

          switch (cfg.recordType) {
            case 0:
              if (cfg.nullable && this.$Global.isBlank(result.textResult)) {
                return this.$Message.info(`${cfg.recordTitle}不能为空`)
              }
              break;
            case 1:
              if (cfg.nullable && this.$Global.isBlank(result.textareaResult)) {
                return this.$Message.info(`${cfg.recordTitle}不能为空`)
              }
              break;
            case 2:
              let a = [];
              [...m.moduleInteractInfoCfg.checkBoxList].forEach(c => {
                if (c.defaultSelected) {
                  a.push({
                    value: c.value
                  })
                }
              });
              if (cfg.nullable && !a.length) {
                return this.$Message.info(`${cfg.recordTitle}不能为空`)
              }
              break;
            case 3:
              if (cfg.nullable && this.$Global.isBlank(result.radioBoxResult.value)) {
                return this.$Message.info(`${cfg.recordTitle}不能为空`)
              }
              break;
            case 4:
              if (cfg.nullable && this.$Global.isBlank(result.singleSelectBoxResult.value)) {
                return this.$Message.info(`${cfg.recordTitle}不能为空`)
              }
              break;
            case 5:
              break;
            case 6:
              if (cfg.nullable && this.$Global.isBlank(result.phoneNumResult)) {
                return this.$Message.info(`${cfg.recordTitle}不能为空`)
              }
              if (!this.$Global.isPhoneAvailable(result.phoneNumResult)) {
                return this.$Message.info(`${cfg.recordTitle}输入不正确`)
              }
              break;
          }
        }

        let param = new ToolFunctor(this)._set();

        console.log(param);
        this.showAdvance = true;
        /*this.$api.qrcodeInterface.updateModule(param).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
          }
        }).catch(err => console.error(err))*/
      },
      /**
       * 保存预览问卷调查
       * @returns {*}
       */
      submitResult() {
        switch (this.initial.mapType) {
          case 0:
            if (this.$Global.isBlank(this.initial.radioBoxResult.value)) {
              return this.$Message.info('请选择一项提交')
            }
            break;
          case 1:
            let a = [];
            [...this.initial.mapList].forEach(c => {
              if (c.defaultSelected) {
                a.push({
                  value: c.value
                })
              }
            });

            if (!a.length) {
              return this.$Message.info('请选择一项提交')
            }
            break;
        }
        let param = new ToolFunctor(this)._set();

        console.log(param);
      },
      returnBack(param) {
        switch (param.type) {
          case 0:
            this.$router.go(-1);
            break;
          case 1:
            this.showAdvance = false;
            break;
        }
      }
    }
  }

  class ToolFunctor {
    constructor(tis) {
      if (!tis) {
        throw new Error('[SKETCHPAD]: Missing parameters (tis)');
      }

      this.tis = typeof(tis) !== 'undefined' ? tis : null;
    }

    _get(res) {
      let target = new Object(null);

      target.moduleInteractInfoList = res.moduleObject ? (() => {
        let a = [];
        res.moduleObject.moduleInteractInfoList.forEach(m => {
          let cfg = m.moduleInteractInfoCfg;
          switch (cfg.recordType) {
            case 0:
              m['moduleInteractInfoResult'] = {textResult: ''};
              break;
            case 1:
              m['moduleInteractInfoResult'] = {textareaResult: ''};
              break;
            case 2:
              m['moduleInteractInfoResult'] = {checkBoxResultList: []};
              break;
            case 3:
              m['moduleInteractInfoResult'] = {radioBoxResult: {value: ''}};
              break;
            case 4:
              m['moduleInteractInfoResult'] = {singleSelectBoxResult: {value: ''}};
              break;
            case 6:
              m['moduleInteractInfoResult'] = {phoneNumResult: ''};
              break;
          }
          a.push(m)
        });
        return a;
      })() : [];
      // 启用名额限制 false 不启用 true 启用
      target.isOpenUserSubmitCountLimit = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.isOpenUserSubmitCountLimit : false;
      // 用户名额
      target.userSubmitCount = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.userSubmitCount : '';
      // 用户数据提交成功的提示信息成功
      target.userSubmitSuccessHint = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.userSubmitSuccessHint : '';
      // 是否选中用户数据提交成功后触发选择项
      target.isOpenUserSubmitSuccessSelItem = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.isOpenUserSubmitSuccessSelItem : false;
      target.mapType = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.mapType : 0; // 0：单选 1：多选
      target.mapList = res.moduleObject ? (() => {
        let a = [];
        [...res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.mapList].forEach(m => {
          a.push({
            name: m.name,
            value: m.value,
            sortId: m.sortId,
            defaultSelected: false
          })
        });
        return a;
      })() : [];
      target.moduleDesc = res.moduleObject ? res.moduleObject.moduleDesc : ''; // 模块描述
      target.radioBoxResult = {value: ''}; // 触发选择项（单选）

      return this.tis.initial = target;
    }

    _set() {
      let target = new Object(null);
      target.isFold = this.tis.block.isFold;
      target.isUsed = this.tis.block.isUsed;
      target.hasNew = true;
      target.moduleId = this.tis.block.moduleId; // 模块编号
      target.moduleTitle = this.tis.block.moduleTitle;
      target.moduleType = this.tis.block.moduleType;
      target.sortId = this.tis.block.sortId;
      target.templateId = this.tis.$route.query.templateId;
      target.uploadId = '';
      target.moduleVOJson = (() => {
        let options;
        options = {
          moduleId: this.tis.block.moduleId,
          moduleTitle: this.tis.block.moduleTitle,
          moduleType: this.tis.block.moduleType,
          templateId: this.tis.$route.query.templateId,
          isFold: this.tis.block.isFold,
          sortId: this.tis.block.sortId,
          isUsed: this.tis.block.isUsed,
          hasNew: true,
          moduleObject: {
            moduleInteractInfoList: (() => {
              let list = [...this.tis.initial.moduleInteractInfoList];
              list.forEach((m, key) => {
                let cfg = m.moduleInteractInfoCfg;
                switch (cfg.recordType) {
                  case 2:
                    m.moduleInteractInfoResult.checkBoxResultList = (() => {
                      let a = [];
                      [...m.moduleInteractInfoCfg.checkBoxList].forEach(c => {
                        if (c.defaultSelected) {
                          a.push({
                            value: c.value
                          })
                        }
                      });
                      return a;
                    })();
                    break;
                }
              });

              return list;
            })(),
            moduleInteractInfoUserSubmitSuccessCfg: {
              isOpenUserSubmitCountLimit: this.tis.initial.isOpenUserSubmitCountLimit, // 启用名额限制 false 不启用 true 启用
              userSubmitCount: this.tis.initial.userSubmitCount, // 用户名额
              userSubmitSuccessHint: this.tis.initial.userSubmitSuccessHint,// 用户数据提交成功的提示信息成功
              isOpenUserSubmitSuccessSelItem: this.tis.initial.isOpenUserSubmitSuccessSelItem, // 是否选中用户数据提交成功后触发选择项;
              mapType: this.tis.initial.mapType, // 0 单选 1 多选 用户数据提交成功后触发选择项
              mapList: this.tis.initial.mapList
            },
            moduleInmteractInfoUserSubmitSuccessResult: (() => {
              let a = Object.create({});
              switch (this.tis.initial.mapType) {
                case 0:
                  a.radioBoxResult = this.tis.initial.radioBoxResult;
                  break;
                case 1:
                  a.checkBoxResultList = (() => {
                    let a = [];
                    [...this.tis.initial.mapList].forEach(c => {
                      if (c.defaultSelected) {
                        a.push({
                          value: c.value
                        })
                      }
                    });
                    return a;
                  })();
                  break;
              }

              return a;
            })()
            // moduleDesc: this.tis.initial.moduleDesc
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>
