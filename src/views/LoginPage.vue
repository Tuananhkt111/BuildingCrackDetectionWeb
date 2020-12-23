<template>
  <div class="">
    <div>
      <form @submit.prevent="handleSubmit()">
        <h2 style="text-align: center">Login Page</h2>
        <div class="container">
          <label for="userName"><b>User Name</b></label>
          <InputText
            type="text"
            v-model="userName"
            class="p-column-filter"
            placeholder="userName"
            required
          />
          <label for="password"><b>Password</b></label>
          <InputText
            type="password"
            v-model="password"
            class="p-column-filter"
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
          <!-- <label>
            <input type="checkbox" checked="checked" name="remember" /> Remember
            me
            <span class="psw"><a href="#">Forgot password?</a></span>
          </label> -->
        </div>
      </form>
    </div>
    <Toast/>
  </div>
</template>

<script>
import { userApi } from "../apis/user";
import Toast from "primevue/toast";

export default {
  components: {
    Toast,
  },
  data() {
    return {
      userName: "",
      password: "",
    };
  },
  created() {
  },
  methods: {
    handleSubmit() {
      if (this.userName && this.password) {
        userApi
          .login(this.userName, this.password)
          .then(() => {
            this.$router.push("/");
          })
          .catch((err) => {
            alert(err);
          });
      }
    },
  },
};
</script>

<style>
body {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
