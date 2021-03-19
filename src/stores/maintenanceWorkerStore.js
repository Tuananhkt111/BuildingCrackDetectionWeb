import maintenanceWorkerApi from "../apis/maintenanceWorker";

const maintenanceWorkerStore = {
  namespaced: true,
  state: {
    maintenanceWorkerList: [],
  },

  getters: {
    getMaintenanceWorkerList(state) {
      return state.maintenanceWorkerList;
    },
  },

  mutations: {
    setMaintenanceWorkerList(state, maintenanceWorkerList) {
      state.maintenanceWorkerList = maintenanceWorkerList;
    },
  },

  actions: {
    async setMaintenanceWorkerList({ commit }) {
      const res = await maintenanceWorkerApi.getAll();
      for (let index = 0; index < res.length; index++) {
        res[index].created = new Date(res[index].created +"Z");
      }
      if (res) {
        commit("setMaintenanceWorkerList", res);
      }
    },
  },
};

export default maintenanceWorkerStore;
