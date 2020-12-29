import locationApi from '../apis/location';

const locationStore = {
    namespaced: true,
    state: {
      locationList: [],
    },
  
    getters: {
      getLocationList(state) {
        return state.locationList;
      },
    },
  
    mutations: {
      setLocationList(state, locationList) {
        state.locationList = locationList;
      },
    },
  
    actions: {
      async setLocationList({ commit }) {
        const res = await locationApi.getAll();
        if (res) {
          commit("setLocationList", res);
        }
      },
    }
  };
  
  export default locationStore;