<template>
  <div class="side-bar-layout">
    <!-- <div
      class="img-container p-d-flex p-flex-column p-ai-center p-jc-center p-shadow-2"
    >
      <img src="assets/icons8-admin-settings-male-100.png" />
      <div class="admin-container">
        User's Name
      </div>
    </div> -->
    <div class="layout-profile">
      <div>
        <img src="assets/icons8-admin-settings-male-100.png" alt="" />
      </div>
      <button class="p-link layout-profile-link" @click="onClick">
        <span class="username">Claire Williams</span>
        <i class="pi pi-fw pi-cog"></i>
      </button>
      <transition name="layout-submenu-wrapper">
        <ul v-show="expanded">
          <li>
            <button class="p-link">
              <a href="/account"><i class="pi pi-fw pi-user"></i><span>Account</span></a>
            </button>
          </li>
          <li>
            <button class="p-link">
              <a href="/notis"><i class="pi pi-fw pi-inbox"></i><span>Notifications</span
              ><span class="menuitem-badge">2</span></a>
            </button>
          </li>
          <li>
            <button class="p-link" @click="logOut">
              <i class="pi pi-fw pi-power-off"></i><span>Logout</span>
            </button>
          </li>
        </ul>
      </transition>
    </div>
    <div
      class="layout-menu-icon p-d-flex p-flex-column p-ai-center p-jc-evenly p-mt-3"
    >
      <div class="menu-item p-flex p-jc-center">
        <a href="../locations"
          ><i class="pi pi-table icon-menu"></i><span>Locations</span></a
        >
      </div>
      <div class="menu-item p-flex p-jc-center">
        <a href="../cracks"
          ><i class="pi pi-table icon-menu"></i><span>Cracks</span></a
        >
      </div>
      <div class="menu-item p-flex p-jc-center">
        <a href="../maintenanceWorkers">
          <i class="pi pi-table icon-menu"></i
          ><span>Maintenance Workers</span></a
        >
      </div>
      <div class="menu-item p-flex p-jc-center">
        <a href="../maintenanceOrders"
          ><i class="pi pi-table icon-menu"></i
          ><span>Maintenance Orders</span></a
        >
      </div>
      <div class="menu-item p-flex p-jc-center">
        <a href="../users"
          ><i class="pi pi-table icon-menu"></i><span>Users</span></a
        >
      </div>
    </div>
  </div>
</template>
<script>
import userApi from "../apis/user.js";
export default {
  components: {},
  data() {
    return {
      expanded: false,
    };
  },
  methods: {
    onClick(event) {
      this.expanded = !this.expanded;
      event.preventDefault();
    },
    logOut(){
      userApi.logout();
      this.$router.push("/login");
    },
  },
};
</script>
<style scoped>
.layout-profile {
    text-align: center;
    padding: 20px 0;
}
.side-bar-layout {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 450;
  position: fixed;
  width: 250px;
  height: 100%;
  z-index: 999;
  overflow-y: auto;
}

.layout-profile .layout-profile-link {
    color: rgb(44, 24, 24);
}

.layout-profile ul {
    background-color: #f6f8fc;
    list-style-type: none;
    padding: 0;
    margin: 0;
}

li {
    display: list-item;
    text-align: -webkit-match-parent;
}

ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
}

.layout-profile ul li button {
    width: 100%;
    padding: 1em;
    border: 0 none;
    border-radius: 0;
    cursor: pointer;
    -webkit-transition: color .2s;
    transition: color .2s;
}

.layout-sidebar-dark .layout-profile ul li button {
    color: #fff;
}
.layout-profile ul li button {
    width: 100%;
    padding: 1em;
    border: 0 none;
    border-radius: 0;
    cursor: pointer;
    -webkit-transition: color .2s;
    transition: color .2s;
}
.p-link {
    text-align: left;
    background-color: transparent;
    margin: 0;
    padding: 0;
    border: 0;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.layout-profile ul li button i {
    vertical-align: middle;
}

.pi {
    font-family: primeicons;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.layout-profile ul li button span {
    margin-left: .25em;
    vertical-align: middle;
}

.menuitem-badge {
    display: inline-block;
    margin-left: 4px;
    font-size: 10px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    color: #fff;
    background-color: red;
    border-radius: 50%;
}
a:hover, a:visited, a:link, a:active
{
    text-decoration: none;
}
a {
  color: black;
}
.menu-item:hover {
  background-color: rgb(236, 236, 236);
}
.menu-item {
  width: 100%;
  transition: all 0.4s;
  cursor: pointer;
}
.icon-menu {
  margin: 12px 15px 12px 40px;
}
</style>
