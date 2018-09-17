import * as types from '../mutation-types'

const state = {
  uploadId: null,// 上传文件Id
};

const getters = {
  getUploadId: state => state.uploadId,
};

const actions = {
  setUploadId({commit}, info) {
    commit(types.SET_UPLOAD_ID, info)
  }
};

const mutations = {
  [types.SET_UPLOAD_ID](state, uploadId) {
    state.uploadId = uploadId;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
