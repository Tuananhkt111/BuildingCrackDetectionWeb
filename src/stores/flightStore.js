import flightApi from "../apis/flights";

const flightStore = {
  namespaced: true,
  state: {
    flightList: [],
    crackList: [],
    flight: [],
    isShow: false,
  },

  getters: {
    getFlightList(state) {
      return state.flightList;
    },

    getIsShow(state) {
      return state.isShow;
    },

    getFlightCount(state) {
      return state.crackList.filter(
        (crack) => crack.status !== "DetectedFailed"
      ).length;
    },

    getConfirmCrackList(state) {
      var tmp = state.crackList.filter(
        (crack) =>
          crack.status !== "Unconfirmed" && crack.status !== "DetectedFailed"
      );
      for (let index = 0; index < tmp.length; index++) {
        tmp[index].index = index + 1;
      }
      return tmp;
    },
    getUnConfirmCrackList(state) {
      var tmp = state.crackList.filter(
        (crack) => crack.status === "Unconfirmed"
      );
      for (let index = 0; index < tmp.length; index++) {
        tmp[index].index = index + 1;
      }
      return tmp;
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
    setIsShow(state, value) {
      state.isShow = value;
    },
  },

  actions: {
    async setFlightList({ commit }) {
      const res = await flightApi.getAll();
      for (let index = 0; index < res.length; index++) {
        res[index].created = new Date(res[index].created + "Z");
        res[index].recordDate = new Date(res[index].recordDate + "Z");
        res[index].lastModified = new Date(res[index].lastModified + "Z");
        res[index].video = res[index].video + ".mp4";
        res[index].index = index + 1;
      }
      if (res) {
        commit("setFlightList", res);
      }
    },
    async setFlight({ commit }, id) {
      const res = await flightApi.getById(id);
      if (res.status != 404) {
        res.created = new Date(res.created + "Z");
        res.recordDate = new Date(res.recordDate + "Z");
        commit("setIsShow", true);
        res.video = res.video + ".mp4";
        commit("setFlight", res);
        if (res.cracks) {
          for (let index = 0; index < res.cracks.length; index++) {
            res.cracks[index].index = index + 1;
            res.cracks[index].created = new Date(
              res.cracks[index].created + "Z"
            );
            res.cracks[index].lastModified = new Date(
              res.cracks[index].lastModified + "Z"
            );
            res.cracks[index].accuracy = Math.round(
              res.cracks[index].accuracy * 100
            );
            if(res.cracks[index].deleteVideoDate){
              res.cracks[index].deleteVideoDate = new Date(
                res.cracks[index].deleteVideoDate + "Z"
              );
            }
          }
          commit("setCrackList", res.cracks);
        }
      } else {
        commit("setFlight", []);
        commit("setIsShow", false);
      }
    },
  },
};

export default flightStore;
