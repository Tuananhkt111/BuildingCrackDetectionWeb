<template>
  <div class="side-bar-layout">
    <div>
      <div class="layout-profile">
        <ul>
          <div class="p-mb-4">
            <img src="../asset/bcd2.png" class="logo" />
            <span class="appName">BCD System</span>
          </div>
          <li v-if="!staff">
            <router-link to="/dashboard" tag="li" class="t-link nav-btn">
              <a class="a-link">
                <i class="pi pi-fw pi-chart-line"></i>
                <span>Dashboard</span>
              </a>
            </router-link>
          </li>
          <li>
            <router-link to="/cracks" tag="li" class="t-link nav-btn">
              <a class="a-link">
                <i class="pi pi-fw pi-exclamation-triangle"></i>
                <span>Cracks</span>
              </a>
            </router-link>
          </li>
          <li v-if="!staff">
            <router-link to="/users" tag="li" class="t-link nav-btn">
              <a class="a-link">
                <i class="pi pi-fw pi-users"></i>
                <span v-if="role === 'Manager'">Staffs</span>
                <span v-else>Users</span>
              </a>
            </router-link>
          </li>
          <li v-if="!staff">
            <router-link to="/areas" tag="li" class="t-link nav-btn">
              <a class="a-link">
                <i class="pi pi-fw pi-map-marker"></i>
                <span>Areas</span>
              </a>
            </router-link>
          </li>
          <li>
            <router-link
              to="/repair-records"
              tag="li"
              class="t-link nav-btn"
            >
              <a class="a-link">
                <i class="pi pi-fw pi-calendar-minus"></i>
                <span>Repair Records</span>
              </a>
            </router-link>
          </li>
          <li>
            <router-link
              to="/repairers"
              tag="li"
              class="t-link nav-btn"
            >
              <a class="a-link">
                <i class="pi pi-fw pi-users"></i>
                <span >Repairers</span>
              </a>
            </router-link>
          </li>
          <li>
            <router-link
              to="/detection-results"
              tag="li"
              class="t-link nav-btn"
            >
              <a class="a-link">
                <i class="pi pi-fw pi-video"></i>
                <span>Detection Results</span>
              </a>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import webRole from "../util/webRole.js";
export default {
  components: {},
  data() {
    return {
      role: null,
      staff: false
    };
  },
  created() {
    this.role = JSON.parse(localStorage.getItem("user")).role;
  },
  mounted() {
    if(this.role == webRole.STAFF_ROLE){
      this.staff = true;
    }
  },
};
</script>
<style scoped>
.logo {
  width: 45px;
  height: 45x;
  margin-top: 5px;
  margin-left: 5px;
}
.appName {
  margin-left: 7px;
  margin-top: 20px;
  font-weight: bold;
  color: #007dfe;
}
span {
  position: absolute;
  padding-left: 14px;
}
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.side-bar-layout {
  position: fixed;
  top: 0;
  overflow: hidden;
  transition: all 0.3s ease-in;
  width: 15em;
  height: 100%;
  background: white;
  z-index: 2;
}
.side-bar-layout ul {
  position: sticky;
  top: 3.5em;
  padding: 0;
  width: 15em;
}
.side-bar-layout {
  width: 3.5em;
  left: 0;
}
.t-link {
  display: inline-block;
  width: 100%;
  height: 4em;
  color: #414b5c;
  text-decoration: none;
  outline: none;
  text-align: left;
  background-color: transparent;
  font-weight: 450;
  padding-left: 5%;
  border: 0;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
.t-link:hover {
  text-decoration: none;
  color: #007dfe;
}
.t-link i {
  font-size: 24px;
}
.side-bar-layout:hover {
  width: 15em;
  opacity: 1;
  box-shadow: 1px 0 5px -2px #888;
}

.router-link-active {
  color: #2170e7;
}

.router-link-active .a-link::before {
  background-color: #007dfe;
}

.a-link::before {
  content: "";
  width: 5px;
  height: 12px;
  display: block;
  border-radius: 0px 3px 3px 0px;
  padding-bottom: 10px;
  position: absolute;
  left: 0;
}
</style>
