<template>
  <div>
    <TopNav></TopNav>
    <div class="p-grid">
      <div class="p-col-2"></div>
      <div class="p-col-8">
        <Location></Location>
      </div>
      <div class="p-col-2"></div>
    </div>
  </div>
</template>

<script>
import TopNav from "../src/views/TopNav.vue";
import Location from "../src/views/Location.vue";

export default {
  components: {
    TopNav,
    Location,
  },
};
</script>
