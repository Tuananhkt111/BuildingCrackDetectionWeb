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
          <label>
            <span class="psw"
              ><a href="#" @click="forgotPassword">Forgot password?</a></span
            >
          </label>
        </div>
      </form>
    </div>
    <Toast />
    <Dialog
      v-model:visible="ForgotPasswordDialog"
      :style="{ width: '350px' }"
      header="Fogot Password"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="userName">User Name</label>
        <InputText
          id="userName"
          v-model.trim="userName"
          required="true"
        />
        <small class="p-invalid" v-if="userName == null"
          >Full Name is required.</small
        >
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="ForgotPasswordDialog = false"
        />
        <Button
          label="Confirm"
          icon="pi pi-check"
          class="p-button-text"
          @click="confirmForgotPassword"
        />
      </template>
    </Dialog>
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
      ForgotPasswordDialog : false,
    };
  },
  created() {},
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
    forgotPassword(){
      this.userName = "";
      this.ForgotPasswordDialog = true;
    },

    async confirmForgotPassword(){
      await userApi.forgotPassword(this.userName).catch((err) => console.log(err)).then(
        (res) => this.$toast.add({
            severity: "info",
            summary: res.data,
            life: 3000,
          })
        );
      this.ForgotPasswordDialog = false;
    },
  },
};
</script>

<style>
body {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
