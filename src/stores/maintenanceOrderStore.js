import maintenanceOrderApi from "../apis/maintenanceOrder";

const maintenanceOrderStore = {
  namespaced: true,
  state: {
    maintenanceOrderList: [],
  },

  getters: {
    getMaintenanceOrderList(state) {
      return state.maintenanceOrderList;
    },
  },

  mutations: {
    setMaintenanceOrderList(state, maintenanceOrderList) {
      state.maintenanceOrderList = maintenanceOrderList;
    },
  },

  actions: {
    async setMaintenanceOrderList({ commit }) {
      const res = await maintenanceOrderApi.getAll();
      if (res) {
        commit("setMaintenanceOrderList", res);
      }
    },
  },
};

export default maintenanceOrderStore;
