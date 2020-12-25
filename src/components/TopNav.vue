<template>
  <div class="top-nav-layout">
    <div class="top-nav p-shadow-2 p-d-flex p-ai-center p-jc-between">
      <div class="p-d-flex p-ai-center logo-container">
        <img
          src="/assets/logoCrack.png"
          alt="logo"
          height="40"
          class="p-mr-2"
          style="padding-left:10px"
        />
        <span class="logo-text">BCD System</span>
        <div class="button-menu">
          <Button
            id="menu-button"
            icon="pi pi-angle-left"
            class="p-button-rounded"
            @click="toggleSidebar"
          ></Button>
        </div>
      </div>
      <div class="top-nav-right p-d-flex p-ai-center p-jc-between">
        <div
          class="btn-nav"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_tmenu"
        >
          <i class="pi pi-bell" style="cursor: pointer;"></i>
        </div>
        <TieredMenu
          id="overlay_tmenu"
          ref="menu"
          :model="items"
          :popup="true"
        />
        <div
          class="btn-nav p-mr-3"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_tmenu"
        >
          <i class="pi pi-user" style="cursor: pointer;"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TieredMenu from "primevue/tieredmenu";
import { mapActions, mapGetters } from "vuex";
import { userApi } from "../apis/user";
export default {
  components: {
    TieredMenu,
  },
  data() {
    return {
      items: [
        {
          label: "Profile",
        },
        {
          label: "Logout",
          command: () => {
            userApi.logout();
            this.$router.push("/login");
          },
        },
      ],
    };
  },
  methods: {
    ...mapActions("application", ["setIsActive"]),
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
    toggleSidebar() {
      this.setIsActive(!this.getIsActive);
    },
  },
  computed: {
    ...mapGetters("application", ["getIsActive"]),
  },
};
</script>
<style scoped>
.top-nav-layout {
  position: sticky;
  top: 0;
  z-index: 2;
}
.top-nav {
  background-color: #3fb57c;
  border: 0;
  border-radius: 0 0 3px 3px;
}
.logo-text {
  color: white;
  font-size: 26px;
}
.logo-container {
  background-color: #2a8358;
  padding: 0.8rem;
  box-shadow: 3px 0 6px rgba(0, 0, 0, 0.3);
}
.top-nav-right {
  color: white;
}
.btn-nav {
  padding: 1.5rem;
}
#menu-button {
  background-color: white;
  color: #3fb57c;
  right: -30px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.23), 0 3px 10px rgba(0, 0, 0, 0.16);
  transition: all 0.2s;
}
.inactive #menu-button {
  transform: rotate(180deg);
}
.active #menu-button {
  transform: rotate(0deg);
}
</style>
