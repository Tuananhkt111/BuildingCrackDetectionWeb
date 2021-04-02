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
            >Welcome to BCDSystem</span
          >
          <div class="wrap-input100">
            <div class="p-float-label p-mb-5">
              <InputText
                type="text"
                v-model="userName"
                style="width: 270px"
                v-on:keyup.enter="handleSubmit"
              />
              <label style="padding-left: 55px">Username</label>
              <p class="invalid">{{ errors.userName }}</p>
            </div>
            <div class="p-float-label p-mb-5 p-mt-2">
              <InputText
                type="password"
                v-model="password"
                style="width: 270px"
                v-on:keyup.enter="handleSubmit"
              />
              <label style="padding-left: 55px;">Password</label>
              <p class="invalid">{{ errors.password }}</p>
            </div>
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
              <div class="p-float-label p-mb-4">
                <InputText
                  type="text"
                  v-model="userName"
                  style="width: 270px"
                />
                <label style="padding-left:55px">USER NAME</label>
                <p class="invalid">{{ errors.userName }}</p>
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
            >Sign in <i class="pi pi-arrow-right" style=""></i
          ></span>
        </div>
        <div id="resetPass" class="resetPassFrom">
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
      <div class="p-field">
        <label for="newPassword">New Password</label>
        <InputText type="password" v-model="confirmPassword" maxlength="30" />
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
    });

    const { errors, meta, handleReset, validate } = useForm({
      validationSchema: schema,
    });

    const { value: userName } = useField("userName");
    const { value: password } = useField("password");

    return {
      userName,
      password,
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
      newPassword: "",
      confirmPassword: "",
      ChangePasswordDialog: false,
      isLoading: false,
    };
  },
  created() {},
  mounted() {
    const checkForgotPass = /\/users\/[a-zA-Z]+\/forgotpass/.test(
      window.location.pathname
    );
    if (checkForgotPass && localStorage.getItem("user") == null) {
      this.waithide("login", "resetPass");
    }
  },
  methods: {
    ...mapActions("application", ["setIsActive", "setIsLogin"]),

    ...mapActions("user", ["setUser"]),

    async handleSubmit() {
      if (this.meta.valid && this.userName != null && this.password != null) {
        localStorage.clear();
        this.isLoading = true;
        if (this.userName && this.password) {
          const res = await userApi.login(this.userName, this.password);
          if (res != null) {
            var user = JSON.parse(res);
            if (user.isNewUser) {
              this.ChangePasswordDialog = true;
              this.setUser(JSON.parse(res));
              this.isLoading = false;
            } else {
              this.setIsLogin(!this.getIsLogin);
              this.setUser(JSON.parse(res));
              this.isLoading = false;
              if(user.role === "Staff")
                this.$router.push("/cracks");
              else
                this.$router.push("/dashboard");
            }
          } else {
            this.isLoading = false;
            this.$toast.add({
              severity: "warn",
              summary: "Sign-in Failed !!",
              life: 3000,
            });
          }
        }
      } else {
        this.validate();
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
          .then((res) => {
            if (res.status == 200) {
              this.$toast.add({
                severity: "success",
                summary: "Change Password Success !!",
                life: 3000,
              });
              this.ChangePasswordDialog = false;
              this.setIsLogin(!this.getIsLogin);
              this.$router.push("/");
            } else {
              this.$toast.add({
                severity: "error",
                summary: "Change Password Failed !!",
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
      if (this.userName != null) {
        this.isLoading = true;
        await userApi
          .forgotPassword(this.userName)
          .catch(() => {
            this.$toast.add({
              severity: "error",
              summary: "ERROR",
              detail: "Your Account is'nt existed!",
              life: 3000,
            });
            this.isLoading = false;
          })
          .then((res) => {
            if (res.status == 200) {
              this.$toast.add({
                severity: "success",
                summary: res.data,
                life: 3000,
              });
              this.isLoading = false;
            } else {
              this.$toast.add({
                severity: "error",
                summary: "ERROR",
                detail: "Your Account is'nt existed!",
                life: 3000,
              });
              this.isLoading = false;
            }
          });
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
  display: none;
  transition: all 0.3s;
}
.invalid {
  color: red;
  font-size: 0.8rem;
  position: absolute;
  left: 60px;
}
</style>
