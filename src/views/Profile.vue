<template>
  <div class="main-layout-details">
    <link
      href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
      rel="stylesheet"
    />
    <div class="main-content">
      <!-- Header -->
      <div
        class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style="min-height: 300px"
      >
        <span class="mask background-color opacity-1"></span>
        <div class="container-fluid d-flex align-items-center">
          <div class="row">
            <div class="col-lg-7 col-md-10">
              <h1 class="display-2 text-white">Hello {{ getUser.name }}</h1>
              <p class="text-white mt-0 mb-5">
                This is your profile page, all of your basic information will be
                shown there. Besides, if you want to update your password, this
                page will help you do it.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid mt--7">
        <div class="row">
          <!-- Cục phía trên bên phải -->
          <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
            <div class="card card-profile shadow">
              <div class="row justify-content-center">
                <div class="col-lg-3 order-lg-2">
                  <div class="card-profile-image">
                    <a href="#">
                      <img src="/assets/bcd-blue2.png" class="rounded-circle" style="padding-top:5px"/>
                    </a>
                  </div>
                </div>
              </div>
              <div
                class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"
              ></div>
              <div class="card-body pt-0 pt-md-4">
                <br /><br /><br /><br />
                <div class="text-center">
                  <h3>
                    {{ getUser.userName
                    }}<span class="font-weight-light"></span>
                  </h3>
                  <div class="h5 font-weight-300">
                    <i class="ni location_pin mr-2"></i>{{ getLocations }}
                  </div>
                  <div class="h5 mt-4">
                    <i class="ni business_briefcase-24 mr-2"></i
                    >{{ getUser.role }} - Building Cracks Detection
                  </div>
                </div>
              </div>
            </div>
            <!-- Cục phía dưới bên phải -->
            <br />
            <div class="card card-profile shadow">
              <div class="card-body pt-0 pt-md-4">
                <div>
                  <h3 class="text-center">Change Password</h3>
                  <input
                    type="password"
                    class="form-control form-control-alternative"
                    placeholder="Old Password"
                    id="oldPassword"
                    v-model="oldPassword"
                  />
                  <small class="invalid">{{ errors.oldPassword }}</small>
                  <br />
                  <input
                    type="password"
                    class="form-control form-control-alternative"
                    placeholder="New Password"
                    id="newPassword"
                    v-model="newPassword"
                  />
                  <small class="invalid">{{ errors.newPassword }}</small>
                  <br />
                  <input
                    type="password"
                    class="form-control form-control-alternative"
                    placeholder="Confirm New Password"
                    id="confirmPassword"
                    v-model="confirmPassword"
                  />
                  <small class="invalid">{{ errors.confirmPassword }}</small>
                  <br />
                  <div class="text-center">
                    <button
                      class="btn btn-sm btn-default float-center"
                      style="padding: 5px 10px; font-size: 0.8rem"
                      @click="confirmChangePassword"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Cục bên trái -->
          <div class="col-xl-8 order-xl-1">
            <div class="card bg-secondary shadow">
              <div class="card-header bg-white border-0">
                <div class="row align-items-center">
                  <div class="col-8">
                    <h3 class="mb-0">My account</h3>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <form>
                  <h6 class="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div class="pl-lg-4">
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group focused">
                          <label class="form-control-label">Fullname</label>
                          <input
                            class="form-control form-control-alternative"
                            v-model="getUser.name"
                            readonly
                          />
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group">
                          <label class="form-control-label"
                            >Email address</label
                          >
                          <input
                            class="form-control form-control-alternative"
                            v-model="getUser.email"
                            readonly
                          />
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-lg-6">
                        <div class="form-group focused">
                          <label class="form-control-label">Phone number</label>
                          <input
                            class="form-control form-control-alternative"
                            v-model="getUser.phoneNumber"
                            readonly
                          />
                        </div>
                      </div>
                      <div class="col-lg-6">
                        <div class="form-group focused">
                          <label class="form-control-label">Role</label>
                          <input
                            class="form-control form-control-alternative"
                            v-model="getUser.role"
                            readonly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr class="my-4" />
                  <h6 class="heading-small text-muted mb-4">
                    Contact information
                  </h6>
                  <div class="pl-lg-4">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group focused">
                          <label class="form-control-label">Address</label>
                          <input
                            class="form-control form-control-alternative"
                            v-model="getUser.address"
                            readonly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr class="my-4" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast position="bottom-right" />
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import userApi from "../apis/user.js";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import Toast from "primevue/toast";
import contentNoti from "../util/contentNoti.js";
export default {
  setup() {
    const schema = yup.object({
      oldPassword: yup
        .string()
        .max(30)
        .label("Old Password")
        .required(),
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
        .oneOf([yup.ref("newPassword"), null], "Passwords don't match."),
    });
    const { errors, meta, handleReset, validate } = useForm({
      validationSchema: schema,
    });

    const { value: oldPassword } = useField("oldPassword");
    const { value: newPassword } = useField("newPassword");
    const { value: confirmPassword } = useField("confirmPassword");

    return {
      handleReset,
      oldPassword,
      newPassword,
      confirmPassword,
      errors,
      meta,
      validate,
    };
  },

  components: {
    Toast,
  },

  computed: {
    ...mapGetters("user", ["getUser"]),

    getLocations() {
      return this.getUser.locations.map((l) => l.name).toString();
    },
  },
  data() {
    return {
      text: null,
      expanded: false,
      role: null,
      ChangePassworDialog: false,
      staff: false,
    };
  },
  created() {
    if (this.getUser == null) {
      this.setUser(JSON.parse(localStorage.getItem("user")));
    }
    this.text = this.getUser.userName.charAt(0);
  },
  methods: {
    ...mapActions("user", ["setUser"]),

    async confirmChangePassword() {
      if (
        this.meta.valid &&
        this.oldPassword != null &&
        this.newPassword != null
      ) {
        await userApi
          .changePassword(
            JSON.parse(localStorage.getItem("user")).userId,
            this.oldPassword,
            this.newPassword
          )
          .then((res) => {
            if (res.status == 200) {
              this.$toast.add({
                severity: "success",
                detail: contentNoti.USER_CHANGE_PASSWORD_SUCCESS,
                life: 3000,
              });
              this.handleReset();
            } else {
              this.$toast.add({
                severity: "error",
                detail: contentNoti.USER_CHANGE_PASSWORD_FAILED,
                life: 3000,
              });
              this.handleReset();
            }
          })
          .catch(() => {
            this.$toast.add({
              severity: "error",
              detail: contentNoti.USER_CHANGE_PASSWORD_FAILED,
              life: 3000,
            });
            this.handleReset();
          });
      } else {
        this.validate();
      }
    },
  },
};
</script>
<style scoped>
.invalid {
  color: red;
  position: sticky;
  left: 30px !important;
}

header,
main {
  overflow: hidden;
  display: block;
}
body {
  font-family: Open Sans, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  text-align: left;
  color: #525f7f;
  background-color: #f8f9fe;
}
hr {
  overflow: visible;
  box-sizing: content-box;
  height: 0;
}
h1,
h3,
h5,
h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
p {
  margin-top: 0;
  margin-bottom: 1rem;
}
label {
  display: inline-block;
  margin-bottom: 0.5rem;
}
button {
  border-radius: 0;
}
button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color;
}
input,
button {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  margin: 0;
  overflow: visible;
}
button {
  text-transform: none;
}
button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  padding: 0;
  border-style: none;
}
h1,
h3,
h5,
h6,
.h1,
.h3,
.h5,
.h6 {
  font-family: inherit;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  color: #32325d;
}
h1,
.h1 {
  font-size: 1.625rem;
}
h3,
.h3 {
  font-size: 1.0625rem;
}
h5,
.h5 {
  font-size: 0.8125rem;
}
h6,
.h6 {
  font-size: 0.625rem;
}
.display-2 {
  font-size: 2.75rem;
  font-weight: 600;
  line-height: 1.5;
}
hr {
  margin-top: 2rem;
  margin-bottom: 2rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 15px;
  padding-left: 15px;
}
.container-fluid {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 15px;
  padding-left: 15px;
}
.row {
  display: flex;
  margin-right: -15px;
  margin-left: -15px;
  flex-wrap: wrap;
}
.col-4,
.col-8,
.col,
.col-md-10,
.col-md-12,
.col-lg-3,
.col-lg-4,
.col-lg-6,
.col-lg-7,
.col-xl-4,
.col-xl-6,
.col-xl-8 {
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}
.col {
  max-width: 100%;
  flex-basis: 0;
  flex-grow: 1;
}
.col-4 {
  max-width: 33.33333%;
  flex: 0 0 33.33333%;
}
.col-8 {
  max-width: 66.66667%;
  flex: 0 0 66.66667%;
}
@media (min-width: 768px) {
  .col-md-10 {
    max-width: 83.33333%;
    flex: 0 0 83.33333%;
  }
  .col-md-12 {
    max-width: 100%;
    flex: 0 0 100%;
  }
}
@media (min-width: 992px) {
  .col-lg-3 {
    max-width: 25%;
    flex: 0 0 25%;
  }
  .col-lg-4 {
    max-width: 33.33333%;
    flex: 0 0 33.33333%;
  }
  .col-lg-6 {
    max-width: 50%;
    flex: 0 0 50%;
  }
  .col-lg-7 {
    max-width: 58.33333%;
    flex: 0 0 58.33333%;
  }
  .order-lg-2 {
    order: 2;
  }
}
@media (min-width: 1200px) {
  .col-xl-4 {
    max-width: 33.33333%;
    flex: 0 0 33.33333%;
  }
  .col-xl-6 {
    max-width: 50%;
    flex: 0 0 50%;
  }
  .col-xl-8 {
    max-width: 66.66667%;
    flex: 0 0 66.66667%;
  }
  .order-xl-1 {
    order: 1;
  }
  .order-xl-2 {
    order: 2;
  }
  .order-xl-3 {
    order: 3;
  }
}
.form-control {
  font-size: 1rem;
  line-height: 1.5;
  display: block;
  width: 100%;
  height: calc(2.75rem + 2px);
  padding: 0.625rem 0.75rem;
  transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  color: #8898aa;
  border: 1px solid #cad1d7;
  border-radius: 0.375rem;
  background-color: #fff;
  background-clip: padding-box;
  box-shadow: none;
}
@media screen and (prefers-reduced-motion: reduce) {
  .form-control {
    transition: none;
  }
}
.form-control::-ms-expand {
  border: 0;
  background-color: transparent;
}
.form-control:focus {
  color: #8898aa;
  border-color: rgba(50, 151, 211, 0.25);
  outline: 0;
  background-color: #fff;
  box-shadow: none, none;
}
.form-control:-ms-input-placeholder {
  opacity: 1;
  color: #adb5bd;
}
.form-control::-ms-input-placeholder {
  opacity: 1;
  color: #adb5bd;
}
.form-control::placeholder {
  opacity: 1;
  color: #adb5bd;
}
.form-control:disabled,
.form-control[readonly] {
  opacity: 1;
  background-color: #ebf0f5;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-inline {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}
@media (min-width: 576px) {
  .form-inline label {
    display: flex;
    margin-bottom: 0;
    align-items: center;
    justify-content: center;
  }
  .form-inline .form-group {
    display: flex;
    margin-bottom: 0;
    flex: 0 0 auto;
    flex-flow: row wrap;
    align-items: center;
  }
  .form-inline .form-control {
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }
}
.btn {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  display: inline-block;
  padding: 0.625rem 1.25rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  border: 1px solid transparent;
  border-radius: 0.375rem;
}
@media screen and (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
.btn:hover,
.btn:focus {
  text-decoration: none;
}
.btn:focus {
  outline: 0;
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}
.btn-default {
  color: #fff;
  border-color: #172b4d;
  background-color: #172b4d;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}
.btn-default:hover {
  color: #fff;
  border-color: #172b4d;
  background-color: #172b4d;
}
.btn-default:focus {
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08),
    0 0 0 0 rgba(23, 43, 77, 0.5);
}
.btn-default:disabled {
  color: #fff;
  border-color: #172b4d;
  background-color: #172b4d;
}
.btn-default:not(:disabled):not(.disabled):active {
  color: #fff;
  border-color: #172b4d;
  background-color: #0b1526;
}
.btn-default:not(:disabled):not(.disabled):active:focus {
  box-shadow: none, 0 0 0 0 rgba(23, 43, 77, 0.5);
}
.btn-sm {
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 0.375rem;
  background-color: #fff;
  background-clip: border-box;
}
.card > hr {
  margin-right: 0;
  margin-left: 0;
}
.card-body {
  padding: 1.5rem;
  flex: 1 1 auto;
}
.card-header {
  margin-bottom: 0;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: #fff;
}
.card-header:first-child {
  border-radius: calc(0.375rem - 1px) calc(0.375rem - 1px) 0 0;
}
.media {
  display: flex;
  align-items: flex-start;
}
.bg-secondary {
  background-color: #f7fafc !important;
}
a.bg-secondary:hover,
a.bg-secondary:focus,
button.bg-secondary:hover,
button.bg-secondary:focus {
  background-color: #d2e3ee !important;
}
.bg-default {
  background-color: #5fa4fa !important;
}
a.bg-default:hover,
a.bg-default:focus,
button.bg-default:hover,
button.bg-default:focus {
  background-color: #0b1526 !important;
}
.bg-white {
  background-color: #fff !important;
}
a.bg-white:hover,
a.bg-white:focus,
button.bg-white:hover,
button.bg-white:focus {
  background-color: #e6e6e6 !important;
}
.bg-white {
  background-color: #fff !important;
}
.border-0 {
  border: 0 !important;
}
.rounded-circle {
  background-color: white;
}
.d-flex {
  display: flex !important;
}
@media (min-width: 768px) {
  .d-md-flex {
    display: flex !important;
  }
}
.justify-content-center {
  justify-content: center !important;
}
.align-items-center {
  align-items: center !important;
}
@media (min-width: 1200px) {
  .justify-content-xl-between {
    justify-content: space-between !important;
  }
}
.float-right {
  float: right !important;
}
.shadow,
.card-profile-image img {
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15) !important;
}
.mt-0 {
  margin-top: 0 !important;
}
.mb-0 {
  margin-bottom: 0 !important;
}
.mr-2 {
  margin-right: 0.5rem !important;
}
.mt-4,
.my-4 {
  margin-top: 1.5rem !important;
}
.mb-4,
.my-4 {
  margin-bottom: 1.5rem !important;
}
.mb-5 {
  margin-bottom: 3rem !important;
}
.mt--7 {
  margin-top: -6rem !important;
}
.pt-0 {
  padding-top: 0 !important;
}
.pb-0 {
  padding-bottom: 0 !important;
}
.pt-5 {
  padding-top: 3rem !important;
}
.pt-8 {
  padding-top: 8rem !important;
}
.pb-8 {
  padding-bottom: 8rem !important;
}
.m-auto {
  margin: auto !important;
}
@media (min-width: 768px) {
  .pt-md-4 {
    padding-top: 1.5rem !important;
  }
  .pb-md-4 {
    padding-bottom: 1.5rem !important;
  }
}
@media (min-width: 992px) {
  .pl-lg-4 {
    padding-left: 1.5rem !important;
  }
  .pt-lg-8 {
    padding-top: 8rem !important;
  }
}
@media (min-width: 1200px) {
  .mb-xl-0 {
    margin-bottom: 0 !important;
  }
}
.text-center {
  text-align: center !important;
}
.font-weight-light {
  font-weight: 300 !important;
}
.text-white {
  color: #fff !important;
}
.text-white {
  color: #fff !important;
}
a.text-white:hover,
a.text-white:focus {
  color: #e6e6e6 !important;
}
.text-muted {
  color: #8898aa !important;
}
.bg-white {
  background-color: #fff !important;
}
a.bg-white:hover,
a.bg-white:focus,
button.bg-white:hover,
button.bg-white:focus {
  background-color: #e6e6e6 !important;
}
.background-color {
  background: #5fa4fa !important;
}
.background-color {
  background: #5fa4fa !important;
}
.opacity-8 {
  opacity: 0.8 !important;
}
.opacity-8 {
  opacity: 0.9 !important;
}
.center {
  left: 50%;
  transform: translateX(-50%);
}
[class*="shadow"] {
  transition: all 0.15s ease;
}
.font-weight-300 {
  font-weight: 300 !important;
}
.text-sm {
  font-size: 0.875rem !important;
}
.text-white {
  color: #fff !important;
}
a.text-white:hover,
a.text-white:focus {
  color: #e6e6e6 !important;
}
.avatar {
  font-size: 1rem;
  display: inline-flex;
  width: 48px;
  height: 48px;
  color: #fff;
  border-radius: 50%;
  background-color: #adb5bd;
  align-items: center;
  justify-content: center;
}
.avatar img {
  width: 100%;
  border-radius: 50%;
}
.avatar-sm {
  font-size: 0.875rem;
  width: 36px;
  height: 36px;
}
.btn {
  font-size: 0.875rem;
  position: relative;
  transition: all 0.15s ease;
  letter-spacing: 0.025em;
  text-transform: none;
  will-change: transform;
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
}
.btn-sm {
  font-size: 0.75rem;
}
[class*="btn-outline-"] {
  border-width: 1px;
}
.card-profile-image {
  position: relative;
}
.card-profile-image img {
  position: absolute;
  left: 50%;
  max-width: 180px;
  transition: all 0.15s ease;
  transform: translate(-50%, -30%);
  border-radius: 0.375rem;
}
.card-profile-image img:hover {
  transform: translate(-50%, -33%);
}
.main-content {
  position: relative;
  margin-bottom: 20px;
}
@media (min-width: 768px) {
  .main-content .container-fluid {
    padding-right: 39px !important;
    padding-left: 39px !important;
  }
}
.form-control-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #525f7f;
}
.form-control {
  font-size: 0.875rem;
}
.form-control:focus:-ms-input-placeholder {
  color: #adb5bd;
}
.form-control:focus::-ms-input-placeholder {
  color: #adb5bd;
}
.form-control:focus::placeholder {
  color: #adb5bd;
}
.form-control-alternative {
  transition: box-shadow 0.15s ease;
  border: 0;
  box-shadow: 0 1px 3px rgba(50, 50, 93, 0.15), 0 1px 0 rgba(0, 0, 0, 0.02);
}
.form-control-alternative:focus {
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}
.focused .form-control {
  border-color: rgba(50, 151, 211, 0.25);
}
.header {
  position: relative;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 0.15s ease;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}
@media screen and (prefers-reduced-motion: reduce) {
  .mask {
    transition: none;
  }
}
p {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.7;
}
.heading {
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}
.heading-small {
  font-size: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.display-2 span {
  font-weight: 300;
  display: block;
}
@media (max-width: 768px) {
  .btn {
    margin-bottom: 10px;
  }
}
.main-layout-details {
  border-radius: 24px;
  padding: 20px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}
.active .main-layout-details {
  margin-left: 266.5px;
  transition: all 0.2s;
}
.inactive .main-layout-details {
  margin-left: 0;
  transition: all 0.2s;
}
</style>
