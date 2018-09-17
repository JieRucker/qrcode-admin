import BaseModule from "./BaseModule";

class RecordStateInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  // 查询所有状态组(分页查询)
  listRecordStateTemplate(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordStateTemplate/listRecordStateTemplate`, data)
  }

  // 添加一个状态组
  saveRecordStateTemplate(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordStateTemplate/saveRecordStateTemplate`, data)
  }

  // 修改一个状态组
  updateRecordStateTemplate(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordStateTemplate/updateRecordStateTemplate`, data)
  }

  // 删除一个状态组
  removeRecordStateTemplate(data = {}) {
    if (!data || !Object.keys(data).length) {
      return Promise.reject(new Error(`提交的数据无效`))
    }
    return this.post(`/recordStateTemplate/removeRecordStateTemplate`, data)
  }
}

export default new RecordStateInterface()
