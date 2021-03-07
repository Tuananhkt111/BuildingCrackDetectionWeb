<template>
  <div class="p-grid" style="height: 550px">
    <div class="p-col-7 left"></div>
    <div class="p-col-5 right">
      <div id="profileImage">{{ text }}</div>
      <p class="title">{{ getUser.name }}</p>
      <p><span class="header">Full Name:</span>{{ getUser.userName }}</p>
      <p><span class="header">Full Name:</span>{{ getUser.phoneNumber }}</p>
      <p><span class="header">Full Name:</span>{{ getUser.address }}</p>
      <p><span class="header">Full Name:</span>{{ getUser.role }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters("user", ["getUser"]),
  },

  data() {
    return {
      text: null,
    };
  },
  created() {
    if (this.getUser == null) {
      this.setUser(JSON.parse(localStorage.getItem("user")));
    }
    this.text = this.getUser.userName.charAt(0);
  },
  methods: {
    ...mapActions("user", ["setUser"]),
  },
};
</script>

<style scoped>
.left {
  border: 1px;
  border-color: black;
}
.right {
  border: 1px solid black;
  border-radius: 5px;
}
.header {
  font-weight: bold;
}
.title {
  font-weight: bold;
  font-size: 1.5rem;
  text-align: center;
}
#profileImage {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #512da8;
  font-size: 45px;
  color: #fff;
  text-align: center;
  line-height: 100px;
  margin: 20px 0;
}
</style>
