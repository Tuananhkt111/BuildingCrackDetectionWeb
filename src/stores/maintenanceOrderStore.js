import maintenanceOrderApi from "../apis/maintenanceOrder";

const maintenanceOrderStore = {
  namespaced: true,
  state: {
    maintenanceOrderList: [],
  },

  getters: {
    getMaintenanceOrderList(state) {
      if (localStorage.getItem("orderId") != null) {
        console.log("CC Order");
        const orderId = localStorage.getItem("orderId");
        localStorage.removeItem("orderId");
        return state.maintenanceOrderList.filter((oder) => oder.maintenanceOrderId == orderId);
      } else {
        console.log("run BTH");
        return state.maintenanceOrderList;
      }
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
