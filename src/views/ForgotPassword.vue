<template>
  <div>
    <label>New Password</label>
    <br />
    <InputText type="password" id="newPassword" v-model="newPassword" />
    <br />
    <small class="p-invalid">{{ errors.newPassword }}</small>
    <br />
    <label>confirm Password</label>
    <br />
    <InputText type="password" id="confirmPassword" v-model="confirmPassword" />
    <br />
    <small class="p-invalid">{{ errors.confirmPassword }}</small>
    <br />
    <Button
      label="Create"
      class="p-button-text"
      @click="confirmChangePassword"
    />
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import userApi from "../apis/user.js";

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
  },
  data() {
    return {
      id: "",
      token: "",
      tmpPassword: "",
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
            localStorage.removeItem("checkForgot");
            window.location = "/";
          })
          .catch((err) => alert(err));
      }
    },
  },
};
</script>
