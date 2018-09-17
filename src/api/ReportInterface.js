import BaseModule from "./BaseModule";

class ReportInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  // 导出统计报表
  addExportInfo(data = {}) {
    return this.post(`/report/addExportInfo`, data)
  }

  // 查询所有标签信息 - 手机端
  listTemplateTagReport() {
    return this.post(`/report/listTemplateTagReport`)
  }

  // 查询漏检报表
  listUndetectedReport(data = {}) {
    return this.post(`/report/listUndetectedReport`, data)
  }

  // 查询状态统计 - 手机端
  listRecordStateResultByTag(data = {}) {
    return this.post(`/report/listRecordStateResultByTag`, data)
  }

  // 查询记录报表
  listRecordResultReport(data = {}) {
    return this.post(`/report/listRecordResultReport`, data)
  }

  // 查询维护模板
  listRecordTemplate() {
    return this.post(`/report/listRecordTemplate`)
  }

  // 查询静态统计
  listStaticReport() {
    return this.post(`/report/listStaticReport`)
  }

}

export default new ReportInterface()
