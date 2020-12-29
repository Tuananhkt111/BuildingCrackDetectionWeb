import { createStore } from 'vuex'
import applicationStore from './ApplicationStore';
import locationStore from './locationStore';
import crackStore from './crackStore';
import maintenanceWorkerStore from './maintenanceWorkerStore';

const store = createStore({
  modules: {
    application: applicationStore,
    location : locationStore,
    crack : crackStore,
    maintenanceWorker : maintenanceWorkerStore
  }
});

export default store;
