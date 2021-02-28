<template>
  <div class="limitter">
    <div class="container-login100">
      <div class="wrap-login100">
        <form @submit.prevent="handleSubmit()">
          <span class="login100-form-title">Login Page</span>
          <div class="wrap-input100">
            <div class="p-float-label p-mb-5">
              <InputText
                id="username"
                type="text"
                v-model="userName"
                style="width: 270px"
              />
              <label>USER NAME</label>
            </div>
            <div class="p-float-label p-mb-3">
              <InputText
                id="pass"
                type="password"
                v-model="password"
                style="width: 270px"
              />
              <label>PASSWORD</label>
            </div>
            <!-- <Password v-model="value" weakLabel="Min is 8 character" mediumLabel="Must have one uppercase and one number" promptLabel="example: Pass1234" placeholder="New Password"/> -->
            <Button
              label="Login"
              type="submit"
              class="p-button-raised p-button-success p-button-text"
              style="width: 270px; float : left"
            />
            <br />
            <!-- <button type="submit">Login</button> -->
            <a
              href="#"
              @click="forgotPassword"
              style="float: right;text-decoration: none"
              class="p-mt-2"
              >Forgot password?</a
            >
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
import Button from "primevue/button";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Toast,
    Password,
    Button,
  },
  computed: {
    ...mapGetters("application", ["getIsActive", "getIsLogin"]),
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
    ...mapActions("application", ["setIsActive", "setIsLogin"]),

    async handleSubmit() {
      if (this.userName && this.password) {
        const res = await userApi.login(this.userName, this.password);
        if (res != null) {
          if (res.isNewUser) {
            this.ChangePasswordDialog = true;
          } else {
            this.setIsLogin(!this.getIsLogin);
            this.$router.push("/");
          }
        } else {
          this.$toast.add({
            severity: "warn",
            summary: "User or Password is wrong!! Try again ",
            life: 3000,
          });
        }
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
            this.$router.go();
          });
      }
    },
    forgotPassword() {
      this.userName = "";
      this.ForgotPasswordDialog = true;
    },
    cancelChangePassword() {
      this.ChangePasswordDialog = false;
    },
    async confirmForgotPassword() {
      await userApi
        .forgotPassword(this.userName)
        .catch((err) =>
          this.$toast.add({
            severity: "error",
            summary: err.data,
            life: 3000,
          })
        )
        .then((res) =>
          this.$toast.add({
            severity: "success",
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
  font-family: Poppins-Bold;
}
.limiter {
  width: 100%;
  margin: 0 auto;
}
.container-login100 {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  /* background: #f2f2f2; */
  background-image: url(../asset/background1.jpg);
}

.wrap-login100 {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  padding: 30px 55px 33px;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  -o-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  -ms-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
}
div {
  display: block;
}

.login100-form-title {
  display: block;
  font-family: Poppins-Bold;
  font-size: 30px;
  color: #333;
  line-height: 1.2;
  text-align: center;
  padding-bottom: 35px;
}
.wrap-input100 {
  font-family: Poppins-Bold;
  width: 100%;
}
</style>
