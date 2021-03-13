<template>
  <div class="side-bar-layout">
    <div>
      <div class="layout-profile">
        <ul v-if="!staff">
          <div>
            <img src="../asset/bcd2.png" class="logo" />
            <span class="appName">BCD System</span>
          </div>
          <li>
            <button class="p-link">
              <a @click="$router.push('/users')"
                ><i class="pi pi-fw pi-users"></i
                ><span v-if="role === 'Manager'">Staff</span
                ><span v-else>Users</span></a
              >
            </button>
          </li>
          <li>
            <button class="p-link">
              <a @click="$router.push('/cracks')"
                ><i class="pi pi-fw pi-exclamation-triangle"></i
                ><span>Cracks</span></a
              >
            </button>
          </li>
          <li>
            <button class="p-link">
              <a @click="$router.push('/locations')"
                ><i class="pi pi-fw pi-map-marker"></i><span>Locations</span></a
              >
            </button>
          </li>
          <li>
            <button class="p-link">
              <a @click="$router.push('/maintenanceOrders')"
                ><i class="pi pi-fw pi-shopping-cart"></i
                ><span>Maintenance Orders</span></a
              >
            </button>
          </li>
          <li>
            <button class="p-link">
              <a @click="$router.push('/maintenanceWorkers')"
                ><i class="pi pi-fw pi-users"></i
                ><span>Maintenance Workers</span></a
              >
            </button>
          </li>
        </ul>
        <ul v-else>
          <li>
            <button class="p-link">
              <a @click="$router.push('/upload')"
                ><i class="pi pi-fw pi-upload"></i><span>Upload</span></a
              >
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  width: 45px;
  height: 45x;
  margin-top: 5px;
  margin-left: 5px;
}
.appName {
  margin-left: 7px;
  margin-top:20px;
  font-weight: bold;
  color: #0062d1;
}
span {
  position: absolute;
  margin-left: 25px;
  margin-top: 27px;
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
.p-link {
  display: inline-block;
  width: 100%;
  height: 4em;
  color: #293241;
  text-decoration: none;
}
.p-link:hover {
  text-decoration: none;
  color: #0062d1;
}
.p-link i {
  padding-left: 7%;
  padding-top: 25px;
  font-size: 24px;
}
.side-bar-layout:hover {
  width: 14em;
  opacity: 1;
}
</style>
