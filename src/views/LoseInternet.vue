<template>
  <img
    src="/assets/No-Internet.png"
    style="display: block; margin-left: auto; margin-right: auto;"
    @click="refresh"
  />
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions("application", ["setCheckOffline"]),
  },
  mounted() {
    this.setCheckOffline(true);
  },
};
</script>
