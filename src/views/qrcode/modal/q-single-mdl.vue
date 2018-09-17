<style lang="scss">
  @include b(q-single-mdl) {
    @include b(header) {
      color: #333;
      text-align: left;
      @include m(title) {
        font-size: 16px;
      }
    }

    @include b(body) {
      text-align: center;
      @include e(nav) {
        margin: 10px auto;
        .l-list {
          @include e(item) {
            display: inline-block;
            margin-right: 15px;
            margin-bottom: 10px;
          }
        }
      }
      @include e(section) {
        margin-top: 10px;
        text-align: left;
        .l-list {
          @include e(item) {
            display: inline-block;
            margin-right: 15px;
            margin-bottom: 10px;
            cursor: pointer;
          }
          @include e(content) {
            display: flex;
          }
          @include e(img) {
            width: 70px;
            height: 70px;
          }
          @include e(detail) {
            text-align: left;
            margin-left: 15px;
            @include m(title) {
              font-size: 18px;
              color: rgba(0, 0, 0, 0.87);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            @include m(desc) {
              font-size: 12px;
              color: #666666;
              margin-top: 8px;
              height: 34px;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
          @include e(empty) {
            text-align: center;
            width: 280px;
            .ivu-card-body {
              padding: 10px 16px;
            }
            @include m(icon) {
              font-size: 40px;
              color: #999;
            }
            @include m(title) {
              font-size: 14px;
              color: #999;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <Modal ref="modal" v-model="showModal" width="950" class="q-single-mdl"
         @on-visible-change="onVisible">
    <p slot="header" class="header">
      <span class="header--title">选择场景新建</span>
    </p>
    <div class="body">
      <div class="body__nav">
        <ul class="l-list clearfix">
          <li class="l-list__item" v-for="(item,index) in sceneNavList" @click="toggleNav(index)">
            <Button :type="item.selected ? 'primary' : 'ghost'" size="large">{{item.label}}</Button>
          </li>
        </ul>
      </div>
      <div class="body__section">
        <ul class="l-list clearfix">
          <li class="l-list__item" v-for="(item,index) in sceneList">
            <Card style="width:280px;">
              <div class="l-list__content">
                <img class="l-list__img" :src="item.pic" alt="">
                <div class="l-list__detail">
                  <p class="l-list__detail--title">{{item.title}}</p>
                  <p class="l-list__detail--desc">{{item.desc}}</p>
                </div>
              </div>
            </Card>
          </li>
          <li class="l-list__item" @click="saveScene">
            <Card class="l-list__empty">
              <i class="iconfont icon-add l-list__empty--icon"></i>
              <p class="l-list__empty--title">空白模板</p>
            </Card>
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
  export default {
    name: "q-single-mdl",
    props: {
      autoClose: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        sceneNavList: [
          {
            label: '建筑施工',
            value: '001',
            selected: true,
            scenes: [
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/05c98c0787cf7af48734e2e5d4e7eec81525675828.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '塔吊设备巡检',
                desc: '设备型号等参数信息展示，在线填写巡检记录表'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/7cd5186e6e9068eccc8b7856df86361b1525676091.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '特种设备巡检',
                desc: '查看设备资料，在线填写巡检记录表，全面掌握设备动态'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/d89016fb4010284e49e3f1c31f104a601525676141.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '大型设备巡检',
                desc: '查看机械设备资料，在线填写巡检记录表，全面掌握设备动态'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/672995bea15df93791601fc594916f241525676181.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '劳务人员管理',
                desc: '人员实名信息展示，记录安全教育培训等动态信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/d9507bf4f113ad30f7da241c070df19e1525676220.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '临电安全管理',
                desc: '二维码记录，加强对临时用电的监督管理'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/ee0a4e86126f326cdaced754f5e584ae1525676315.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '试块材料送检',
                desc: '添加材料送检记录，形成可追溯的质量管理档案'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/ba29a4be0766e71e06e1b9f157ca8e7a1525676586.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '实测实量',
                desc: '现场添加测量数据，快速汇总数据，及时反馈异常'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/866730d3acd0c14995eed16d88df363a1525676939.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '安全技术交底',
                desc: '各类交底文件集合在二维码中直接显示。'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/f7ed62a2d4a81651efc8855172b875e71525676272.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '安全隐患排查',
                desc: '现场扫码记录安全检查结果，即时反馈安全隐患'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/32d3f6ccb78e73917ef8b9f84df91fc51525676437.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '物资进场管理',
                desc: '物资出入库管理，记录型号、数量等信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/335ab6cbed53c6d421e45e2bb4299e291525676839.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '项目信息概览',
                desc: '扫码即可了解工程概况、项目概览、项目历程等施工信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/17b8cbf070ca5099f0b6137dcdfb93471525829031.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '施工方案',
                desc: '展示施工方案资料，信息共享，无需翻阅纸质文档'
              },
            ]
          },
          {
            label: '轨道交通',
            value: '002',
            selected: false,
            scenes: [
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/05c98c0787cf7af48734e2e5d4e7eec81525675828.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '塔吊设备巡检',
                desc: '设备型号等参数信息展示，在线填写巡检记录表'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/7cd5186e6e9068eccc8b7856df86361b1525676091.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '特种设备巡检',
                desc: '查看设备资料，在线填写巡检记录表，全面掌握设备动态'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/672995bea15df93791601fc594916f241525676181.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '劳务人员管理',
                desc: '人员实名信息展示，记录安全教育培训等动态信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/d9507bf4f113ad30f7da241c070df19e1525676220.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '临电安全管理',
                desc: '二维码记录，加强对临时用电的监督管理'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/58f3c007efcec8804c6e8277a183a77b1525677805.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '盾构管片验收',
                desc: '扫码记录管片验收信息，质量管理可追溯'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/866730d3acd0c14995eed16d88df363a1525676939.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '安全技术交底',
                desc: '各类交底文件集合在二维码中直接显示。'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/335ab6cbed53c6d421e45e2bb4299e291525676839.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '项目信息概览',
                desc: '扫码即可了解工程概况、项目概览、项目历程等施工信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/17b8cbf070ca5099f0b6137dcdfb93471525829031.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '施工方案',
                desc: '展示施工方案资料，信息共享，无需翻阅纸质文档'
              }
            ]
          },
          {
            label: '房屋建筑',
            value: '003',
            selected: false,
            scenes: [
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/05c98c0787cf7af48734e2e5d4e7eec81525675828.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '塔吊设备巡检',
                desc: '设备型号等参数信息展示，在线填写巡检记录表'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/7cd5186e6e9068eccc8b7856df86361b1525676091.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '特种设备巡检',
                desc: '查看设备资料，在线填写巡检记录表，全面掌握设备动态'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/672995bea15df93791601fc594916f241525676181.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '劳务人员管理',
                desc: '人员实名信息展示，记录安全教育培训等动态信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/d9507bf4f113ad30f7da241c070df19e1525676220.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '临电安全管理',
                desc: '二维码记录，加强对临时用电的监督管理'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/ee0a4e86126f326cdaced754f5e584ae1525676315.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '试块材料送检',
                desc: '添加材料送检记录，形成可追溯的质量管理档案'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/ba29a4be0766e71e06e1b9f157ca8e7a1525676586.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '实测实量',
                desc: '现场添加测量数据，快速汇总数据，及时反馈异常'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/866730d3acd0c14995eed16d88df363a1525676939.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '安全技术交底',
                desc: '各类交底文件集合在二维码中直接显示。'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/f7ed62a2d4a81651efc8855172b875e71525676272.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '安全隐患排查',
                desc: '现场扫码记录安全检查结果，即时反馈安全隐患'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/32d3f6ccb78e73917ef8b9f84df91fc51525676437.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '物资进场管理',
                desc: '物资出入库管理，记录型号、数量等信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/335ab6cbed53c6d421e45e2bb4299e291525676839.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '项目信息概览',
                desc: '扫码即可了解工程概况、项目概览、项目历程等施工信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/17b8cbf070ca5099f0b6137dcdfb93471525829031.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '施工方案',
                desc: '展示施工方案资料，信息共享，无需翻阅纸质文档'
              }
            ]
          },
          {
            label: '市政路桥',
            value: '004',
            selected: false,
            scenes: [
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/05c98c0787cf7af48734e2e5d4e7eec81525675828.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '塔吊设备巡检',
                desc: '设备型号等参数信息展示，在线填写巡检记录表'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/7cd5186e6e9068eccc8b7856df86361b1525676091.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '特种设备巡检',
                desc: '查看设备资料，在线填写巡检记录表，全面掌握设备动态'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/672995bea15df93791601fc594916f241525676181.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '劳务人员管理',
                desc: '人员实名信息展示，记录安全教育培训等动态信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/d9507bf4f113ad30f7da241c070df19e1525676220.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '临电安全管理',
                desc: '产品记录，加强对临时用电的监督管理'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/41d3cd3edcaadbc31b0905b423ddc4341525678409.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '物资领用管理',
                desc: '产品管理工器具，扫码登记领用归还信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/866730d3acd0c14995eed16d88df363a1525676939.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '安全技术交底',
                desc: '各类交底文件集合在二维码中直接显示。'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/8234bdd3faa1a9678f0a3c3164ea479d1525678307.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '施工质量管理',
                desc: '记录工程材料试验数据，检测报告上传，直接扫码追溯历史记录'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/32d3f6ccb78e73917ef8b9f84df91fc51525676437.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '物资进场管理',
                desc: '物资出入库管理，记录型号、数量等信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/335ab6cbed53c6d421e45e2bb4299e291525676839.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '项目信息概览',
                desc: '扫码即可了解工程概况、项目概览、项目历程等施工信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/17b8cbf070ca5099f0b6137dcdfb93471525829031.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '施工方案',
                desc: '展示施工方案资料，信息共享，无需翻阅纸质文档'
              }
            ]
          },
          {
            label: '设备巡检',
            value: '005',
            selected: false,
            scenes: [
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/ca846afb754224a6654e380bc2ef3c611525678830.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '医疗设备维保',
                desc: '医疗设备种类多，数量大，采用二维码轻松将设备数据化管理'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/6d2f7ed1fa964c6f887c72999a74af991525678969.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '环保设备检修',
                desc: '扫码记录设备定期维护清洁信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/7996fe3de4662da029ce4d258541f0141525680198.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '石油钻井设备',
                desc: '设备生命周期管理，记录验收、调拨、维修等管理信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/0a01064e0e45a67d3798a2d85a3c1f941525679698.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '实验室仪器检修',
                desc: '采用二维码对仪器进行管理，加强对日常清洁保养的监控'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/84db37af6cef33b09f78de5da154bba51525680403.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '加工生产设备',
                desc: '扫码添加日常保养记录，轻松追溯设备故障维修记录。'
              }
            ]
          },
          {
            label: '电力设备',
            value: '006',
            selected: false,
            scenes: [
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/eefe76608dcb6d8b23f21adcc5d318af1525680612.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '变压器巡视',
                desc: '巡视员扫码就能快速获取变压器参数信息，并一键记录检查信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/18602eacf7dac99eb53fa175c8adb63a1525680737.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '断路器巡视',
                desc: '二维码展示断路器参数信息，扫码添加检查记录'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/131b106e60ac962dca120a8e5fb24b6e1525744548.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '汽轮机巡视',
                desc: '二维码点检记录，逐一标记检查结果'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/218c4a2e0c3501b81fbde3342e2f767d1525744009.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '配电室巡视',
                desc: '扫码查看设备信息，定位人员所在位置，记录检查信息'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/f18287ecb26ebeceb13f9fdce176a30e1525681806.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '循环泵巡视',
                desc: '展示循环泵的设备型号、负责人等信息，扫码快速添加检查记录'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/0e10c9c40f6b96d131ff7b9e120eb6931525744475.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '引风机巡视',
                desc: '扫码查看设备信息，巡检员扫码就能快速添加检查记录'
              }
            ]
          },
          {
            label: '物业消防',
            value: '007',
            selected: false,
            scenes: [
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/aaf62c19d54080b14e054c228a771b791525744832.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '消防设施器材',
                desc: '批量生成对应每个消防安置点的二维码，确保物业消防安全'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/8468d93fe8bcb75aac687cac40a14dfe1525744978.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '消防监控室',
                desc: '采用二维码定期记录监控室的日常巡视记录'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/eccd82008fd6069661d52e976e967e2d1525745118.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '配电房巡检',
                desc: '扫码添加配电房每日巡视检查记录'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/4631c6c0928447fc4945f410a5ef87141525746180.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '水泵房巡检',
                desc: '用二维码对水泵房定期记录保养、维修、清洁工作'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/93fe651fa5eb6dfff6fd36b0fa127fc11525746489.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '电梯安检',
                desc: '物业巡查员可通过扫码轻松记录下电梯巡视的所有内容'
              }
            ]
          },
          {
            label: '铁路巡更',
            value: '008',
            selected: false,
            scenes: [
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/764a2cad87a399eb876387e0b65865961525746661.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '车辆段设备巡检',
                desc: '扫码记录检查信息，提高记录效率，随时共享设备运行状况'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/d9f776d93f9216ea701395ad487aba511525746745.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '工务段线路巡检',
                desc: '规范巡检员日常巡检路线，监控人员到位，记录信息更全面'
              },
              {
                pic: 'http://oss-cn-hangzhou.aliyuncs.com/public-cli/free/3e7790b0f5d85b0a47abd1f71f97c0d91525746819.png?x-oss-process=image/resize,m_fill,w_70,h_70',
                title: '高铁作业管理',
                desc: '通过扫码进行线路检修、进出网记录，保障线路安全'
              }
            ]
          }
        ],
        sceneList: []
      }
    },
    computed: {
      showModal() {
        return this.$store.getters.getSource('qSingleMdl', 'second').dataSource.showModal
      },
      get() {
        return this.$store.getters.getSource('qSingleMdl', 'second')
      }
    },
    mounted() {
      this.toggleNav(0);
    },
    methods: {
      /**
       * 关闭弹窗
       * @param value
       */
      onVisible(value) {
        value || this.$store.dispatch('setDestroy', {
          compType: 'second',
          compName: ['qSingleMdl']
        });
      },
      /**
       * 切换选项Tab
       * @param index
       */
      toggleNav(index) {
        this.sceneNavList.forEach(m => m.selected = false);
        this.sceneNavList[index].selected = true;
        this.sceneList = this.sceneNavList[index].scenes;
      },
      /**
       * 保存建码
       */
      saveScene() {
        this.$api.qrcodeInterface.saveTemplate({
          templateFoldId: this.get.dataSource.templateFoldId,
          templateType: 0
        }).then((res) => {
          res = res.data;
          if (res.success) {
            this.autoClose && this.$set(this.get.dataSource, 'showModal', false);
            this.$router.push({
              name: 'qrcode-detail',
              query: {
                templateFoldId: this.get.dataSource.templateFoldId,
                templateId: res.data
              }
            });
          }
        }).catch(err => console.log(err))
      }
    }
  }
</script>

