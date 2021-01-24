import { createWebHistory, createRouter } from "vue-router";
import Crack from "./views/Crack.vue";
import Location from "./views/Location.vue";
import MaintenanceOrder from "./views/MaintenanceOrder.vue";
import MaintenanceWorker from "./views/MaintenanceWorker.vue";
import User from "./views/User.vue";
import UserByManager from "./views/UserByManager.vue";
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
    {
      path: "/maintenanceOrders",
      name: "maintenanceOrder",
      component: MaintenanceOrder,
    },
    {
      path: "/maintenanceWorkers",
      name: "maintenanceWorker",
      component: MaintenanceWorker,
    },
    { path: "/users", name: "user", component: User },
    { path: "/userByManager", name: "userByManager", component: UserByManager },
    { path: "/notis", name: "notification", component: Notification },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login"];

  const authRequired = !publicPages.includes(to.path);

  const loggedIn = localStorage.getItem("jwtToken");

  const user = JSON.parse(localStorage.getItem("user"));

  if (user != null) {
    if (authRequired && !loggedIn) {
      return next("/login");
    } else if (user.role == urlConstants.STAFF_ROLE) {
      userApi.logout();
      alert("Staff can't login into web");
      return next("/login");
    }
    if (user.role != urlConstants.ADMIN_ROLE) {
      const managerPages = [
        "/userByManager",
        "/cracks",
        "/maintenanceOrders",
        "/notis",
        "/account",
      ];
      const managerRequired = !managerPages.includes(to.path);
      if (!managerRequired) {
        next();
      } else {
        return next("/cracks");
      }
    } else {
      next();
    }
  }
});

export default router;
