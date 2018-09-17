import BaseModule from "./BaseModule";

class RecordTemplateInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  // 维护模板-查询 分页
  listRecordTemplate(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordTemplate/listRecordTemplate`, data)
  }

  // 维护模板类表Tab-查询
  listRecordTemplateCategory(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordTemplate/listRecordTemplateCategory`, data)
  }

  // 维护模板-点编辑 查询
  getRecordTemplateByRecordTemplateId(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordTemplate/getRecordTemplateByRecordTemplateId`, data)
  }

  // 维护模板-短信-查询
  getShortMsgRemind(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordTemplate/getShortMsgRemind`, data)
  }

  // 维护模板-修改
  updateRecordTemplate(data = {}) {
    return this.post(`/recordTemplate/updateRecordTemplate`, data)
  }

  // 维护模板-短信-保存
  updateShortMsgRemind(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordTemplate/updateShortMsgRemind`, data)
  }

  // 维护模板类表Tab-修改
  updateRecordTemplateCategory(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordTemplate/updateRecordTemplateCategory`, data)
  }

  // 维护模板-巡检周期-保存
  updateCheckCycle(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordTemplate/updateCheckCycle`, data)
  }

  // 维护模板-移动
  updateMoveRecordTemplate(data = {}) {
    return this.post(`/recordTemplate/updateMoveRecordTemplate`, data)
  }

  // 维护模板-新增
  saveRecordTemplate(data = {}) {
    return this.post(`/recordTemplate/saveRecordTemplate`, data)
  }

  // 维护模板类表Tab-新增
  saveRecordTemplateCategory(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordTemplate/saveRecordTemplateCategory`, data)
  }

  // 维护模板-刪除
  removeRecordTemplate(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordTemplate/removeRecordTemplate`, data)
  }

  // 维护模板类表Tab-删除
  removeRecordTemplateCategory(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordTemplate/removeRecordTemplateCategory`, data)
  }
}

export default new RecordTemplateInterface()
