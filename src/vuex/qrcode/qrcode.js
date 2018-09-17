import * as types from '../mutation-types'

const state = {
  showRecord: true,// 显示维护模板
  templateId: '' // 嵌套编辑模板Id
};

const getters = {
  getShowRecord: state => state.showRecord,
  getTemplateId: state => state.templateId
};

const actions = {
  setShowRecord({commit}, info) {
    commit(types.SET_SHOW_RECORD, info)
  },
  setTemplateId({commit}, info) {
    commit(types.SET_TEMPLATE_ID, info)
  }
};

const mutations = {
  [types.SET_SHOW_RECORD](state, data) {
    state.showRecord = data;
  },
  [types.SET_TEMPLATE_ID](state, data) {
    state.templateId = data;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
