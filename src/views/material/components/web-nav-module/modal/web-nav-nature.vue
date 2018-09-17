<style lang="scss">
  @include b(web-nav-nature) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }
    @include b(body) {

    }
  }
</style>

<template>
  <div>
    <Modal ref="modal" v-model="show" width="550" class="web-nav-nature"
           @on-visible-change="visibleChange">
      <p slot="header" class="header">
        <span class="header--title">设置模块导航内容</span>
      </p>
      <div class="body">
        <Form label-position="left">
          <FormItem label="名称：" :label-width="100">
            <Input v-model="initial.navigationName" style="width: 200px" placeholder="请输入名称"></Input>
          </FormItem>
          <FormItem label="选择图标：" :label-width="100">
            <Poptip title="选择图标" placement="bottom-start">
              <img :src="initial.icon && initial.icon.iconUrl"
                   style="width: 30px;height: 30px;vertical-align: middle;margin-right: 5px">
              <div class="icon" slot="content">
                <Tabs :value="0">
                  <TabPane :label="item.label" :name="item.type" v-for="(item,index) in iconTab" :key="index">
                    <ul class="l-list clearfix">
                      <li class="l-list__item" v-for="(child,childIndex) in item.list"
                          @click.stop="iconChange(index,childIndex)">
                        <img :src="child.iconUrl">
                      </li>
                    </ul>
                  </TabPane>
                </Tabs>
              </div>
            </Poptip>
            <span>或</span>
            <Button type="primary" @click="getUpload">上传图标</Button>
          </FormItem>
          <FormItem label="动作：" :label-width="100">
            <RadioGroup v-model="initial.actionType">
              <Radio :label="item.key" v-for="(item,index) in initial.actionTypeList" :key="index">{{item.value}}
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="链接：" :label-width="100" v-if="initial.actionType === 0">
            <Input v-model="initial.linkUrl" style="width: 200px" placeholder="请输入地址"></Input>
          </FormItem>
          <FormItem label="页面定位：" :label-width="100" v-if="initial.actionType === 1">
            <ul v-if="initial.selectPageNavList && initial.selectPageNavList.length">
              <li v-for="(item,index) in initial.selectPageNavList"
                  style="padding: 0 10px;background-color: #f8f8f8;">已选择:{{item.pageNavigationName}}
                <a href="javascript:;" @click="handleActiveType(1)">重新选择</a>
                <Icon type="close" @click.native="deleteIcon(1,index)"
                      style="float: right;padding: 10px 5px;cursor: pointer"></Icon>
              </li>
            </ul>
            <Button type="primary" v-else @click.native="handleActiveType(1)">选择定位</Button>
          </FormItem>
          <FormItem label="已有素材：" :label-width="100" v-if="initial.actionType === 2">
            <ul v-if="initial.selectMaterialList && initial.selectMaterialList.length">
              <li v-for="(item,index) in initial.selectMaterialList"
                  style="padding: 0 10px;background-color: #f8f8f8;">已选择素材名称:{{item.templateName}}
                <a href="javascript:;" @click="handleActiveType(2)">重新选择</a>
                <Icon type="close" @click.native="deleteIcon(2,index)"
                      style="float: right;padding: 10px 5px;cursor: pointer"></Icon>
              </li>
            </ul>
            <Button type="primary" v-else @click.native="handleActiveType(2)">选择素材</Button>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click.native="cancel">取消</Button>
        <Button type="primary" size="large" @click.native="saveWebNavNature">确定</Button>
      </div>
    </Modal>

    <div id="imgPicker" class="upload-target"></div>

    <loader :dataSourceList="getDataSourceList" :confirmfunc="confirmfunc"></loader>
  </div>
</template>

<script>
  import loader from '@/components/launch/loader.vue';

  export default {
    name: "web-nav-nature",
    components: {
      loader
    },
    props: {
      currentModal: String,
      navigationList: Array, // 数组对象
      navigationNative: Object // 单个对象集
    },
    data() {
      return {
        show: true,
        iconTab: [
          {
            type: 0,
            label: '图标一',
            list: [
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_Baidu.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_Firefox.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_Google.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_IE.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_jd.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_QQ.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_QQbrowser.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_suning.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_taobao.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_Tencent.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_TencentWeibo.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_Tmall.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_WeChat.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type1/type1_WeiBo.png'
              }
            ]
          },
          {
            type: 1,
            label: '图标二',
            list: [
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_address.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_build.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_camera.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_Character.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_click.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_computer.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_data.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_flight.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_gold.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_integral.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_letter.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_mobile.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_music.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_navigate.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_order.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_qq.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_recipient.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_safe.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_search.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_setup.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_shopping.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_soundrecord.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_trend.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_video.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_WeChat.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type2/type2_Wireless.png'
              }
            ]
          },
          {
            type: 2,
            label: '图标三',
            list: [
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_address.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_address_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_camera.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_camera_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_clock.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_clock_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_collection.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_collection_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_letter.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_letter_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_music.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_music_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_network.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_network_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_people.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_people_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_phone.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_phone_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_qq.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_qq_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_share.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_share_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_video.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_video_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_Wechat.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_Wechat_line.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_Weibo.png'
              },
              {
                iconUrl: 'http://qrcode-image-prod.youbim.cn/qrcode/common/navigation/type3/type3_Weibo_line.png'
              }
            ]
          }
        ],
        initial: new Object(null),
        uploadId: null,
        uploader: null, //上传对象
      }
    },
    computed: {
      getDataSourceList() {
        return this.$store.getters.getDataSourceList()
      }
    },
    mounted() {
      this.initUpload();
      new ToolFunctor(this)._get(this.navigationNative);
    },
    methods: {
      iconChange(index, childIndex) {
        this.initial.icon.iconUrl = this.iconTab[index].list[childIndex].iconUrl
      },
      /**
       * 修改维护模板回调函数callback
       */
      confirmfunc(value) {
        if (value.isPageNavigation) {
          this.$set(this.initial, 'selectPageNavList', new Array(value));
        } else {
          this.$set(this.initial, 'selectMaterialList', new Array(value));
        }
      },
      initUpload() {
        if (this.uploader) this.uploader.destroy();

        /* 初始化上传插件 */
        this.uploader = WebUploader.create({
          pick: {
            id: '#imgPicker',
            multiple: true
          },
          accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/gif,image/jpg,image/jpeg,image/bmp,image/png'
          },
          auto: true,
          compress: false, //不压缩
          chunked: true, //分块传输
          chunkSize: 1024 * 1024, //分块大小
          server: `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${this.uploadId}`,
          duplicate: true,
          fileSingleSizeLimit: 1024 * 1024 * 1024,
          fileNumLimit: 50, //最大上传数目1000
          fileSizeLimit: 1024 * 1024 * 1024 * 1024 //单次文件上传限制1024G
        });

        /* 向队列里加入一个文件 */
        this.uploader.on('fileQueued', (_file) => {
          _file.progress = 0;

          return this.uploader.makeThumb(_file, (err, src) => {
            console.log(_file)

            this.initial.icon = new Object({
              iconName: _file.name,
              iconUrl: src,
              bucketName: '',
              ossKey: '',
              fileSize: WebUploader.Base.formatSize(_file.size),
              id: '',
              fileId: _file.id
            });
          });
        });

        this.uploader.on('uploadFinished', (file, response) => {
          this.uploader.reset();
        });

        this.uploader.on('uploadError', (file, reason) => {
          this.$Message.info('上传失败', 5000);
          this.uploader.reset();
        });
        return this.uploader.on('error', (type) => {
          switch (type) {
            case 'F_EXCEED_SIZE':
              return this.$Message.info('文件大小超过限制');
            case 'Q_EXCEED_NUM_LIMIT':
              return this.$Message.info('文件数目超过限制');
            case 'Q_TYPE_DENIED':
              return this.$Message.info('文件类型不对');
          }
        });
      },
      getUpload() {
        if (!this.uploadId) {
          const promise = new Promise((resolve, reject) => {
            $.ajax({
              url: `${process.env.api.commonUrl}/common/createUploadId`,
              type: 'post',
              async: false
            }).done((res) => {
              res = JSON.parse(res);
              res.success ? resolve(res.data) : reject(res.retMsg);
            });
          });

          promise.then((resolve) => {
            this.uploader.options.server = `${process.env.api.commonUrl}/common/addPacksFile?uploadId=${resolve}`;
            this.uploadId = resolve;
            document.querySelector('#imgPicker .webuploader-element-invisible').click()
          }, (reject) => {
            this.$Message.error(reject);
          })
        } else {
          document.querySelector('#imgPicker .webuploader-element-invisible').click()
        }
      },
      /**
       * 显示弹窗
       * @param key:1 定位 key:2 素材
       */
      handleActiveType(key) {
        switch (key) {
          case 1:
            this.$store.dispatch('setDataSourceList', {
              compName: 'qLocationMdl',
              dataSource: {
                showModal: true,
                templateObj: {
                  pageNavigationId: this.initial.selectPageNavList.length && this.initial.selectPageNavList[0].pageNavigationId
                }
              }
            });
            break;
          case 2:
            this.$store.dispatch('setDataSourceList', {
              compName: 'mMaterialMdl',
              dataSource: {
                showModal: true,
                templateObj: {
                  templateId: this.initial.selectMaterialList.length && this.initial.selectMaterialList[0].templateId
                }
              }
            });
            break;
        }
      },
      /**
       * 删除选择的（定位或素材）
       * @param type：1 定位 type：2 素材
       * @param index 索引
       */
      deleteIcon(type, index) {
        switch (type) {
          case 1:
            this.initial.selectPageNavList.splice(index, 1);
            break;
          case 2:
            this.initial.selectMaterialList.splice(index, 1);
            break;
        }
      },
      saveWebNavNature() {
        let param = new ToolFunctor(this)._set();
        if (this.$Global.isBlank(param.navigationName)) {
          return this.$Message.info('请输入名称')
        }

        switch (this.initial.actionType) {
          case 0:
            if (this.$Global.isBlank(param.linkUrl)) {
              return this.$Message.info('请输入地址')
            }
            break;
          case 1:
            if (this.$Global.isBlank(param.pageNavigationId)) {
              return this.$Message.info('请选择定位')
            }
            break;
          case 2:
            if (this.$Global.isBlank(param.templateId)) {
              return this.$Message.info('请选择素材')
            }
            break;
        }


        console.log(param);

        switch (this.navigationNative.modalType) {
          case 0:
            this.navigationList.push(param);
            break;
          case 1:
            this.navigationList[this.navigationNative.currentIndex] = param;
            break
        }


        this.$emit('update:currentModal', this.$Global.setValue(''));
      },
      visibleChange() {
        this.$emit('update:currentModal', this.$Global.setValue(''));
      },
      cancel() {
        this.$refs.modal.cancel()
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

    equal(fn) {
      return (...args) => {
        return fn.apply(this, args);
      }
    }

    _get(res) {
      let target = new Object(null);

      target.navigationName = res.navigationName || '';
      target.icon = new Object(res.icon) || (() => {
        let a = ['iconName', 'iconUrl', 'bucketName', 'ossKey', 'fileSize', 'id'];
        let b = new Object(null);
        [...a].forEach((m, i) => {
          if (i === 1) (b[m] = 'https://static.clewm.net/static/images/module_title_icon/n/39_small_155713f.png');
          b[m] = '';
        });

        return b;
      })();
      target.actionTypeList = this._JSON().actionTypeList;

      // 0链接  1页面定位  2素材
      target.actionType = res.actionType || 0;
      // 模板编号 actionType为0值时
      target.linkUrl = res.linkUrl || '';
      // 页面定位 actionType为1值时 页面定位 的意思 就是点 可以立即定位到下面的某个位置，例如：它对应的是素材下的某个模块;维护模板下的巡检记录;图文模块;标题 总之任何一个moduleId
      target.selectPageNavList = (() => {
        let a = [];
        if (!this.tis.$Global.isBlank(res.pageNavigationId)) {
          a.push({
            pageNavigationName: res.pageNavigationName,
            pageNavigationId: res.pageNavigationId
          })
        }

        return a;
      })();

      // 模板编号 actionType为2值时
      target.selectMaterialList = (() => {
        let a = [];
        if (!this.tis.$Global.isBlank(res.templateId)) {
          a.push({
            templateName: res.templateName,
            templateId: res.templateId
          })
        }

        return a;
      })();

      return this.tis.initial = target;
    }

    _JSON() {
      let actionTypeList = [{
        key: 0,
        value: '链接',
        selected: true
      },
        {
          key: 1,
          value: '页面定位',
          selected: false
        },
        {
          key: 2,
          value: '素材',
          selected: false
        }];

      return {
        actionTypeList
      }
    }

    _set() {
      let target = new Object(null);
      target.navigationName = this.tis.initial.navigationName;
      target.icon = this.tis.initial.icon;
      target.actionType = this.tis.initial.actionType;
      target.linkUrl = this.tis.initial.linkUrl;
      target.pageNavigationId = this.tis.initial.selectPageNavList.length ? this.tis.initial.selectPageNavList[0].pageNavigationId : '';
      target.pageNavigationName = this.tis.initial.selectPageNavList.length ? this.tis.initial.selectPageNavList[0].pageNavigationName : '';
      target.templateId = this.tis.initial.selectMaterialList.length ? this.tis.initial.selectMaterialList[0].templateId : '';
      target.templateName = this.tis.initial.selectMaterialList.length ? this.tis.initial.selectMaterialList[0].templateName : '';
      return target;
    }
  }
</script>
