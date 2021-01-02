import userApi from '../apis/user';

const userStore = {
    namespaced: true,
    state: {
      userList: [],
    },
  
    getters: {
      getUserList(state) {
        return state.userList;
      },
    },
  
    mutations: {
      setUserList(state, userList) {
        state.userList = userList;
      },
    },
  
    actions: {
      async setUserList({ commit }) {
        const res = await userApi.getAll();
        if (res) {
          commit("setUserList", res);
        }
      },
    }
  };
  
  export default userStore;