import crackApi from "../apis/cracks";

const crackStore = {
  namespaced: true,
  state: {
    crackList: [],
    statuses: [
      "DetectedFailed",
      "Unconfirmed",
      "Unscheduled for maintenance",
      "Scheduled for maintenance",
      "Fixed",
    ],
    severitys: ["Low", "Medium", "High"],
  },

  getters: {
    getCrackList(state) {
      return state.crackList;
    },
    getCrackListConfirm(state) {
      var tmp = state.crackList.filter((crack) => crack.status !== "Unconfirmed");
      for (let index = 0; index < tmp.length; index++) {
        tmp[index].index = index + 1;
      }
      return tmp ;
    },
    getStatusList(state) {
      return state.statuses;
    },
    getSeveritysList(state) {
      return state.severitys;
    },
  },

  mutations: {
    setCrackList(state, crackList) {
      state.crackList = crackList;
    },
  },

  actions: {
    async setCrackList({ commit }) {
      const res = await crackApi.getAll();
      for (let index = 0; index < res.length; index++) {
        res[index].lastModified = new Date(res[index].lastModified + "Z");
        res[index].created = new Date(res[index].created + "Z");
        res[index].accuracy = Math.round(res[index].accuracy * 100);
      }
      if (res) {
        commit("setCrackList", res);
      }
    },
  },
};

export default crackStore;
