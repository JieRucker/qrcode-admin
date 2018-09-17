import BaseModule from "./BaseModule";

class CardInterface extends BaseModule {
  constructor() {
    let options = {
      baseUrl: process.env.api.commonUrl
    };
    super(options)
  }

  // 新增、修改名片
  saveCardImageVO(data = {}) {
    return this.post(`/card/saveCardImageVO`, data)
  }

  // 删除名片
  removeCard(data = {}) {
    return this.post(`/card/removeCard`, data)
  }

  // 复制名片
  saveCardfromCardId(data = {}) {
    return this.post(`/card/saveCardfromCardId`, data)
  }

  // 查询单个名片
  getCard(data = {}) {
    return this.post(`/card/getCard`, data)
  }

  // 查询名片
  listCard(data = {}) {
    return this.post(`/card/listCard`, data)
  }

  // 修改名片树
  updateCardfold(data = {}) {
    return this.post(`/cardfold/updateCardfold`, data)
  }

  // 删除名片树
  removeCardfold(data = {}) {
    return this.post(`/cardfold/removeCardfold`, data)
  }

  // 新增根目录
  saveCardfold(data = {}) {
    return this.post(`/cardfold/saveCardfold`, data)
  }

  // 查询名片树
  listCardfold(data = {}) {
    return this.post(`/cardfold/listCardfold`, data)
  }

}

export default new CardInterface()
