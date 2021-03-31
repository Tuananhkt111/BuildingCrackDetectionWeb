<template>
  <div>
    <div v-if="ChangePassworDialog" style="padding-top: 100px">
      <span class="login100-form-title" style="font-weight: bold"
        >Forgot Password</span
      >
      <div class="p-float-label p-mb-5">
        <InputText
          id="newPassword"
          type="password"
          v-model="newPassword"
          style="width: 270px"
        />
        <label style="padding-left: 5px;" class="">New Password</label>
        <br />
        <small class="p-invalid">{{ errors.newPassword }}</small>
      </div>

      <div class="p-float-label p-mb-5">
        <InputText
          id="confirmPassword"
          type="password"
          v-model="confirmPassword"
          style="width: 270px"
        />
        <label style="padding-left: 5px;">Confirm Password</label>
        <br />
        <small class="p-invalid">{{ errors.confirmPassword }}</small>
      </div>

      <Button
        label="Change Password"
        class="p-button-raised p-button-info"
        @click="confirmChangePassword"
        style="width: 270px;"
      />
    </div>
    <div>
      <Dialog
        v-model:visible="successForgotPass"
        :style="{ width: '450px' }"
        :modal="true"
        class="p-fluid"
      >
        <p>Change Password Success</p>
        <p @click="closeToLogin">Will back to Login Page in {{ countDown }}</p>
      </Dialog>
    </div>
    <Toast position="bottom-right" />
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import { useForm, useField } from "vee-validate";
import Toast from "primevue/toast";
import * as yup from "yup";
import userApi from "../apis/user.js";
import contentNoti from "../util/contentNoti.js";

export default {
  setup() {
    const schema = yup.object({
      newPassword: yup
        .string()
        .max(30)
        .label("Old Password")
        .required()
        .matches(
          /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "8 characters, 1 uppercase, 1 number"
        ),
      confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("newPassword"), null], "Passwords don't match."),
    });
    const { errors, meta, handleReset, validate } = useForm({
      validationSchema: schema,
    });

    const { value: newPassword } = useField("newPassword");
    const { value: confirmPassword } = useField("confirmPassword");

    return {
      handleReset,
      newPassword,
      confirmPassword,
      errors,
      meta,
      validate,
    };
  },

  components: {
    InputText,
    Toast,
  },
  data() {
    return {
      id: "",
      token: "",
      tmpPassword: "",
      ChangePassworDialog: true,
      successForgotPass: false,
      countDown: 10,
    };
  },
  methods: {
    async confirmChangePassword() {
      if (this.meta.valid) {
        await userApi
          .changeForgotPassword(
            this.$route.params.id,
            this.$route.query.token,
            this.newPassword
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
              this.successForgotPass = true;
              this.countDownTimer();
            } else {
              this.$toast.add({
                severity: "error",
                summary: contentNoti.FAIL_SUMMARY,
                detail: contentNoti.USER_FORGOTPASS_FAILED,
                life: 3000,
              });
            }
          })
          .catch(() => {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.USER_FORGOTPASS_FAILED,
              life: 3000,
            });
          });
      } else {
        this.validate();
      }
    },

    closeToLogin() {
      this.successForgotPass = false;
      window.location = "/";
    },
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      } else {
        this.countDown = 10;
        this.closeToLogin();
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
</style>
