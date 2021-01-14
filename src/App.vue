<template>
  <div class="p-grid" id="app">
    <div
      class="p-col-12 main-app"
      :class="{ active: getIsActive, inactive: !getIsActive }"
      v-if="display"
    >
      <TopNav></TopNav>
      <div class="main-layout-container p-d-flex">
        <div class="layout-menu">
          <SideBar></SideBar>
        </div>
        <div class="main-layout">
          <div class="main-layout-details">
            <router-view class="view"></router-view>
            <!-- <Crack></Crack> -->
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <Login></Login>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopNav from "../src/components/TopNav.vue";
import SideBar from "../src/components/SideBar.vue";
import Login from "../src/views/LoginPage.vue";
// import Crack from "../src/views/Crack.vue";
export default {
  name: "app",
  components: {
    TopNav,
    SideBar,
    Login,
    // Location,
    // Crack,
  },
  computed: {
    ...mapGetters("application", ["getIsActive"]),
  },
  data() {
    return {
      display: false,
    };
  },
  mounted() {
    if (localStorage.getItem("user")) {
      this.display = true;
    }
  },
};
</script>
<style scoped>
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
  padding: 10px;
}
.main-layout {
  width: 100%;
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
</style>
