<template>
  <div>
    <div v-if="ChangePassworDialog" style="padding-top: 100px">
      <span class="login100-form-title" style="font-weight: bold"
        >Forgot Password</span
      >
      <div class="p-float-label p-mb-5">
        <InputText
          id="newPasswordForgot"
          type="password"
          v-model="newPasswordForgot"
          style="width: 270px"
          @input="checkValidate"
        />
        <label>New Password</label>
        <p class="invalid">{{ errorValid.newPasswordValid }}</p>
      </div>
      <div class="p-float-label" style="margin-top:35px">
        <InputText
          id="confirmPassword"
          type="password"
          v-model="confirmPassword"
          style="width: 270px"
          @input="checkValidate"
        />
        <label>Confirm Password</label>
        <p class="invalid">{{ errorValid.confirmPasswordValid }}</p>
        <br />
      </div>
      <Button
        label="Change Password"
        class="p-button-raised p-button-info"
        @click="confirmChangePassword"
        style="width: 270px; margin-top:20px"
      />
    </div>
    <Toast position="bottom-right" />
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";
import userApi from "../apis/user.js";
import contentNoti from "../util/contentNoti.js";

export default {
  components: {
    InputText,
    Toast,
  },
  data() {
    return {
      newPasswordForgot: "",
      confirmPassword: "",
      checkValid: false,
      errorValid: {
        newPasswordValid: "",
        confirmPasswordValid: "",
      },
      id: "",
      token: "",
      ChangePassworDialog: true,
      successForgotPass: false,
      countDown: 10,
    };
  },
  methods: {
    async confirmChangePassword() {
      this.checkValidate();
      if (
        this.errorValid.newPasswordValid === "" &&
        this.errorValid.confirmPasswordValid === ""
      ) {
        console.log("AA");
        await userApi
          .changeForgotPassword(
            this.$route.params.id,
            this.$route.query.token,
            this.newPasswordForgot
          )
          .then((res) => {
            if (res.status == 200) {
              this.$toast.add({
                severity: "success",
                summary: contentNoti.SUCCESS_SUMMARY,
                detail: contentNoti.USER_FORGOTPASS_SUCCESS,
                life: 3000,
              });
              this.ChangePassworDialog = false;
              window.location = "/";
            } else {
              this.$toast.add({
                severity: "error",
                summary: contentNoti.FAIL_SUMMARY,
                detail: contentNoti.USER_FORGOTPASS_FAILED,
                life: 3000,
              });
            }
          });
      }
    },
    checkValidate() {
      if (
        !/^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(
          this.newPasswordForgot
        )
      ) {
        this.errorValid.newPasswordValid =
          "Password must contain at least 8 characters, one uppercase, one number";
      } else if (this.newPasswordForgot.length > 30) {
        this.errorValid.newPasswordValid = "Max is 30 characters";
      } else {
        this.errorValid.newPasswordValid = "";
      }
      if (this.newPasswordForgot !== this.confirmPassword) {
        this.errorValid.confirmPasswordValid = "Passwords don't match";
      } else {
        this.errorValid.confirmPasswordValid = "";
      }
    },
  },
};
</script>

<style scoped>
.login100-form-title {
  display: block;
  font-family: Poppins;
  font-size: 23px;
  color: #333;
  line-height: 1.2;
  text-align: center;
  padding-bottom: 35px;
}
.invalid {
  color: red;
  font-size: 0.8rem;
  position: absolute;
  left: 0;
  padding-bottom: 50px;
}
</style>
