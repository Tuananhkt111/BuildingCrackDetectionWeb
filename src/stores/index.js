import { createStore } from 'vuex'
import applicationStore from './ApplicationStore';
import locationStore from './locationStore';
import crackStore from './crackStore';
import maintenanceWorkerStore from './maintenanceWorkerStore';
import userStore from './userStore';
import maintenanceOrderStore from './maintenanceOrderStore';
import notificationStore from './notificationStore';

const store = createStore({
  modules: {
    application: applicationStore,
    location : locationStore,
    crack : crackStore,
    maintenanceWorker : maintenanceWorkerStore,
    user : userStore,
    maintenanceOrder : maintenanceOrderStore,
    noti : notificationStore,
  }
});

export default store;
