import { createStore } from 'vuex'
import applicationStore from './ApplicationStore';

const store = createStore({
  modules: {
    application: applicationStore
  }
});

export default store;
