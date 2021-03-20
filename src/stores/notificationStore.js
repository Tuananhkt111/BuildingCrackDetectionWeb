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
      return state.notificationList.filter((noti) => !noti.isRead).length;
    },
    getUnReadNotificationList(state){
      return state.notificationList.filter((noti) => !noti.isRead);
    }
  },

  mutations: {
    setNotificationList(state, notificationList) {
      // state.notificationList = notificationList.filter((noti) => !noti.isRead);
      state.notificationList = notificationList;
    },
  },

  actions: {
    async setNotificationList({ commit }) {
      const res = await notificationApi.getAll();
      if (res) {
        for (let index = 0; index < res.length; index++) {
          res[index].created = new Date(res[index].created +"Z");
          res[index].index = index + 1;
        }
        commit("setNotificationList", res);
      }
    },
  },
};

export default notificationStore;
