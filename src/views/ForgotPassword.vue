<template>
  <div>
    <div v-if="ChangePassworDialog">
      <label>New Password</label>
      <br />
      <InputText type="password" id="newPassword" v-model="newPassword" />
      <br />
      <small class="p-invalid">{{ errors.newPassword }}</small>
      <br />
      <label>Confirm Password</label>
      <br />
      <InputText
        type="password"
        id="confirmPassword"
        v-model="confirmPassword"
      />
      <br />
      <small class="p-invalid">{{ errors.confirmPassword }}</small>
      <br />
      <Button
        label="Change Password"
        class="p-button-text"
        @click="confirmChangePassword"
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
    <Toast position="bottom-right"/>
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
          "Password must contain at least 8 characters, one uppercase, one number"
        ),
      confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("newPassword"), null], "Passwords don't match."),
    });
    const { errors, meta, handleReset } = useForm({
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
    };
  },

  components: {
    InputText,
    Toast
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
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.USER_FORGOTPASS_SUCCESS,
              life: 3000,
            });
            this.ChangePassworDialog = false;
            this.successForgotPass = true;
            this.countDownTimer();
          })
          .catch(() => {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.USER_FORGOTPASS_FAILED,
              life: 3000,
            });
          });
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
