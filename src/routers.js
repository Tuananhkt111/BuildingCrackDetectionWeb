import { createWebHistory, createRouter } from "vue-router";
import Crack from "./views/Crack.vue";
import Location from "./views/Location.vue";
import MaintenanceOrder from "./views/MaintenanceOrder.vue";
import MaintenanceWorker from "./views/MaintenanceWorker.vue";
import User from "./views/User.vue";
import Login from "./views/LoginPage.vue";
import Notification from "./views/Notification.vue";
import urlConstants from "./util/urlConstants";
import userApi from "./apis/user";


const router = new createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: Crack },
    { path: "/login", name: "login", component: Login },
    { path: "/cracks", name: "crack", component: Crack },
    { path: "/locations", name: "location", component: Location },
    { path: "/maintenanceOrders", name: "maintenanceOrder", component: MaintenanceOrder },
    { path: "/maintenanceWorkers", name: "maintenanceWorker", component: MaintenanceWorker },
    { path: "/users", name: "user", component: User },
    { path: "/notis", name: "notification", component: Notification },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
 
  const authRequired = !publicPages.includes(to.path);
  
  const loggedIn = localStorage.getItem('jwtToken');
 
  const role = localStorage.getItem('role');
  if (authRequired && !loggedIn ) {
    return next('/login');
  }  else if(role == urlConstants.STAFF_ROLE){
    userApi.logout();
    alert("Staff can't login into web");
    return next('/login');
  }
  const checkAdmin = localStorage.getItem('userId');
  if(checkAdmin != null){
    const managerPages = ['/users','/cracks', '/maintenanceOrders', '/notis', '/account'];
    const managerRequired = !managerPages.includes(to.path);
    if (managerRequired && checkAdmin!=(urlConstants.ADMIN_ID)){
      return next('/cracks');
    } 
  }
  next();
});

export default router;

