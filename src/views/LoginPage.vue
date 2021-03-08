<template>
  <div class="limitter">
    <div class="container-login100">
      <div class="p-grid wrap-login100">
        <div class="p-col-7" >
          <img src="/assets/4.jpg" style="width: 550px; height:500px" />
          <!-- <h2>Building Crack Detection</h2> -->
        </div>
        <form
          @submit.prevent="handleSubmit()"
          id="login"
          style="margin:auto"
          class="p-col-5 loginForm"
        >
          <span class="login100-form-title" style="font-weight: bold">Welcome to BCDSystem</span>
          <div class="wrap-input100">
            <div class="p-float-label p-mb-5">
              <InputText type="text" v-model="userName" style="width: 270px" />
              <label style="padding-left: 55px">Username</label>
            </div>
            <div class="p-float-label p-mb-3">
              <InputText
                type="password"
                v-model="password"
                style="width: 270px"
              />
              <label style="padding-left: 55px;">Password</label>
            </div>
            <!-- <Password v-model="value" weakLabel="Min is 8 character" mediumLabel="Must have one uppercase and one number" promptLabel="example: Pass1234" placeholder="New Password"/> -->
            <Button
              label="Login"
              type="submit"
              class="p-button-raised p-button-info"
              style="width: 270px;"
            />
            <br />
            <!-- <button type="submit">Login</button> -->
            <a
              @click="forgotPassword"
              style="float: right; padding-right:55px; color: blue"
              class="p-mt-2"
              >Forgot password?</a
            >
          </div>
        </form>
        <div id="forgotPass" class="p-col-5 forgotForm" style="padding-top:150px">
          <span class="login100-form-title" style="font-weight: bold">Forgot Password</span>
          <div class="wrap-input100">
            <div class="p-field">
              <div class="p-float-label p-mb-5">
                <InputText
                  type="text"
                  v-model="userName"
                  style="width: 270px"
                />
                <label style="padding-left:55px">USER NAME</label>
              </div>
            </div>
          </div>
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-raised p-button-info p-mr-5"
            @click="cancelForgotPassword"
          />
          <Button
            label="Confirm"
            icon="pi pi-check"
            class="p-button-raised p-button-info"
            @click="confirmForgotPassword"
          />
        </div>
        <div id="resetPass" class="resetPassFrom">
          <ForgotPassword></ForgotPassword>
        </div>
      </div>
    </div>
    <Toast position="bottom-right"/>
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
import ForgotPassword from "../views/ForgotPassword.vue";

export default {
  components: {
    Toast,
    Password,
    Button,
    ForgotPassword,
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
      ChangePasswordDialog: false,
    };
  },
  created() {},
  mounted() {
    const checkForgotPass = /\/users\/[a-zA-Z]+\/forgotpass/.test(
      window.location.pathname
    );
    console.log(checkForgotPass);
    if (checkForgotPass && localStorage.getItem("user") == null) {
      this.waithide("login", "resetPass");
    }
  },
  methods: {
    doSomething() {
      console.log("AA");
    },
    ...mapActions("application", ["setIsActive", "setIsLogin"]),

    ...mapActions("user", ["setUser"]),

    async handleSubmit() {
      if (this.userName && this.password) {
        const res = await userApi.login(this.userName, this.password);
        if (res != null) {
          if (res.isNewUser) {
            this.ChangePasswordDialog = true;
          } else {
            this.setIsLogin(!this.getIsLogin);
            this.setUser(JSON.parse(res));
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
      this.waithide("login", "forgotPass");
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
      this.waithide("forgotPass", "login");
    },
    cancelForgotPassword() {
      this.userName = "";
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
.limiter {
  width: 100%;
  margin: auto;
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
  border-radius: 10px;
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
  font-family:  Poppins;
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

</style>
