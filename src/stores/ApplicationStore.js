const applicationStore = {
  namespaced: true,
  state: {
    isActive: false,
    isLogin: true,
    isForgotPassword: false,
    video: null,
    checkOffline: false,
  },

  getters: {
    getIsActive(state) {
      return state.isActive;
    },
    getIsLogin(state) {
      return state.isLogin;
    },
    getIsForgotPassword(state) {
      return state.isForgotPassword;
    },
    getVideo(state) {
      return state.video;
    },
    getCheckOffline(state) {
      return state.checkOffline;
    }
  },

  mutations: {
    setIsActive(state, isActive) {
      state.isActive = isActive;
    },
    setIsLogin(state, isLogin) {
      state.isLogin = isLogin;
    },
    setIsForgotPassword(state, isForgotPassword) {
      state.isForgotPassword = isForgotPassword;
    },
    setVideo(state, video) {
      state.video = video;
    },
    setOffline(state, offline) {
      state.checkOffline = offline;
    },
  },

  actions: {
    setIsActive({commit}, value) {
      commit("setIsActive", value);
    },
    setIsLogin({commit}, value) {
      commit("setIsLogin", value);
    },
    setIsForgotPassword({commit}, value) {
      commit("setIsForgotPassword", value);
    },
    setVideo({commit}, value) {
      commit("setVideo", value);
    },
    setCheckOffline({commit}, value) {
      commit("setOffline", value)
    }
  }
};

export default applicationStore;