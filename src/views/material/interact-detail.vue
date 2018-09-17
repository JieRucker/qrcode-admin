<style lang="scss">
  @include b(interact-detail) {
    @include b(senior) {
      @include m(title) {
        padding: 10px;
        background-color: #fff;
        cursor: pointer;
      }

      @include b(card) {
        width: 100%;
        @include e(mt10) {
          margin-top: 10px;
        }
        @include e(list) {
          border: 1px solid #ddd;
          @include b(l-list) {
            @include e(item) {
              padding: 10px;
              border-bottom: 1px solid #ddd;
              display: flex;
              justify-content: space-between;
              cursor: pointer;
              @include m(icon) {
                margin-left: 10px;
              }
              @include m(edit) {
                font-size: 16px;
              }
              @include m(trash) {
                font-size: 16px;
              }
              &:last-child {
                border-bottom: 0;
              }
            }
          }
        }
      }
    }
    @include b(footer) {
      margin-top: 10px;
    }
  }
</style>

<template>
  <div class="interact-detail">
    <div style="margin-bottom: 10px;display: flex;justify-content: flex-end;">
      <Button type="primary" @click="handleAddRow">增加一行</Button>
    </div>
    <Table :columns="table.header" :data="table.body" ref="table" :disabled-hover="true"></Table>
    <div class="senior">
      <p class="senior--title">高级选项
        <Icon type="chevron-right" style="margin-left: 10px"></Icon>
      </p>
      <Card class="card">
        <div class="card__title">
          启用名额限制：
          <Checkbox v-model="initial.isOpenUserSubmitCountLimit">限制</Checkbox>
          <Input style="width: 150px" v-model="initial.userSubmitCount"></Input>&nbsp;个名额（<span style="color: #f00">不打勾表示不限制名额</span>）
        </div>
        <div class="card__textarea card__mt10">
          用户数据提交成功的提示信息(不填写则使用系统默认提示信息)
          <Input type="textarea" :rows="4" style="display: block;margin-top: 10px"
                 v-model="initial.userSubmitSuccessHint"></Input>
        </div>
        <div class="card__checkbox card__mt10" style="">
          <Checkbox v-model="initial.isOpenUserSubmitSuccessSelItem">用户数据提交成功后触发选择项</Checkbox>
        </div>
        <div v-if="initial.isOpenUserSubmitSuccessSelItem">
          <div class="card__mt10">
            <RadioGroup v-model="initial.mapType">
              <Radio :label="item.key" v-for="(item,index) in mapTypeList" :key="index">{{item.value}}</Radio>
            </RadioGroup>
          </div>
          <div class="card__mt10">
            键名&nbsp;<Input style="width: 150px" v-model="map.name"></Input>&nbsp;如：A,B,C,D 或 1,2,3,4
          </div>
          <div class="card__mt10">
            内容&nbsp;<Input style="width: 250px" v-model="map.value"></Input>
          </div>
          <div class="card__mt10">
            <Button type="primary" @click="onAdd">添加</Button>
          </div>
          <div class="card__list card__mt10">
            <ul class="l-list">
              <li class="l-list__item" v-for="(item,index) in initial.mapList">
                <p>{{item.name}}，{{item.value}}</p>
                <p>
                  <Icon type="edit" class="l-list__item--icon l-list__item--edit" @click.native="onEdit(index)"></Icon>
                  <Icon type="trash-a" class="l-list__item--icon l-list__item--trash"
                        @click.native="onTrash(index)"></Icon>
                </p>
              </li>
              <li class="l-list__item" v-if="initial.mapList && !initial.mapList.length">
                <p>请先添加选项</p>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
    <div class="footer">
      <Button type="primary" @click="preview">预览表单</Button>
      <Button @click="saveInteract">保存</Button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "interact-detail",
    data() {
      return {
        block: null,
        initial: new Object(null),
        map: {
          name: '',
          value: ''
        },
        // 0 单选 1 多选 用户数据提交成功后触发选择项
        mapTypeList: [{
          key: 0,
          value: '单选'
        }, {
          key: 1,
          value: '多选'
        }],
        // 记录类型
        recordTypeList: [
          {
            label: '单行输入框',
            value: 0
          },
          {
            label: '多行输入框',
            value: 1,
          },
          {
            label: '多项选择',
            value: 2,
          },
          {
            label: '单项选择',
            value: 3,
          },
          {
            label: '下拉选择(单选)',
            value: 4,
          },
          {
            label: '文本提示',
            value: 5,
          },
          {
            label: '手机号码输入项',
            value: 6,
          }
        ],
        table: {
          header: [
            {
              title: '序号',
              key: 'sortId',
              width: 100,
              render: (h, params) => {
                return h('div', [
                  h('Span', params.index + 1)
                ])
              }
            },
            {
              title: '排序',
              key: 'sort',
              width: 100,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Icon', {
                    props: {
                      type: 'arrow-up-c'
                    },
                    nativeOn: {
                      click: (e) => {
                        this.table.body = this.$refs.table.rebuildData;
                        // arr数组，index当前元素下标，endIndex拖动到的位置下标
                        const sort = (() => {
                          return (arr, index, endIndex) => {
                            if (index > endIndex) {
                              arr.splice(endIndex, 0, arr[index]);
                              arr.splice(index + 1, 1);
                            } else {
                              arr.splice(endIndex + 1, 0, arr[index]);
                              arr.splice(index, 1);
                            }
                          }
                        })();

                        const formatSort = (() => {
                          return (list) => {
                            for (let i = 0, len = list.length; i < len; i++) {
                              list[i]['moduleInteractInfoCfg'].sortId = i;
                            }
                          }
                        })();

                        let list = this.table.body;
                        sort(list, params.index, params.index === 0 ? list.length - 1 : params.index - 1);
                        formatSort(list);
                      }
                    }
                  }),
                  h('Icon', {
                    props: {
                      type: 'arrow-down-c'
                    },
                    style: {
                      marginLeft: '5px'
                    },
                    nativeOn: {
                      click: (e) => {
                        this.table.body = this.$refs.table.rebuildData;
                        // arr数组，index当前元素下标，endIndex拖动到的位置下标
                        const sort = (() => {
                          return (arr, index, endIndex) => {
                            if (index > endIndex) {
                              arr.splice(endIndex, 0, arr[index]);
                              arr.splice(index + 1, 1);
                            } else {
                              arr.splice(endIndex + 1, 0, arr[index]);
                              arr.splice(index, 1);
                            }
                          }
                        })();

                        const formatSort = (() => {
                          return (list) => {
                            for (let i = 0, len = list.length; i < len; i++) {
                              list[i]['moduleInteractInfoCfg'].sortId = i;
                            }
                          }
                        })();

                        let list = this.table.body;
                        sort(list, params.index, params.index === list.length - 1 ? 0 : params.index + 1);
                        formatSort(list);
                      }
                    }
                  })
                ])
              }
            },
            {
              title: '类型',
              key: 'recordType',
              width: 250,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Select', {
                    props: {
                      placeholder: '请选择',
                      value: params.row.moduleInteractInfoCfg.recordType
                    },
                    style: {
                      width: '150px',
                      marginTop: '10px',
                      marginBottom: '5px'
                    }
                  }, this.recordTypeList.map((item) => {
                    return h('Option', {
                      props: {
                        value: item.value,
                        key: item.value
                      },
                      nativeOn: {
                        click: (e) => {
                          params.row.moduleInteractInfoCfg.recordType = e.target.__vue__.value;
                        }
                      }
                    }, item.label)
                  })),
                  h('div', [this.$slots.default, (() => {
                    if (params.row.moduleInteractInfoCfg.recordType === 2) {
                      return h('div', [
                        h('span', {
                          style: {
                            display: 'block',
                            marginBottom: '5px'
                          }
                        }, '请在下列输入框中填写选项内容：'),
                        h('div', params.row.moduleInteractInfoCfg.checkBoxList.map((item, key) => {
                          return h('div', [
                            h('Input', {
                              props: {
                                placeholder: '请输入标题',
                                value: item.value
                              },
                              style: {
                                width: '150px',
                                margin: '0 auto',
                                display: 'inline-block',
                                marginBottom: '10px'
                              },
                              on: {
                                input: (value) => {
                                  item.value = value;
                                }
                              }
                            }),
                            h('Icon', {
                              props: {
                                type: 'trash-a'
                              },
                              style: {
                                marginLeft: '10px',
                                fontSize: '16px',
                                cursor: 'pointer'
                              },
                              nativeOn: {
                                click: (e) => {
                                  params.row.moduleInteractInfoCfg.checkBoxList.splice(key, 1)
                                }
                              }
                            })
                          ])
                        })),
                        h('a', {
                          attrs: {
                            href: 'javascript:;'
                          },
                          style: {
                            display: 'block',
                            marginBottom: '5px'
                          },
                          on: {
                            click: (e) => {
                              params.row.moduleInteractInfoCfg.checkBoxList.push({
                                sortId: params.row.moduleInteractInfoCfg.checkBoxList.length,
                                value: '',
                                defaultSelected: false
                              })
                            }
                          }
                        }, '添加选项')
                      ])
                    } else if (params.row.moduleInteractInfoCfg.recordType === 3) {
                      return h('div', [
                        h('span', {
                          style: {
                            display: 'block',
                            marginBottom: '5px'
                          }
                        }, '请在下列输入框中填写选项内容：'),
                        h('div', params.row.moduleInteractInfoCfg.radioBoxList.map((item, key) => {
                          return h('div', [
                            h('Input', {
                              props: {
                                placeholder: '请输入标题',
                                value: item.value
                              },
                              style: {
                                width: '150px',
                                margin: '0 auto',
                                display: 'inline-block',
                                marginBottom: '10px'
                              },
                              on: {
                                input: (value) => {
                                  item.value = value;
                                }
                              }
                            }),
                            h('Icon', {
                              props: {
                                type: 'trash-a'
                              },
                              style: {
                                marginLeft: '10px',
                                fontSize: '16px',
                                cursor: 'pointer'
                              },
                              nativeOn: {
                                click: (e) => {
                                  params.row.moduleInteractInfoCfg.radioBoxList.splice(key, 1)
                                }
                              }
                            })
                          ])
                        })),
                        h('a', {
                          attrs: {
                            href: 'javascript:;'
                          },
                          style: {
                            display: 'block',
                            marginBottom: '5px'
                          },
                          on: {
                            click: (e) => {
                              params.row.moduleInteractInfoCfg.radioBoxList.push({
                                sortId: params.row.moduleInteractInfoCfg.radioBoxList.length,
                                value: '',
                                defaultSelected: false
                              })
                            }
                          }
                        }, '添加选项')
                      ])
                    } else if (params.row.moduleInteractInfoCfg.recordType === 4) {
                      return h('div', [
                        h('span', {
                          style: {
                            display: 'block',
                            marginBottom: '5px'
                          }
                        }, '请在下列输入框中填写选项内容：'),
                        h('div', params.row.moduleInteractInfoCfg.singleSelectBox.map((item) => {
                          return h('div', [
                            h('Input', {
                              props: {
                                placeholder: '请输入标题',
                                value: item.value
                              },
                              style: {
                                width: '150px',
                                margin: '0 auto',
                                display: 'inline-block',
                                marginBottom: '10px'
                              },
                              on: {
                                input: (value) => {
                                  item.value = value;
                                }
                              }
                            }),
                            h('Icon', {
                              props: {
                                type: 'trash-a'
                              },
                              style: {
                                marginLeft: '10px',
                                fontSize: '16px',
                                cursor: 'pointer'
                              },
                              nativeOn: {
                                click: (e) => {
                                  params.row.moduleInteractInfoCfg.singleSelectBox.splice(key, 1)
                                }
                              }
                            })
                          ])
                        })),
                        h('a', {
                          attrs: {
                            href: 'javascript:;'
                          },
                          style: {
                            display: 'block',
                            marginBottom: '5px'
                          },
                          on: {
                            click: (e) => {
                              params.row.moduleInteractInfoCfg.singleSelectBox.push({
                                sortId: params.row.moduleInteractInfoCfg.singleSelectBox.length,
                                value: '',
                                defaultSelected: false
                              })
                            }
                          }
                        }, '添加选项')
                      ])
                    }
                  })()])
                ])
              }
            },
            {
              title: '标题',
              key: 'recordTitle',
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Input', {
                    props: {
                      placeholder: '请输入标题',
                      value: params.row.moduleInteractInfoCfg.recordTitle
                    },
                    style: {
                      width: '150px'
                    },
                    on: {
                      input: (value) => {
                        params.row.moduleInteractInfoCfg.recordTitle = value;
                      }
                    }
                  }),
                  h('span')
                ])
              }
            },
            {
              title: '必填项',
              key: 'nullable',
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Checkbox', {
                    props: {
                      value: params.row.moduleInteractInfoCfg.nullable
                    },
                    nativeOn: {
                      click: (e) => {
                        params.row.moduleInteractInfoCfg.nullable = e.target.checked;
                      }
                    }
                  })
                ])
              }
            },
            /*{
              title: '唯一项',
              key: 'uniqueable',
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Checkbox', {
                    props: {
                      value: params.row.moduleInteractInfoCfg.uniqueable
                    },
                    nativeOn: {
                      click: (e) => {
                        params.row.moduleInteractInfoCfg.uniqueable = e.target.checked;
                      }
                    }
                  })
                ])
              }
            },*/
            {
              title: '注释',
              key: 'annotation',
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Input', {
                    props: {
                      placeholder: '请输入注释',
                      value: params.row.moduleInteractInfoCfg.annotation
                    },
                    style: {
                      width: '150px'
                    },
                    on: {
                      input: (value) => {
                        params.row.moduleInteractInfoCfg.annotation = value;
                      }
                    }
                  }),
                  h('span')
                ])
              }
            },
            {
              title: '删除',
              key: 'delete',
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.table.body = this.$refs.table.rebuildData;
                        this.table.body.splice(params.index, 1)
                      }
                    }
                  }, '删除')
                ])
              }
            },
          ],
          body: []
        }
      }
    },
    mounted() {
      this.$api.qrcodeInterface.getModule({
        moduleId: this.$route.query.moduleId
      }).then(res => {
        res = res.data;
        if (res.success) {
          this.block = res.data;
          this.table.body = res.data.moduleObject.moduleInteractInfoList;
          new ToolFunctor(this)._get({...res.data});
        }
      }).catch(err => console.error(err));
    },
    methods: {
      /**
       * 新增表单行
       */
      handleAddRow() {
        this.table.body = this.$refs.table.rebuildData;
        this.table.body.push({
          moduleInteractInfoCfg: {
            sortId: this.$refs.table.rebuildData.length,
            recordType: 0,
            recordTitle: '',
            nullable: false,
            uniqueable: false,
            annotation: '',
            checkBoxList: [
              {
                sortId: 0,
                value: '',
                defaultSelected: false
              }
            ],
            radioBoxList: [
              {
                sortId: 0,
                value: '',
                defaultSelected: false
              }
            ],
            singleSelectBox: [
              {
                sortId: 0,
                value: '',
                defaultSelected: false
              }
            ]
          }
        })
      },
      /**
       * 提交表单
       */
      saveInteract() {
        let param = new ToolFunctor(this)._set();

        console.log(param);
        this.$api.qrcodeInterface.updateModule(param).then(res => {
          if (res.data.success) {
            this.$Message.info('成功');
          }
        }).catch(err => console.error(err))
      },
      /**
       * 预览表单
       */
      preview() {
        this.$router.push({
          name: "interact-preview",
          query: {
            templateId: this.$route.query.templateId,
            moduleId: this.$route.query.moduleId
          }
        })
      },
      /**
       * 编辑键值对
       * @param index 索引
       */
      onEdit(index) {
        let map = this.initial.mapList[index];
        this.map.name = map.name;
        this.map.value = map.value;
      },
      /**
       * 删除键值对
       * @param index 索引
       */
      onTrash(index) {
        this.initial.mapList.splice(index, 1)
      },
      /**
       * 添加键值对
       * @returns {*}
       */
      onAdd() {
        if (this.$Global.isBlank(this.$Global.trim(this.map.name))) {
          return this.$Message.info('请输入键名')
        } else if (this.$Global.isBlank(this.$Global.trim(this.map.value))) {
          return this.$Message.info('请输入内容')
        }
        this.initial.mapList.push({
          sortId: this.initial.mapList.length,
          name: this.map.name,
          value: this.map.value
        })
      },
      /**
       * 列表排序
       * @param type
       * @param sortType
       * @param index
       * @param childIndex
       */
      sortChange(type, sortType, index, childIndex) {
        this.table.body = this.$refs.table.rebuildData;
        // arr数组，index当前元素下标，endIndex拖动到的位置下标
        const sort = (() => {
          return (arr, index, endIndex) => {
            if (index > endIndex) {
              arr.splice(endIndex, 0, arr[index]);
              arr.splice(index + 1, 1);
            } else {
              arr.splice(endIndex + 1, 0, arr[index]);
              arr.splice(index, 1);
            }
          }
        })();

        const formatSort = (() => {
          return (list) => {
            for (let i = 0, len = list.length; i < len; i++) {
              list[i][type === 'normal' ? 'normalRecordGroupInfoCfg' : 'checkRecordGroupInfoCfg'].sortId = i;
            }
          }
        })();

        switch (sortType) {
          case 'up':
            let list = this.table.body;
            sort(list, childIndex, childIndex === 0 ? list.length - 1 : childIndex - 1);
            formatSort(list);
            break;
          case 'down':
            let list1 = this.table.body;
            sort(list1, childIndex, childIndex === list1.length - 1 ? 0 : childIndex + 1);
            formatSort(list1);
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

      target.moduleInteractInfoList = res.moduleObject ? res.moduleObject.moduleInteractInfoList : [];
      // 启用名额限制 false 不启用 true 启用
      target.isOpenUserSubmitCountLimit = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.isOpenUserSubmitCountLimit : false;
      // 用户名额
      target.userSubmitCount = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.userSubmitCount : '';
      // 用户数据提交成功的提示信息成功
      target.userSubmitSuccessHint = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.userSubmitSuccessHint : '';
      // 是否选中用户数据提交成功后触发选择项;
      target.isOpenUserSubmitSuccessSelItem = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.isOpenUserSubmitSuccessSelItem : false;
      target.mapType = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.mapType : 0; // 0：单选 1：多选
      target.mapList = res.moduleObject ? res.moduleObject.moduleInteractInfoUserSubmitSuccessCfg.mapList : [];
      target.moduleDesc = res.moduleObject ? res.moduleObject.moduleDesc : ''; // 模块描述
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
              let a = [];
              const loop = (() => {
                return (obj, key, param) => {
                  let temp = Object.create({});
                  let DEFAULT = {
                    sortId: key,
                    recordType: obj.recordType,
                    recordTitle: obj.recordTitle,
                    nullable: obj.nullable,
                    uniqueable: obj.uniqueable,
                    annotation: obj.annotation,
                  };

                  temp['moduleInteractInfoCfg'] = Object.assign({}, DEFAULT, param);
                  return temp;
                }
              })();
              this.tis.$refs.table.rebuildData.forEach((m, key) => {
                let cfg = m.moduleInteractInfoCfg;
                switch (cfg.recordType) {
                  case 2:
                    a.push(loop(cfg, key, {
                      checkBoxList: cfg.checkBoxList
                    }));
                    break;
                  case 3:
                    a.push(loop(cfg, key, {
                      radioBoxList: cfg.radioBoxList
                    }));
                    break;
                  case 4:
                    a.push(loop(cfg, key, {
                      singleSelectBox: cfg.singleSelectBox
                    }));
                    break;
                  default:
                    a.push(loop(cfg, key, {}));
                }
              });

              return a;
            })(),
            moduleInteractInfoUserSubmitSuccessCfg: {
              isOpenUserSubmitCountLimit: this.tis.initial.isOpenUserSubmitCountLimit, // 启用名额限制 false 不启用 true 启用
              userSubmitCount: this.tis.initial.userSubmitCount, // 用户名额
              userSubmitSuccessHint: this.tis.initial.userSubmitSuccessHint,// 用户数据提交成功的提示信息成功
              isOpenUserSubmitSuccessSelItem: this.tis.initial.isOpenUserSubmitSuccessSelItem, // 是否选中用户数据提交成功后触发选择项;
              mapType: this.tis.initial.mapType, // 0 单选 1 多选 用户数据提交成功后触发选择项
              mapList: this.tis.initial.mapList
            },
            moduleDesc: this.tis.initial.moduleDesc
          }
        };

        return JSON.stringify(options)
      })();

      return target;
    }
  }
</script>
