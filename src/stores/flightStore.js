import flightApi from '../apis/flights';

const flightStore = {
    namespaced: true,
    state: {
        flightList: [],
    },
  
    getters: {
      getFlightList(state) {
        return state.crackList;
      },
    },
  
    mutations: {
      setFlightList(state, crackList) {
        state.crackList = crackList;
      },
    },
  
    actions: {
      async setFlightList({ commit }) {
        const res = await flightApi.getAll();
        if (res) {
          commit("setFlightList", res);
        }
      },
    }
  };
  
  export default flightStore;