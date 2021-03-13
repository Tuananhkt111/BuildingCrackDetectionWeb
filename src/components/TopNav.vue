<template>
  <div class="top-nav-layout">
    <div class="top-nav p-d-flex p-ai-center p-jc-between">
      <div
        class="p-d-flex p-ai-center p-jc-between"
        style="padding-left: 120px"
      ></div>
      <!-- Dropdown Menu -->
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
      <div class="top-nav-right p-d-flex p-ai-center p-jc-between">
        <div>
          <a href="#" class="header__link">
            <img
              class="header--button"
              key="on"
              @click="showAccMenu"
              src="/assets/profile-3.png"
            />
            <!-- <i class="pi pi-user"></i> -->
          </a>
          <transition name="dropdown">
            <div class="dropdown__menu" v-if="show">
              <ul class="dropdown__menu-nav">
                <li class="dropdown__menu-item">
                  <a
                    class="dropdown__menu-link"
                    @click="$router.push('/profiles')"
                  >
                    <div class="dropdown__menu-icon">
                      <i class="pi pi-fw pi-user"></i>
                    </div>
                    <div class="dropdown__menu-text">Account</div>
                  </a>
                </li>
                <li class="dropdown__menu-item">
                  <a
                    class="dropdown__menu-link"
                    @click="$router.push('/notis')"
                  >
                    <div class="dropdown__menu-icon">
                      <i class="pi pi-fw pi-bell"></i>
                    </div>
                    <div class="dropdown__menu-text">Notifications</div>
                  </a>
                </li>
                <li class="dropdown__menu-item">
                  <a class="dropdown__menu-link" @click="changePassword">
                    <div class="dropdown__menu-icon">
                      <i class="pi pi-fw pi-key"></i>
                    </div>
                    <div class="dropdown__menu-text">Change Password</div>
                  </a>
                </li>
                <li class="dropdown__menu-item">
                  <a class="dropdown__menu-link" @click="logOut">
                    <div class="dropdown__menu-icon">
                      <i class="pi pi-fw pi-power-off"></i>
                    </div>
                    <div class="dropdown__menu-text">Logout</div>
                  </a>
                </li>
              </ul>
            </div>
          </transition>
        </div>
        <div
          class="btn-nav"
          @click="showNotiMenu"
          aria-haspopup="true"
          aria-controls="overlay_tmenu"
        >
          <i class="pi pi-comment">
            <div class="count" v-if="getCount != 0">{{ getCount }}</div>
          </i>
        </div>
        <transition name="dropdown">
          <div class="card timeline" v-if="showNoti">
            <div class="card-header">
              <div class="card-title">
                <h6>Unread</h6>
                <p class="subtitle">Notifications</p>
              </div>
              <a
                href="#"
                style="text-decoration: none; margin-right: 20px;"
                v-if="getCount != 0"
                class="left"
                @click="markAllAsRead()"
              >
                Mark all as read
              </a>
            </div>
            <ul
              v-if="
                !getUnReadNotificationList || !getUnReadNotificationList.length
              "
            >
              <span style="color: #a2a1a1">No unread notifications</span>
            </ul>
            <ul
              v-for="item in getUnReadNotificationList"
              v-bind:key="item"
              @click="deleteNoti(item.pushNotificationId)"
            >
              <li class="blue">
                <i class="pi pi-circle-on"></i>
                <div class="event-content">
                  <span class="event-title">{{ item.title }}</span>
                  <span>{{ item.body }}</span>
                  <span class="time">{{ callDate(item.created) }}</span>
                </div>
              </li>
            </ul>
            <a href="#" @click="$router.push('/notis')">See all</a>
          </div>
        </transition>
        <OverlayPanel
          ref="op"
          style="
            width: 350px;
            margin-top: -20px;
            margin-right: 20px;
            position: absolute;
          "
        >
          <ScrollPanel
            style="width: 100%; max-height: 250px"
            v-if="showListNoti"
          >
            <div class="panel panel-default">
              <div class="panel-body">
                <div
                  class="alert alert-info"
                  v-for="item in getUnReadNotificationList"
                  v-bind:key="item"
                  @click="deleteNoti(item.pushNotificationId)"
                >
                  <p class="title">
                    <strong>{{ item.title }}</strong>
                  </p>
                  {{ item.body }}
                  <p class="time">{{ callDate(item.created) }}</p>
                </div>
              </div>
            </div>
          </ScrollPanel>
          <p v-if="getCount != 0" class="left" @click="markAllAsRead()">
            Mark all as read
          </p>
          <a class="right" @click="$router.push('/notis')">Show more</a>
        </OverlayPanel>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "../util/firebase.js";
import ScrollPanel from "primevue/scrollpanel";
import OverlayPanel from "primevue/overlaypanel";
import { mapGetters, mapActions } from "vuex";
import { useForm, useField } from "vee-validate";
import userApi from "../apis/user.js";
import moment from "moment";
import { notificationApi } from "../apis/notification";
import webRole from "../util/webRole.js";
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
  components: {
    OverlayPanel,
    ScrollPanel,
  },
  computed: {
    ...mapGetters("noti", [
      "getNotificationList",
      "getCount",
      "getUnReadNotificationList",
    ]),
    ...mapGetters("application", ["getIsActive"]),
    ...mapGetters("user", ["getUser"]),
  },
  async created() {
    if (this.getUnReadNotificationList != null) {
      this.showListNoti = true;
    }
    await this.setNotificationList();
    this.role = JSON.parse(localStorage.getItem("user")).role;
    if (this.getUser == null) {
      this.setUser(JSON.parse(localStorage.getItem("user")));
    }
  },

  mounted() {
    this.prepareFcm();
    if (this.role == webRole.STAFF_ROLE) {
      this.staff = true;
    }
  },
  data() {
    return {
      display: false,
      showListNoti: false,
      show: false,
      role: null,
      ChangePassworDialog: false,
      staff: false,
      showNoti: false,
    };
  },
  methods: {
    ...mapActions("application", ["setIsActive"]),
    // ...mapActions("user", ["setIsActive"]),
    ...mapActions("noti", ["setNotificationList"]),
    ...mapActions("user", ["setUser"]),
    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD-MM-YYYY hh:mm:ss");
    },
    changePassword() {
      this.handleReset();
      this.ChangePassworDialog = true;
    },

    showAccMenu() {
      this.show = !this.show;
      this.showNoti = false;
    },
    showNotiMenu() {
      this.showNoti = !this.showNoti;
      this.show = false;
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
    logOut() {
      userApi.logout();
      this.$router.go();
    },
    prepareFcm() {
      firebase.messaging
        .requestPermission()
        .then(
          firebase.messaging.getToken().then(async (fcmToken) => {
            localStorage.setItem("fcm", fcmToken);
            firebase.messaging.onMessage((payload) => {
              this.$toast.add({
                severity: "success",
                summary: payload.notification.title,
                detail: payload.notification.body,
                life: 3000,
              });
              this.setNotificationList();
              userApi.getUserById().then((res) => {
                this.setUser(JSON.parse(res));
              });
            });
          })
        )
        .catch(() => {
          this.$store.commit(
            "toast/setError",
            "An error occured to push notification."
          );
        });
    },
    async deleteNoti(id) {
      await notificationApi.deleteNoti(id).catch((err) => console.log(err));
      await this.setNotificationList();
    },
    async markAllAsRead() {
      const id = [];
      for (
        let index = 0;
        index < this.getUnReadNotificationList.length;
        index++
      ) {
        id[index] = this.getUnReadNotificationList[index].pushNotificationId;
      }
      console.log(id);
      await notificationApi
        .deleteAllNoti(id)
        .catch((err) => console.log(err))
        .then(() => {
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Clear all Notifications!!",
            life: 3000,
          });
        });
      await this.setNotificationList();
    },
    toggle(event) {
      this.$refs.op.toggle(event);
    },
  },
};
</script>
<style scoped>
#app {
  margin-right: -1100px;
}
*,
::after,
::before {
  box-sizing: border-box;
}
hr {
  border: 0;
  height: 0;
  margin: 1.5rem 0;
  border-top: 1px solid var(--color-gray);
}

.header__nav {
  position: relative;
}
.header__navbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.header__item {
  padding: 1rem;
}
.header--icon {
  width: 1.65rem;
  height: 1.65rem;
}
.header--button {
  margin: 0;
  padding: 0;
  cursor: pointer;
  border: 1px solid transparent;
  background-color: transparent;
  width: 57px;
  height: 57px;
}
.header--button:focus {
  outline: 0;
}

.header__link > i {
  padding: 15px;
  color: #2170e7;
  font-size: 1.8rem;
}

.header__link > img {
  padding: 12px 10px 10px;
  border-radius: 20px;
}

.dropdown__menu {
  top: 78%;
  right: 5px;
  position: absolute;
  z-index: 10;
  min-width: 227px;
  margin-top: 1rem;
  overflow-y: auto;
  padding: 2rem 1rem 2rem 0rem;
  border-radius: 15px;
  background-color: white;
  background-clip: padding-box;
  box-shadow: 0 2px 8px 0 rgb(25 26 28 / 12%);
}
.dropdown__menu-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.6);
  padding: 0.8rem 0 0.8rem 2rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  border-radius: 0 50px 50px 0;
}
.dropdown__menu-link:hover {
  color: #0062d1;
  background-color: rgba(79, 192, 141, 0.1);
  cursor: pointer;
}
.dropdown__menu-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-left: -15px;
}
.dropdown__menu-text {
  font-weight: 300;
  margin-left: 0.5rem;
  margin-right: 1rem;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.5s;
}

.dropdown-enter,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.main {
  margin: 6rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.main__subtitle {
  color: #4f5959;
  font-weight: 100;
  margin-bottom: 2rem;
}
.main__link {
  margin-right: 1.5rem;
  display: inline-block;
}
.main__link:last-child {
  margin-right: 0;
}
.top-nav-layout {
  position: sticky;
  top: 0;
  z-index: 2;
}
.top-nav {
  background-color: white;
  border: 0;
  border-radius: 0 0 3px 3px;
  box-shadow: 0 10px 40px 0 rgb(41 50 65 / 6%);
}
.logo-text {
  color: #221ed9;
  font-size: 20px;
  font-weight: bold;
}
.logo-container {
  background-color: #2a8358;
  padding: 0.8rem;
  box-shadow: 3px 0 6px rgba(0, 0, 0, 0.3);
}
.top-nav-right {
  color: white;
}
.btn-nav {
  padding: 12px;
  padding-right: 40px;
  color: #2170e7;
}

.btn-nav > i {
  font-size: 1.8rem;
}

#menu-button {
  background-color: white;
  color: #3fb57c;
  right: -30px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.23), 0 3px 10px rgba(0, 0, 0, 0.16);
  transition: all 0.2s;
}
.inactive #menu-button {
  transform: rotate(180deg);
}
.active #menu-button {
  transform: rotate(0deg);
}

.panel panel-default {
  border-radius: 5px;
}
.panel-body {
  font-size: 14px;
  padding: 0px;
}
div {
  display: block;
}
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.alert {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid transparent;
  border-radius: 10px;
}
.alert-success {
  color: #3c763d;
  background-color: #dff0d8;
  border-color: #d6e9c6;
}
.alert-info {
  color: #31708f;
  background-color: #d9edf7;
  border-color: #bce8f1;
}
.alert-warning {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border-color: #faebcc;
}
.alert-danger {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
}
.alert-info {
  color: #31708f;
  background-color: #d9edf7;
  border-color: #bce8f1;
}
button.close {
  -webkit-appearance: none;
  padding: 0;
  cursor: pointer;
  background: 0 0;
  border: 0;
}
.close {
  float: right;
  font-size: 20px;
  font-weight: 700;
  line-height: 0.3;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  filter: alpha(opacity=20);
  opacity: 0.2;
}

.title {
  margin: 0;
  font-size: 14px;
}
.time {
  font-size: 12px;
  margin: 0;
  padding-bottom: 0;
}
.count {
  right: 19px;
  top: 18px;
  position: absolute;
  padding-top: 2.5px;
  width: 15px;
  height: 15px;
  color: #fff;
  font-size: 12px;
  font-family: Arial;
  font-weight: bold;
  text-align: center;
  background-color: #d4453b;
  border-radius: 50%;
  z-index: 3;
}

.left {
  font-size: 14px;
  float: left;
  padding-bottom: 5px;
  color: blue;
}

.right {
  font-size: 14px;
  padding-bottom: 5px;
  float: right;
  color: blue;
}

.card {
  background: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0px 10px 40px rgb(41 50 65 / 6%);
  -moz-border-radius: 24px;
  -webkit-border-radius: 24px;
  border-radius: 24px;
  margin-bottom: 2rem;
  position: fixed;
  right: 5px;
  top: 66px;
  color: rgba(41, 50, 65, 0.8);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
  font-size: 14px;
  font-weight: 400;
  width: 20rem;
}

.card:last-child {
  margin-bottom: 0;
}

.timeline {
  padding-right: 4px;
}

.card .card-header {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding-bottom: 16px;
}

.timeline > ul > li {
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 16px;
}

.timeline > ul {
  padding: 0;
  margin-bottom: 10px;
  list-style: none;
  max-height: 300px;
  overflow: auto;
}

.timeline > ul > li.blue > i {
  color: #297fff;
}

.timeline > ul > li > i {
  font-size: 8px;
  margin-right: 10px;
  margin-top: 4px;
}

.timeline > ul > li .event-content span.event-title {
  color: #3e4754;
}

.timeline > ul > li .event-content span {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 12px;
  color: rgba(41, 50, 65, 0.5);
}

.timeline > ul > li .event-content span.time {
  font-size: 8px;
  font-weight: 400;
  color: rgba(41, 50, 65, 0.5);
}

.timeline > a {
  text-decoration: none;
  color: #4f8eec;
}
</style>
