import flightApi from '../apis/flights';

const flightStore = {
    namespaced: true,
    state: {
        flightList: [],
        crackList:[],
        flight: [],
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
        state.flight = flight;
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
          console.log("res" + res);
          commit("setFlight", res);
          commit("setCrackList", res.cracks)
          console.log("res" + res.cracks);
        }
      },
    }
  };
  
  export default flightStore;