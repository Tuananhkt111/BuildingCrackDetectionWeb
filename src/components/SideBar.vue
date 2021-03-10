<template>
  <div class="side-bar-layout">
    <div class="layout-profile">
      <div>
        <img src="/assets/icons8-admin-settings-male-100.png" alt="" />
      </div>
      <button class="p-link layout-profile-link" @click="onClick">
        <span class="username">{{ getUser.name }}</span>
        <i class="pi pi-fw pi-cog"></i>
      </button>
      <div class="layout-submenu-wrapper">
        <ul v-show="expanded">
          <li>
            <button class="p-link">
              <a @click="$router.push('/profiles')"
                ><i class="pi pi-fw pi-user"></i><span>Account</span></a
              >
            </button>
          </li>
          <li>
            <button class="p-link">
              <a @click="$router.push('/notis')"
                ><i class="pi pi-fw pi-bell"></i><span>Notifications</span></a
              >
            </button>
          </li>
          <li>
            <button class="p-link" @click="changePassword">
              <a><i class="pi pi-fw pi-key"></i><span>Change Password</span></a>
            </button>
          </li>
          <li>
            <button class="p-link" @click="logOut">
              <a><i class="pi pi-fw pi-power-off"></i><span>Logout</span></a>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <div class="layout-profile">
        <ul>
          <li>
            <button class="p-link">
              <a @click="$router.push('/users')"
                ><i class="pi pi-fw pi-users"></i
                ><span v-if="role === 'Manager'">Staff</span
                ><span v-else>Users</span></a
              >
            </button>
          </li>
          <li>
            <button class="p-link">
              <a @click="$router.push('/cracks')"
                ><i class="pi pi-fw pi-exclamation-triangle"></i
                ><span>Cracks</span></a
              >
            </button>
          </li>
          <li>
            <button class="p-link">
              <a @click="$router.push('/locations')"
                ><i class="pi pi-fw pi-map-marker"></i><span>Locations</span></a
              >
            </button>
          </li>
          <li>
            <button class="p-link">
              <a @click="$router.push('/maintenanceOrders')"
                ><i class="pi pi-fw pi-shopping-cart"></i
                ><span>Maintenance Orders</span></a
              >
            </button>
          </li>
          <li>
            <button class="p-link">
              <a @click="$router.push('/maintenanceWorkers')"
                ><i class="pi pi-fw pi-users"></i
                ><span>Maintenance Workers</span></a
              >
            </button>
          </li>
        </ul>
      </div>
    </div>
    <Dialog
      v-model:visible="ChangePassworDialog"
      :style="{ width: '450px' }"
      header="Change Password"
      :modal="true"
      class="p-fluid"
    >
      <div class="p-field">
        <label>Old Password</label>
        <InputText id="oldPassword" v-model="oldPassword" type="password" />
        <small class="p-invalid">{{ errors.oldPassword }}</small>
      </div>
      <div class="p-field">
        <label>New Password</label>
        <InputText id="newPassword" v-model="newPassword" type="password" />
        <small class="p-invalid">{{ errors.newPassword }}</small>
      </div>
      <div class="p-field">
        <label>confirm Password</label>
        <InputText
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
        />
        <small class="p-invalid">{{ errors.confirmPassword }}</small>
      </div>
      <template #footer>
        <Button
          label="Create"
          icon="pi pi-check"
          class="p-button-text"
          @click="confirmChangePassword"
        />
      </template>
    </Dialog>
  </div>
</template>
<script>
import userApi from "../apis/user.js";
import { useForm, useField } from "vee-validate";
import { mapGetters, mapActions } from "vuex";
import * as yup from "yup";
export default {
  setup() {
    const schema = yup.object({
      oldPassword: yup
        .string()
        .max(30)
        .label("Old Password")
        .required()
        .matches(
          /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "Password must contain at least 8 characters, one uppercase, one number"
        ),
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
    };
  },

  computed: {
    ...mapGetters("user", ["getUser"]),
  },

  components: {},
  data() {
    return {
      expanded: false,
      role: null,
      ChangePassworDialog: false,
    };
  },
  created() {
    this.role = JSON.parse(localStorage.getItem("user")).role;
    if (this.getUser == null) {
      this.setUser(JSON.parse(localStorage.getItem("user")));
    }
  },
  methods: {
    ...mapActions("user", ["setUser"]),

    changePassword() {
      this.handleReset();
      this.ChangePassworDialog = true;
    },
    async confirmChangePassword() {
      if (this.meta.valid) {
        await userApi
          .changePassword(
            JSON.parse(localStorage.getItem("user")).userId,
            this.oldPassword,
            this.newPassword
          )
          .then((res) => {
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: res.data,
              life: 3000,
            });
            this.ChangePassworDialog = false;
          })
          .catch((err) => {
            this.$toast.add({
              severity: "error",
              summary: "Failed!",
              detail: err.data,
              life: 3000,
            });
            this.ChangePassworDialog = false;
          });
      }
    },
    onClick(event) {
      this.expanded = !this.expanded;
      event.preventDefault();
    },
    logOut() {
      userApi.logout();
      this.$router.go();
    },
  },
};
</script>

<style scoped>
.layout-submenu-wrapper {
  margin-top: 10px;
  background-color: #2e3035;
}
.layout-profile {
  margin-top: 30px;
  text-align: center;
}
.side-bar-layout {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 450;
  position: fixed;
  width: 250px;
  height: 100%;
  z-index: 999;
  overflow-y: auto;
  background: linear-gradient(180deg, #4d505b 0, #3b3e47);
}

.layout-profile .layout-profile-link {
  color: rgb(255, 255, 255);
}

.layout-profile ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  display: list-item;
  text-align: -webkit-match-parent;
}

ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}

.layout-profile ul li button {
  width: 100%;
  padding: 1em;
  border: 0 none;
  border-radius: 0;
  cursor: pointer;
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
}

.layout-sidebar-dark .layout-profile ul li button {
  color: #fff;
}
.layout-profile ul li button {
  width: 100%;
  padding: 1em;
  border: 0 none;
  border-radius: 0;
  cursor: pointer;
  -webkit-transition: color 0.2s;
  transition: color 0.2s;
}
.p-link {
  text-align: left;
  background-color: transparent;
  margin: 0;
  padding: 0;
  border: 0;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.layout-profile ul li button i {
  vertical-align: middle;
}

.pi {
  font-family: primeicons;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.layout-profile ul li button span {
  margin-left: 0.25em;
  vertical-align: middle;
}

.menuitem-badge {
  display: inline-block;
  margin-left: 4px;
  font-size: 10px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  color: #fff;
  background-color: red;
  border-radius: 50%;
}
a:hover {
  text-decoration: none;
  color: #0388e5;
}
a {
  color: rgb(255, 255, 255);
  text-decoration: none;
}
.menu-item:hover {
  background-color: rgb(236, 236, 236);
}
.menu-item {
  width: 100%;
  transition: all 0.4s;
  cursor: pointer;
}
.icon-menu {
  margin: 12px 15px 12px 40px;
}
</style>
