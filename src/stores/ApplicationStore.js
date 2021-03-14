const applicationStore = {
  namespaced: true,
  state: {
    isActive: false,
    isLogin: true,
    isForgotPassword: false,
    isDetect: false,
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
    getIsDetect(state) {
      return state.isDetect;
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
    setIsDetect(state, isDetect) {
      state.isDetect = isDetect;
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
    setIsDetect({commit}, value) {
      commit("setIsDetect", value);
    },
  }
};

export default applicationStore;