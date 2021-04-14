import userApi from "../apis/user";

const userStore = {
  namespaced: true,
  state: {
    userList: [],
    user: null,
  },

  getters: {
    getUserList(state) {
      return state.userList;
    },
    getUser(state) {
      return state.user;
    },
  },

  mutations: {
    setUserList(state, userList) {
      state.userList = userList;
    },
    setUser(state, user) {
      state.user = user;
    },
  },

  actions: {
    async setUserList({ commit }) {
      const res = await userApi.getAll();
      if (res) {
        for (let index = 0; index < res.length; index++) {
          res[index].created = new Date(res[index].created +"Z");
          res[index].index = index + 1;
          res[index].fullLocation = res[index].locations.map((l) => " " + l.name).toString();
        }
        commit("setUserList", res);
      }
    },
    async setUser({ commit }, user) {
      commit("setUser", user);
    },
  },
};

export default userStore;
