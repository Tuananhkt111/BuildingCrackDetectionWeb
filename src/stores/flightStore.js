import flightApi from "../apis/flights";

const flightStore = {
  namespaced: true,
  state: {
    flightList: [],
    crackList: [],
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
      for (let index = 0; index < res.length; index++) {
        res[index].created = new Date(res[index].created);
      }
      console.log(res.created);
      if (res) {
        commit("setFlightList", res);
      }
    },
    async setFlight({ commit }, id) {
      const res = await flightApi.getById(id);
      if (res) {
        console.log("res" + res);
        commit("setFlight", res);
        if (res.cracks != null) {
          for (let index = 0; index < res.cracks.length; index++) {
            res.cracks[index].accuracy = Math.round(res.cracks[index].accuracy * 100);
            commit("setCrackList", res.cracks);
          }
        }
      }
    },
  },
};

export default flightStore;
