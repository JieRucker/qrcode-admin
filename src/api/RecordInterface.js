import BaseModule from "./BaseModule";

class RecordInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  // 查询巡检码
  listTemplate(data = {}) {
    return this.post(`/recordResult/listTemplate`, data)
  }

  // 查询维护人员
  listManager(data = {}) {
    return this.post(`/recordResult/listManager`, data)
  }

  // 查询维护记录(分页查询)
  listRecordStateResult(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordResult/listRecordStateResult`, data)
  }

  // 查询维护模板
  listRecordTemplate(data = {}) {
    return this.post(`/recordResult/listRecordTemplate`, data)
  }

  // 查询详细维护记录
  getRecordResult(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordResult/getRecordResult`, data)
  }

  // 新增维护记录
  saveRecordResult(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordResult/saveRecordResult`, data)
  }

  // 修改维护记录
  updateRecordResult(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordResult/updateRecordResult`, data)
  }

  // 删除维护记录
  removeRecordResult(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordResult/removeRecordResult`, data)
  }

  // 导出维护记录
  exportRecordResult(data = {}) {
    return this.post(`/recordResult/exportRecordResult`, data)
  }

  // 二维码目录
  listTemplatefold(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/templatefold/listTemplatefold`, data)
  }
}

export default new RecordInterface()
