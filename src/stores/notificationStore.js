import notificationApi from "../apis/notification";

const notificationStore = {
  namespaced: true,
  state: {
    notificationList: [],
  },

  getters: {
    getNotificationList(state) {
      return state.notificationList;
    },
    getCount(state) {
      return state.notificationList.length;
    },
  },

  mutations: {
    setNotificationList(state, notificationList) {
      state.notificationList = notificationList.filter((noti) => !noti.isRead);
    },
  },

  actions: {
    async setNotificationList({ commit }) {
      const res = await notificationApi.getAll();
      if (res) {
        commit("setNotificationList", res);
      }
    },
  },
};

export default notificationStore;
