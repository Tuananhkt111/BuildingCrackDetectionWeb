<template>
  <div>
    <div v-if="ChangePassworDialog" style="padding-top: 100px">
      <span class="login100-form-title">Forgot Password</span>
      <div class="wrap-input100">
        <div class="p-float-label" style="margin-bottom:30px">
          <InputText
            id="newPasswordForgot"
            type="password"
            v-model="newPasswordForgot"
            style="width: 270px"
            @input="checkValidate"
          />
          <label style="padding-left: 85px">New Password</label>
        </div>
        <p class="invalid">{{ errorValid.newPasswordValid }}</p>
        <div class="p-float-label" style="margin-bottom:25px">
          <InputText
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            style="width: 270px"
            @input="checkValidate"
          />
          <label style="padding-left: 85px">Confirm Password</label>
        </div>
        <p class="invalid" style="top:-25px">
          {{ errorValid.confirmPasswordValid }}
        </p>
        <Button
          label="Change Password"
          class="p-button-raised p-button-info"
          @click="confirmChangePassword"
          style="width: 270px; margin-top:20px"
        />
      </div>
      <Toast position="bottom-right" />
    </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";
import userApi from "../apis/user.js";
import contentNoti from "../util/contentNoti.js";
import { mapActions } from "vuex";

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
    ...mapActions("application", ["setCheckOffline"]),
    async confirmChangePassword() {
      this.checkValidate();
      if (
        this.errorValid.newPasswordValid === "" &&
        this.errorValid.confirmPasswordValid === ""
      ) {
        await userApi
          .changeForgotPassword(
            this.$route.params.id,
            this.$route.query.token,
            this.newPasswordForgot
          )
          .then((res) => {
            if (res == null || res.status == 403) {
              this.setCheckOffline(true);
            } else if (res.status == 200) {
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
          "Password must contain at least 8 characters, 1 uppercase, 1 number";
      } else if (this.newPasswordForgot.length > 30) {
        this.errorValid.newPasswordValid =
          "New Password must be at most 30 characters";
      } else {
        this.errorValid.newPasswordValid = "";
      }
      if (this.newPasswordForgot !== this.confirmPassword) {
        this.errorValid.confirmPasswordValid = "Password is not matched";
      } else {
        this.errorValid.confirmPasswordValid = "";
      }
    },
  },
};
</script>

<style scoped>
.login100-form-title {
  font-weight: bold;
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
  text-align: left !important;
  font-size: 0.8rem;
  padding-left: 85px;
}

.wrap-input100 {
  text-align: center;
  justify-content: center;
  align-items: center;
  font-family: Poppins;
  margin-bottom: 30px;
  width: 100%;
}
</style>
