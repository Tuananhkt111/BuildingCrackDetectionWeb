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
      if (res) {
        for (let index = 0; index < res.length; index++) {
          res[index].created = new Date(res[index].created +"Z");
          res[index].lastModified = new Date(res[index].lastModified +"Z");
          res[index].index = index + 1;
        }
        commit("setMaintenanceWorkerList", res);
      }
    },
  },
};

export default maintenanceWorkerStore;
