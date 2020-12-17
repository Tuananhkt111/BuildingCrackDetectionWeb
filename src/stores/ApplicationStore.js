const applicationStore = {
  namespaced: true,
  state: {
    isActive: false
  },

  getters: {
    getIsActive(state) {
      return state.isActive;
    }
  },

  mutations: {
    setIsActive(state, isActive) {
      state.isActive = isActive;
    }
  },

  actions: {
    setIsActive({commit}, value) {
      commit("setIsActive", value);
    }
  }
};

export default applicationStore;