<template>
  <div class="p-grid">
    <div class="top">
      <div id="profileImage">{{ text }}</div>
    </div>
    <p class="name">{{ getUser.name }}</p>
    <p><span class="header">Full Name:</span>{{ getUser.userName }}</p>
    <p><span class="header">Full Name:</span>{{ getUser.phoneNumber }}</p>
    <p><span class="header">Full Name:</span>{{ getUser.address }}</p>
    <p><span class="header">Full Name:</span>{{ getUser.role }}</p>
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
.top{
  padding-top: 30px ;
  width: 100%;
  height: 100%;
}
.header {
  font-weight: bold;
}
.name {
  padding-top: 5px ;
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
