<template>
  <div class="p-grid">
    <div class="top">
      <div id="profileImage">{{ text }}</div>
    </div>
    <p class="name">{{ getUser.name }}</p>
    <div class="p-col-4"></div>
    <div class="p-col-3">
      <p class="header">Full Name</p>
      <p class="header">Phone Number</p>
      <p class="header">Address</p>
      <p class="header">Role</p>
    </div>
    <div class="p-col-2">
      <p class="content">{{ getUser.userName }}</p>
      <p class="content">{{ getUser.phoneNumber }}</p>
      <p class="content">{{ getUser.address }}</p>
      <p class="content">{{ getUser.role }}</p>
    </div>
    <div class="p-col-3"></div>
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
.top {
  padding-top: 30px;
  width: 100%;
  height: 100%;
}
.header {
  color: black;
  padding-bottom: 20px;
  font-weight: bold;
}
.content {
  padding-bottom: 20px;
  color: gray;
}
.name {
  padding-top: 5px;
  width: 100%;
  font-weight: bold;
  font-size: 1.4rem;
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
  margin: auto;
}
/* .content {
  font-family: Poppins;
} */
</style>
