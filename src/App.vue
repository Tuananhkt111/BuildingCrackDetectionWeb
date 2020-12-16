<template>
  <div>
    <TopNav></TopNav>
    <p />
    <div class="p-grid">
      <div class="p-col-12">
        <!-- <Location></Location> -->
        <Cracks></Cracks>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from "../src/views/TopNav.vue";
// import Location from "../src/views/Location.vue";
import Cracks from "../src/views/Cracks.vue";
export default {
  name: "app",
  components: {
    TopNav,
    // Location,
    Cracks
  },
};
</script>
