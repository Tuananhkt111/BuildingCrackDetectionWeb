<template>
  <div>
    <top-nav></top-nav>
    <div class="p-grid">
        <div class="p-col-3">
            <p>CCCCCCCC</p>
        </div>
        <div class="p-col-9">
            <location></location>
        </div>
    </div>
  </div>
</template>

<script>
import TopNav from "../src/views/TopNav.vue";
import Location from "..src/views/Location.vue";
export default {
  components: {
    TopNav,
    Location,
  },
};
</script>
