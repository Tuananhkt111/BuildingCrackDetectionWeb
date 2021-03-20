import locationApi from "../apis/location";

const locationStore = {
  namespaced: true,
  state: {
    locationList: [],
    availableLocationStaff: [],
    availableLocationManager: [],
  },

  getters: {
    getLocationList(state) {
      return state.locationList;
    },
    getAvailableLocationManager(state) {
      return state.availableLocationManager;
    },
    getAvailableLocationStaff(state) {
      return state.availableLocationStaff;
    },
  },

  mutations: {
    setLocationList(state, locationList) {
      state.locationList = locationList;
    },
    setAvailableLocationStaff(state, availableLocationStaff) {
      state.availableLocationStaff = availableLocationStaff;
    },
    setAvailableLocationManager(state, availableLocationManager) {
      state.availableLocationManager = availableLocationManager;
    },
  },

  actions: {
    async setLocationList({ commit }) {
      const res = await locationApi.getAll();
      if (res) {
        for (let index = 0; index < res.length; index++) {
          res[index].lastModified = new Date(res[index].lastModified + "Z");
          res[index].created = new Date(res[index].created + "Z");
          res[index].index = index + 1;
        }
        commit("setLocationList", res);
      }
    },

    async setAvailableLocationManager({ commit }, empId) {
      const res = await locationApi.getAvailable("Manager", empId);
      if (res) {
        commit("setAvailableLocationManager", res);
      }
    },

    async setAvailableLocationStaff({ commit }, empId) {
      const res = await locationApi.getAvailable("Staff", empId);
      if (res) {
        commit("setAvailableLocationStaff", res);
      }
    },
  },
};

export default locationStore;
