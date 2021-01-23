import locationApi from '../apis/location';

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
    }
  };
  
  export default locationStore;