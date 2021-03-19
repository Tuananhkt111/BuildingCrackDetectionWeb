import maintenanceOrderApi from "../apis/maintenanceOrder";

const maintenanceOrderStore = {
  namespaced: true,
  state: {
    maintenanceOrderList: [],
    status: ["Waiting for confirm", "Waiting for maintenance", "Completed"],
    schedule: [],
  },

  getters: {
    getMaintenanceOrderList(state) {
      if (localStorage.getItem("orderId") != null) {
        console.log("CC Order");
        const orderId = localStorage.getItem("orderId");
        localStorage.removeItem("orderId");
        return state.maintenanceOrderList.filter(
          (oder) => oder.maintenanceOrderId == orderId
        );
      } else {
        console.log("run BTH");
        return state.maintenanceOrderList;
      }
    },
    getStatusList(state) {
      return state.status;
    },
    getSchedule(state) {
      for (let index = 0; index < this.maintenanceOrderList.length; index++) {
        const tmp = null;
        tmp.id = index;
        tmp.title =
          this.maintenanceOrderList[index].locationName +
          "-" +
          this.maintenanceOrderList[index].status;
        tmp.start = this.maintenanceOrderList[index].maintenanceDate;
        console.log(tmp);
        this.schedule.push(tmp);
      }
      return state.schedule;
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
      for (let index = 0; index < res.length; index++) {
        res[index].maintenanceDate = new Date(res[index].maintenanceDate + "Z");
      }
      if (res) {
        commit("setMaintenanceOrderList", res);
      }
    },

    async setMaintenanceOrder({ commit }, id) {
      const res = await maintenanceOrderApi.getById(id);
      for (let index = 0; index < res.length; index++) {
        res[index].maintenanceDate = new Date(res[index].maintenanceDate + "Z");
      }
      if (res) {
        commit("setMaintenanceOrderList", res);
      }
    },
  },
};

export default maintenanceOrderStore;
