<template>
  <div class="all">
    <div class="p-grid p-mr-0" id="app-main">
      <div
        class="p-col-12 main-app"
        :class="{ active: getIsActive, inactive: !getIsActive }"
        v-if="!getIsLogin && !getCheckOffline"
      >
        <TopNav></TopNav>
        <div class="main-layout-container p-d-flex">
          <SideBar></SideBar>
          <div class="main-layout">
            <div>
              <router-view class="view"></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="getIsLogin && !getCheckOffline">
      <Login></Login>
    </div>
    <div v-if="getCheckOffline" class="checkOffline">
      <LoseInternet></LoseInternet>
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
import LoseInternet from "../src/views/LoseInternet.vue";
import flightApi from "./apis/flights";
import firebase from "./util/firebase.js";

export default {
  name: "app",
  components: {
    TopNav,
    SideBar,
    Login,
    LoseInternet,
    // AppFooter
  },
  computed: {
    ...mapGetters("application", [
      "getIsActive",
      "getIsLogin",
      "getVideo",
      "getCheckOffline",
    ]),
  },
  data() {
    return {
      login: false,
      polling: null,
    };
  },
  async created() {
    if (localStorage.getItem("user")) {
      this.setIsLogin(false);
    }
    if (localStorage.getItem("video")) {
      this.setVideo(localStorage.getItem("video"));
      await this.pollData();
    }
    if (localStorage.getItem("checkOffline") != null) {
      localStorage.removeItem("checkOffline");
      this.$router.push("/");
    }
  },

  methods: {
    ...mapActions("application", ["setIsLogin", "setVideo", "setCheckOffline"]),

    prepareFcm() {
      firebase.messaging
        .requestPermission()
        .then(
          firebase.messaging.getToken().then(async (fcmToken) => {
            localStorage.setItem("fcm", fcmToken);
          })
        )
    },

    async pollData() {
      this.polling = setInterval(async () => {
        let res = await flightApi.checkExists(this.getVideo);
        if (res && res.data === "Video exists") {
          clearInterval(this.polling);
          this.setVideo(null);
          localStorage.removeItem("video");
          this.setFlightList();
        }
      }, 60000);
      setTimeout(() => {
        clearInterval(this.polling);
      }, 36000000);
    },
  },
};
</script>
<style scoped>
.all {
  overflow: hidden;
}
.main-layout {
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
.main-layout {
  background-color: #f5f6ff;
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
.active .top-nav-layout {
  margin-left: 250px;
  transition: all 0.2s;
}
.inactive .top-nav-layout {
  margin-left: 0;
  transition: all 0.2s;
}

.all,
#app-main {
  min-height: 100vh;
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

.checkOffline {
  position: fixed;
  top: 0;
  left: 20%;
}
</style>
