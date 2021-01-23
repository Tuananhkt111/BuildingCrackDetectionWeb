<template>
  <div>
    <div class="loginpage">
      <div class="loginInfo">
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
        <InputText id="userName" v-model.trim="userName" required="true" />
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
    <Dialog
      v-model:visible="ChangePasswordDialog"
      :style="{ width: '350px' }"
      header="Change Password"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="newPassword">New Password</label>
        <Password v-model="newPassword" />
      </div>
      <div class="p-field">
        <label for="confirmPassword">Confirm Password</label>
        <Password v-model="confirmPassword" />
        <small class="p-invalid" v-if="newPassword != confirmPassword"
          >New Password and Confirm Password must be match.</small
        >
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="cancelChangePassword"
        />
        <Button
          label="Confirm"
          icon="pi pi-check"
          class="p-button-text"
          v-if="newPassword == confirmPassword"
          @click="changePassword"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { userApi } from "../apis/user";
import Toast from "primevue/toast";
import Password from "primevue/password";

export default {
  components: {
    Toast,
    Password,
  },
  data() {
    return {
      userName: "",
      password: "",
      newPassword: "",
      confirmPassword: "",
      ForgotPasswordDialog: false,
      ChangePasswordDialog: false,
    };
  },
  created() {},
  methods: {
    handleSubmit() {
      if (this.userName && this.password) {
        userApi
          .login(this.userName, this.password)
          .then((res) => {
            if (res.isNewUser) {
              this.ChangePasswordDialog = true;
            } else {
              this.$router.go();
            }
          })
          .catch((err) => {
            alert(err);
          });
      }
    },
    async changePassword() {
      if (this.newPassword != this.confirmPassword) {
        console.log(this.newPassword);
      } else {
        await userApi
          .changePassword(
            JSON.parse(localStorage.getItem("user")).userId,
            this.password,
            this.newPassword
          )
          .then(() => {
            this.$router.push("/");
          });
      }
    },
    forgotPassword() {
      this.userName = "";
      this.ForgotPasswordDialog = true;
    },

    async confirmForgotPassword() {
      await userApi
        .forgotPassword(this.userName)
        .catch((err) => console.log(err))
        .then((res) =>
          this.$toast.add({
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
.loginpage {
  width: 100%;
  height: 100%;
  text-align: center;
}
.loginInfo {
  display: inline-block;
  width: 400px;
}
</style>
