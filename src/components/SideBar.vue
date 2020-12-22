<template>
  <div class="side-bar-layout">
    <div
      class="img-container p-d-flex p-flex-column p-ai-center p-jc-center p-shadow-2"
    >
      <img src="assets/icons8-admin-settings-male-100.png" />
      <div class="admin-container">
        User's Name
      </div>
    </div>
    <div
      class="layout-menu-icon p-d-flex p-flex-column p-ai-center p-jc-evenly p-mt-3"
    >
      <div class="menu-item p-flex p-jc-center">
        <a href="../locations"><i class="pi pi-table icon-menu"></i><span>Locations</span></a>
      </div>
      <div class="menu-item p-flex p-jc-center">
        <a href="../cracks"><i class="pi pi-table icon-menu"></i><span>Cracks</span></a>
      </div>
      <div class="menu-item p-flex p-jc-center">
        <a href="../maintenanceWorkers"> <i class="pi pi-table icon-menu"></i><span>Maintenance Workers</span></a>
      </div>
      <div class="menu-item p-flex p-jc-center">
        <a href="../maintenanceOrders"><i class="pi pi-table icon-menu"></i><span>Maintenance Orders</span></a>
      </div>
      <div class="menu-item p-flex p-jc-center">
        <a href="../users"><i class="pi pi-table icon-menu"></i><span>Users</span></a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
};
</script>
<style scoped>
.img-container {
  padding: 1rem;
}
.side-bar-layout {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 450;
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
