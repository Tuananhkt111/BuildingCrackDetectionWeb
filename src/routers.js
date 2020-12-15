import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./views/Home.vue";
import HashTag from "./views/HashTag.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/hash-tags", name: "hashTag", component: HashTag },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('jwtToken');
  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
});

