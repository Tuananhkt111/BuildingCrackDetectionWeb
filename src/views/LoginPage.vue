<template>
  <div class="limitter">
    <div class="container-login100">
      <div class="p-grid wrap-login100">
        <div class="p-col-7">
          <img src="/assets/4.jpg" style="width: 550px; height:500px" />
          <!-- <h2>Building Crack Detection</h2> -->
        </div>
        <LoadingScreen
          :isLoading="isLoading"
          class="p-col-5"
          style="paddint-right:20px"
        />
        <div
          id="login"
          style="margin:auto"
          class="p-col-5 loginForm"
          v-if="!isLoading"
        >
          <span class="login100-form-title" style="font-weight: bold"
            >Welcome to BCD System</span
          >
          <div class="wrap-input100">
            <div style="margin-bottom:25px">
              <p class="input-title">Username</p>
              <InputText
                type="text"
                v-model="userName"
                style="width: 270px"
                v-on:keyup.enter="handleSubmit"
              />
            </div>
            <p class="invalid" style="top:-25px ; padding-left:80px">
              {{ errors.userName }}
            </p>
            <div style="margin-bottom:20px">
              <p class="input-title">Password</p>
              <InputText
                type="password"
                v-model="password"
                style="width: 270px"
                v-on:keyup.enter="handleSubmit"
              />
            </div>
            <p class="invalid" style="padding-left:80px">
              {{ errors.password }}
            </p>
            <Button
              label="Login"
              @click="handleSubmit"
              class="p-button-raised p-button-info"
              style="width: 270px;"
            />
            <a
              @click="forgotPassword"
              style="float: right; padding-right:55px; color: blue; cursor:pointer"
              class="p-mt-2"
              >Forgot password?</a
            >
          </div>
        </div>
        <div
          id="forgotPass"
          class="p-col-5 forgotForm"
          style="padding-top:150px"
          v-if="!isLoading"
        >
          <span class="login100-form-title" style="font-weight: bold"
            >Forgot Password</span
          >
          <div class="wrap-input100">
            <div class="p-field">
              <div>
                <p class="input-title">Username</p>
                <InputText
                  type="text"
                  v-model="userName"
                  style="width: 270px"
                  v-on:keyup.enter="confirmForgotPassword"
                />
                <p class="invalid-forgotPass">{{ errors.userName }}</p>
              </div>
            </div>
          </div>
          <Button
            label="Confirm"
            icon="pi pi-check"
            class="p-button-raised p-button-info"
            @click="confirmForgotPassword"
          />
          <span
            style="padding-left:30px; color: blue; display: inline-block; vertical-align: middle; line-height: 40px; cursor:pointer"
            @click="cancelForgotPassword"
            >Log in <i class="pi pi-arrow-right" style=""></i
          ></span>
        </div>
        <div id="resetPass" class="p-col-5 resetPassFrom">
          <ForgotPassword></ForgotPassword>
        </div>
      </div>
    </div>
    <Toast position="bottom-right" />
    <Dialog
      v-model:visible="ChangePasswordDialog"
      :style="{ width: '350px' }"
      header="Change Password"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label for="newPassword">New Password</label>
        <InputText type="password" v-model="newPassword" maxlength="30" />
      </div>
      <p class="invalid-password">{{ errors.newPassword }}</p>
      <div class="p-field">
        <label for="confirmPassword">Confirm Password</label>
        <InputText type="password" v-model="confirmPassword" maxlength="30" />
      </div>
      <p class="invalid-password">{{ errors.confirmPassword }}</p>
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
          @click="changePassword"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { userApi } from "../apis/user";
import Toast from "primevue/toast";
import Button from "primevue/button";
import { mapGetters, mapActions } from "vuex";
import ForgotPassword from "../views/ForgotPassword.vue";
import LoadingScreen from "../components/PreLoader.vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import contentNoti from "../util/contentNoti.js";

export default {
  setup() {
    const schema = yup.object({
      userName: yup
        .string()
        .required()
        .max(10)
        .label("User Name"),
      password: yup
        .string()
        .required()
        .max(30)
        .label("Password"),
      newPassword: yup
        .string()
        .max(30)
        .label("New Password")
        .required()
        .matches(
          /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "Password must contain at least 8 characters, one uppercase, one number"
        ),
      confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("newPassword"), null], "Password is not matched"),
    });

    const { errors, meta, handleReset, validate } = useForm({
      validationSchema: schema,
    });

    const { value: userName } = useField("userName");
    const { value: password } = useField("password");
    const { value: newPassword } = useField("newPassword");
    const { value: confirmPassword } = useField("confirmPassword");

    return {
      userName,
      password,
      newPassword,
      confirmPassword,
      errors,
      meta,
      validate,
      handleReset,
    };
  },
  components: {
    Toast,
    Button,
    ForgotPassword,
    LoadingScreen,
  },
  computed: {
    ...mapGetters("application", ["getIsActive", "getIsLogin"]),
  },
  data() {
    return {
      ChangePasswordDialog: false,
      isLoading: false,
    };
  },
  async created() {},
  mounted() {
    const checkForgotPass = /\/users\/[a-zA-Z]+/.test(window.location.pathname);
    if (checkForgotPass && localStorage.getItem("user") == null) {
      this.waithide("login", "resetPass");
    }
  },
  methods: {
    ...mapActions("application", [
      "setIsActive",
      "setIsLogin",
      "setCheckOffline",
    ]),

    ...mapActions("user", ["setUser"]),

    async handleSubmit() {
      if (
        this.userName != null &&
        this.password != null &&
        this.errors.userName == null &&
        this.errors.password == null
      ) {
        this.isLoading = true;
        if (this.userName && this.password) {
          await userApi
            .login(this.userName, this.password)
            .then((res) => {
              if (res == null || res.status == 403) {
                this.setCheckOffline(true);
              } else if (res != null) {
                var user = JSON.parse(res);
                if (user.isNewUser) {
                  this.ChangePasswordDialog = true;
                  this.setUser(JSON.parse(res));
                  this.isLoading = false;
                } else {
                  this.setIsLogin(!this.getIsLogin);
                  this.setUser(JSON.parse(res));
                  this.isLoading = false;
                  if (user.role === "Staff") this.$router.push("/cracks");
                  else this.$router.push("/dashboard");
                }
              } else {
                this.isLoading = false;
                this.$toast.add({
                  severity: "warn",
                  detail: contentNoti.USER_LOGIN_FAILED,
                  life: 3000,
                });
              }
            })
            .catch(() => {
              this.isLoading = false;
              this.$toast.add({
                severity: "warn",
                detail: contentNoti.USER_LOGIN_FAILED,
                life: 3000,
              });
            });
        }
      } else {
        this.validate();
      }
    },
    async changePassword() {
      if (
        this.newPassword != this.confirmPassword &&
        this.errors.newPassword != null &&
        this.errors.confirmPassword != null &&
        this.newPassword == "" &&
        this.newPassword == null
      ) {
        this.validate();
      } else {
        await userApi
          .changePassword(
            JSON.parse(localStorage.getItem("user")).userId,
            this.password,
            this.newPassword
          )
          .then((res) => {
            if (res == null || res.status == 403) {
              this.setCheckOffline(true);
            } else if (res.status == 200) {
              this.$toast.add({
                severity: "success",
                detail: contentNoti.USER_CHANGE_PASSWORD_SUCCESS,
                life: 3000,
              });
              this.ChangePasswordDialog = false;
              this.setIsLogin(!this.getIsLogin);
              this.$router.push("/");
            } else {
              this.$toast.add({
                severity: "error",
                detail: contentNoti.USER_CHANGE_PASSWORD_FAILED,
                life: 3000,
              });
              this.ChangePasswordDialog = false;
            }
          });
      }
    },
    forgotPassword() {
      this.handleReset();
      this.waithide("login", "forgotPass");
    },
    cancelChangePassword() {
      this.handleReset();
      this.ChangePasswordDialog = false;
    },
    async confirmForgotPassword() {
      if (this.userName != null && this.errors.userName == null) {
        this.isLoading = true;
        await userApi
          .forgotPassword(this.userName)
          .catch(() => {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.USER_CHANGE_CONFIRM_FORGOTPASSWORD_FAILED,
              life: 3000,
            });
            this.isLoading = false;
          })
          .then((res) => {
            if (res == null || res.status == 403) {
              this.setCheckOffline(true);
            } else if (res.status == 200) {
              this.$toast.add({
                severity: "success",
                summary: contentNoti.SUCCESS_SUMMARY,
                detail: res.data,
                life: 3000,
              });
            } else {
              this.$toast.add({
                severity: "error",
                summary: contentNoti.FAIL_SUMMARY,
                detail: contentNoti.USER_CHANGE_CONFIRM_FORGOTPASSWORD_FAILED,
                life: 3000,
              });
              this.isLoading = false;
            }
          });
        this.handleReset();
        this.isLoading = false;
        this.waithide("forgotPass", "login");
      } else {
        this.validate();
      }
    },
    cancelForgotPassword() {
      this.handleReset();
      this.waithide("forgotPass", "login");
    },
    waithide(div1, div2) {
      var obj = document.getElementById(div1);
      obj.style.opacity = "0";
      window.setTimeout(function removethis() {
        obj.style.display = "none";
      }, 300);
      var obj2 = document.getElementById(div2);
      obj2.style.opacity = "1";
      window.setTimeout(function show() {
        obj2.style.display = "block";
      }, 300);
    },
  },
};
</script>

<style>
body {
  font-family: "Poppins", Helvetica, Arial;
}
.limitter {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 10;
}
.container-login100 {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /* padding: 15px; */
  background: #b9cee4;
  /* background-image: url(../asset/background1.jpg); */
}

.wrap-login100 {
  width: 70%;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
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
  color: #212529;
  background-color: #fff;
}
div {
  display: block;
}

.login100-form-title {
  display: block;
  font-family: Poppins;
  font-size: 23px;
  color: #333;
  line-height: 1.2;
  text-align: center;
  padding-bottom: 35px;
}
.wrap-input100 {
  text-align: center;
  justify-content: center;
  align-items: center;
  font-family: Poppins;
  margin-bottom: 30px;
  width: 100%;
}
.loginForm {
  opacity: 1;
  transition: all 0.3s;
}
.forgotForm {
  text-align: center;
  justify-content: center;
  align-items: center;
  font-family: Poppins;
  display: none;
  transition: all 0.3s;
}
.resetPassFrom {
  text-align: center;
  justify-content: center;
  align-items: center;
  font-family: Poppins;
  display: none;
  transition: all 0.3s;
}
.invalid {
  color: red;
  text-align: left !important;
  font-size: 0.8rem;
  top: -20px;
  position: relative;
}
.invalid-password {
  color: red;
  text-align: left !important;
  font-size: 0.8rem;
  top: -15px;
  position: relative;
}
.invalid-forgotPass {
  color: red;
  text-align: left !important;
  font-size: 0.8rem;
  padding-left: 80px;
  position: absolute;
}
.input-title {
  text-align: left !important;
  font-weight: 600;
  padding-left: 80px;
}
</style>
