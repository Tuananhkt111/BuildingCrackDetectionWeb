import flightApi from '../apis/flights';

const flightStore = {
    namespaced: true,
    state: {
        flightList: [],
        crackList:[],
        flight: null,
    },
  
    getters: {
      getFlightList(state) {
        return state.flightList;
      },
      getCrackList(state) {
        return state.crackList;
      },
      getFlight(state) {
        return state.flight;
      },
    },
  
    mutations: {
      setFlightList(state, flightList) {
        state.flightList = flightList;
      },
      setCrackList(state, crackList) {
        state.crackList = crackList;
      },
      setFlight(state, flight) {
        state.crackList = flight;
      },
    },
  
    actions: {
      async setFlightList({ commit }) {
        const res = await flightApi.getAll();
        if (res) {
          commit("setFlightList", res);
        }
      },
      async setFlight({ commit }, id) {
        const res = await flightApi.getById(id);
        if (res) {
          console.log("AA" + res);
          commit("setFlight", res);
          commit("setCrackList", res.cracks)
        }
      },
    }
  };
  
  export default flightStore;