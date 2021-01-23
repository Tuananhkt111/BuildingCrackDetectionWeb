import crackApi from '../apis/cracks';

const crackStore = {
    namespaced: true,
    state: {
      crackList: [],
      statuses: ["DetectedFailed", "Unconfirmed", "Unscheduled for maintenace", "Scheduled for maintenace", "Fixed"],
      severitys: ["Low", "Medium", "High"],
    },
  
    getters: {
      getCrackList(state) {
        return state.crackList;
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
        if (res) {
          commit("setCrackList", res);
        }
      },
    }
  };
  
  export default crackStore;