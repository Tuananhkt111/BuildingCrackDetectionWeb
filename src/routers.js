import { createWebHistory, createRouter } from "vue-router";
import Crack from "./views/Crack.vue";
import Location from "./views/Location.vue";
import MaintenanceOrder from "./views/MaintenanceOrder.vue";
import MaintenanceWorker from "./views/MaintenanceWorker.vue";
import Project from "./views/Profile.vue";
import User from "./views/User.vue";
import Login from "./views/LoginPage.vue";
import Notification from "./views/Notification.vue";
import ForgotPassword from "./views/ForgotPassword.vue";
import Flight from "./views/Flight.vue";
import Video from "./views/Video.vue";
import Upload from "./views/Upload.vue";
import DashBoard from "./views/DashBoard.vue";
import LoseInternet from "./views/LoseInternet.vue";

const router = new createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: DashBoard },
    { path: "/login", name: "login", component: Login },
    { path: "/cracks", name: "crack", component: Crack },
    { path: "/areas", name: "location", component: Location },
    { path: "/profile", name: "profile", component: Project },
    { path: "/detection-result-details", name: "video", component: Video },
    { path: "/detection-results", name: "flight", component: Flight },
    { path: "/dashboard", name: "dashboard", component: DashBoard },
    {
      path: "/repair-records",
      name: "maintenanceOrder",
      component: MaintenanceOrder,
    },
    {
      path: "/repairers",
      name: "maintenanceWorker",
      component: MaintenanceWorker,
    },
    { path: "/users", name: "user", component: User },
    { path: "/notifications", name: "notification", component: Notification },
    { path: "/upload", name: "upload", component: Upload },
    {
      path: "/users/:id/forgotpass-w",
      name: "forgotpass",
      component: ForgotPassword,
    },
    { path: "/no-connection", name: "no-connection", component: LoseInternet },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login"];

  const authRequired = !publicPages.includes(to.path);

  const staffPages = [
    "/detection-result-details",
    "/detection-results",
    "/repair-records",
    "/cracks",
    "/repairers",
    "/profile",
    "/notifications",
    "/no-connection",
  ];

  const StaffRequired = !staffPages.includes(to.path);

  var checkForgotPass = false;

  if (to.name == "forgotpass") {
    checkForgotPass = true;
  }
  const loggedIn = localStorage.getItem("jwtToken");

  const user = JSON.parse(localStorage.getItem("user"));
  console.log(to.name);
  if (to.name == "no-connection") {
    next();
  } else if (user != null) {
    if (checkForgotPass) {
      next("/");
    } else if (to.name == "home" && user.role == "Staff") {
      next("/cracks");
    } else if (user.role == "Staff" && StaffRequired) {
      next("/cracks");
    } else {
      next();
    }
  } else if (checkForgotPass) {
    next();
  } else if (authRequired && !loggedIn) {
    return next("/login");
  } else {
    next();
  }
});

export default router;
