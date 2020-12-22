import { createWebHistory, createRouter } from "vue-router";
import Crack from "./views/Crack.vue";
import Location from "./views/Location.vue";
import MaintenanceOrder from "./views/MaintenanceOrder.vue";
import MaintenanceWorker from "./views/MaintenanceWorker.vue";
import User from "./views/User.vue";
import Login from "./views/LoginPage.vue";


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
  ],
});

router.beforeEach((to, from, next) => {
  alert("Tao dang check role");
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('jwtToken');

  if (authRequired && !loggedIn) {
    alert("M eo co role");
    return next('/login');
  }
  next();
});

export default router;

