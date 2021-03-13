<template>
  <div class="all">
    <div class="p-grid p-mr-0" id="app-main">
      <div
        class="p-col-12 main-app"
        :class="{ active: getIsActive, inactive: !getIsActive }"
        v-if="!getIsLogin"
      >
        <TopNav></TopNav>
        <div class="main-layout-container p-d-flex">
            <SideBar></SideBar>
          <div class="main-layout">
            <div class="main-layout-details">
              <router-view class="view"></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="getIsLogin">
      <Login></Login>
    </div>
    <!-- <AppFooter></AppFooter> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TopNav from "../src/components/TopNav.vue";
import SideBar from "../src/components/SideBar.vue";
// import AppFooter from "../src/components/AppFooter.vue";
import Login from "../src/views/LoginPage.vue";
export default {
  name: "app",
  components: {
    TopNav,
    SideBar,
    Login,
    // AppFooter
  },
  computed: {
    ...mapGetters("application", ["getIsActive", "getIsLogin"]),
  },
  data() {
    return {
      login: false,
    };
  },
  created() {
    if (localStorage.getItem("user")) {
      this.setIsLogin(false);
    }
  },

  mounted() {
    this.$nextTick(() => {
      console.log("Finished rendering the complete view");
    });
  },
  methods: {
    ...mapActions("application", ["setIsLogin"]),

    doSomething() {
      console.log("AA");
    },
  },
};
</script>
<style scoped>
.main-layout{
  margin-left: 64.5px;
}
.main-app {
  padding: 0;
}
.layout-mask {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: none;
  position: absolute;
  z-index: 1;
  transition: all 0.2s;
  background-color: #0000009c;
}
.main-layout-container {
  margin: 0;
  height: calc(100% - 56px);
}
.layout-menu {
  overflow: auto;
  position: fixed;
  width: 250px;
  z-index: 99;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #ffffff;
  box-shadow: 3px 0 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}
.main-layout-details {
  border-radius: 24px;
  padding: 20px;
  background-color: white;
  box-shadow: 0px 10px 40px rgb(41 50 65 / 6%);
}
.main-layout {
  background-color:  #f2f2f2;
  padding: 50px;
  width: 100%;
  height: 100%;
}
.active .layout-menu {
  transform: translateX(0);
  transition: transform 0.2s;
}
.inactive .layout-menu {
  transform: translateX(-100%);
  transition: transform 0.2s;
}
.active .main-layout-details {
  margin-left: 266.5px;
  transition: all 0.2s;
}
.inactive .main-layout-details {
  margin-left: 0;
  transition: all 0.2s;
}
.active .top-nav-layout {
  margin-left: 250px;
  transition: all 0.2s;
}
.inactive .top-nav-layout {
  margin-left: 0;
  transition: all 0.2s;
}

.all, #app-main {
  min-height:100vh;
}

@media screen and (max-width: 1025px) {
  .active .main-layout-details {
    margin-left: 0px;
    transition: all 0.2s;
  }
  .inactive .main-layout-details {
    margin-left: 0;
    transition: all 0.2s;
  }

  .active .layout-mask {
    display: block;
    opacity: 1;
    transition: all 0.2s;
  }
  .inactive .layout-mask {
    display: none;
    opacity: 0;
    transition: all 0.2s;
  }
}

@font-face {
  font-family: "Poppins";
  src: local("Poppins"),
   url(./fonts/Poppins/Poppins-Light.ttf) format("truetype");
}

</style>
