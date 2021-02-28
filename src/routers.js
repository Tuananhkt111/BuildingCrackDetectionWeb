import { createWebHistory, createRouter } from "vue-router";
import Crack from "./views/Crack.vue";
import Location from "./views/Location.vue";
import MaintenanceOrder from "./views/MaintenanceOrder.vue";
import MaintenanceWorker from "./views/MaintenanceWorker.vue";
import User from "./views/User.vue";
import UserByManager from "./views/UserByManager.vue";
import Login from "./views/LoginPage.vue";
import Notification from "./views/Notification.vue";
import ForgotPassword from "./views/ForgotPassword.vue";
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
    {
      path: "/users/:id/forgotpass",
      name: "fogotpass",
      component: ForgotPassword,
    },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login"];

  const authRequired = !publicPages.includes(to.path);

  const checkForgotPass = /\/users\/[a-zA-Z]+\/forgotpass/.test(to.path);

  const loggedIn = localStorage.getItem("jwtToken");

  const user = JSON.parse(localStorage.getItem("user"));

  console.log("AA");
  if (checkForgotPass) {
    localStorage.setItem("checkForgot", "true");
    next();
  } else if (authRequired && !loggedIn) {
    return next("/login");
  } else if (user != null) {
    if (user.role == urlConstants.STAFF_ROLE) {
      userApi.logout();
      alert("Staff can't login into web");
      return next("/login");
    } else {
      next();
    }
  } else {
    localStorage.removeItem("checkForgot");
    next();
  }
});

export default router;
