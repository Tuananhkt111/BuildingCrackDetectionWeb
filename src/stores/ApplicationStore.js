const applicationStore = {
  namespaced: true,
  state: {
    isActive: false,
    isLogin: true,
    isForgotPassword: false,
    video: null
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
  }
};

export default applicationStore;