<template>
  <div class="top-nav-layout">
    <div class="top-nav p-d-flex p-ai-center p-jc-between">
      <div
        class="p-d-flex p-ai-center p-jc-between"
        style="padding-left: 120px"
      ></div>
      <!-- Dropdown Menu -->
      <div class="top-nav-right p-d-flex p-ai-center p-jc-between">
        <div class="nav-btn-menu">
          <div class="btn-nav">
            <i class="pi pi-bell" style="font-size:25px;color:black">
              <span class="count" v-if="getCount != 0">{{ getCount }}</span>
            </i>
          </div>
          <ul class="drop-menu">
            <li>
              <div class="card timeline">
                <div class="card-header">
                  <div class="card-title">
                    <h4>Unread</h4>
                    <p class="subtitle" style="font-size: 16px;">
                      Notifications
                    </p>
                  </div>
                  <a
                    href="#"
                    style="text-decoration: none; margin-right: 20px"
                    v-if="getCount != 0"
                    class="left"
                    @click="markAllAsRead()"
                  >
                    Mark all as read
                  </a>
                </div>
                <ul
                  v-if="
                    !getUnReadNotificationList ||
                      !getUnReadNotificationList.length
                  "
                >
                  <span style="color: #a2a1a1">No unread notifications</span>
                </ul>
                <ul>
                  <li
                    class="blue"
                    v-for="item in getUnReadNotificationList"
                    v-bind:key="item"
                    @click="deleteNoti(item.pushNotificationId)"
                  >
                    <div class="event-content">
                      <div class="event-title-box">
                        <i class="pi pi-circle-on"></i>
                        <span class="event-title">{{ item.title }}</span>
                      </div>
                      <span>{{ item.body }}</span>
                      <span class="time">{{ callDate(item.created) }}</span>
                    </div>
                  </li>
                </ul>
                <a
                  href="#"
                  @click="
                    $router.push('/notifications');
                    showNoti = false;
                  "
                  >See all</a
                >
              </div>
            </li>
          </ul>
        </div>
        <div class="nav-btn-menu">
          <div class="btn-nav">
            <img
              src="/assets/bcd-blue.png"
              style="width: 37px; margin-top:5px"
            />
          </div>
          <ul class="drop-menu">
            <li>
              <div class="card2" style="width: 200px">
                <div class="header-info">
                  <p style="color:white;font-weight:500;font-size:16px">
                    {{ getUser.userName }}
                  </p>
                  <p
                    style="color:white;font-size:14px"
                    v-if="getLocationNames !== ''"
                  >
                    Area: <span>{{ getLocationNames }}</span>
                  </p>
                </div>
                <li>
                  <a @click="$router.push('/profile')">
                    <div class="inner-link" style="margin-bottom: 15px">
                      <div class="inner-link-icon">
                        <i class="pi pi-fw pi-user" style="font-size:14px"></i>
                      </div>
                      <div style="font-size:16px;">Profile</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a @click="$router.push('/notifications')">
                    <div
                      class="inner-link"
                      style="margin-bottom: 15px;margin-left:2px"
                    >
                      <div class="inner-link-icon">
                        <i class="pi pi-bell" style="font-size:14px;"></i>
                      </div>
                      <div style="font-size:16px;">Notifications</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a @click="logOut">
                    <div class="inner-link">
                      <div class="inner-link-icon">
                        <i
                          class="pi pi-fw pi-power-off"
                          style="font-size:14px;"
                        ></i>
                      </div>
                      <div style="font-size:16px;">Logout</div>
                    </div>
                  </a>
                </li>
              </div>
            </li>
          </ul>
        </div>
        <div class="userName-location">
          <p>{{ getUser.name }}</p>
          <p style="color:grey;fontWeight:500;font-size:13px">
            {{ getUser.role }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "../util/firebase.js";
import { mapGetters, mapActions } from "vuex";
import userApi from "../apis/user.js";
import moment from "moment";
import { notificationApi } from "../apis/notification";
import webRole from "../util/webRole.js";
import contentNoti from "../util/contentNoti.js";

export default {
  computed: {
    ...mapGetters("noti", [
      "getNotificationList",
      "getCount",
      "getUnReadNotificationList",
    ]),
    ...mapGetters("application", ["getIsActive"]),
    ...mapGetters("user", ["getUser"]),

    getLocationNames() {
      return this.getUser.locations
        .map((l) => l.name)
        .toString()
        .replaceAll(",", ", ");
    },
  },
  async created() {
    this.role = JSON.parse(localStorage.getItem("user")).role;
    if (this.getUser == null) {
      this.setUser(JSON.parse(localStorage.getItem("user")));
    }
    if (this.getUnReadNotificationList != null) {
      this.showListNoti = true;
    }
    await this.setNotificationList();
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
    ...mapActions("noti", ["setNotificationList"]),
    ...mapActions("user", ["setUser"]),
    ...mapActions("application", ["setIsDetect"]),

    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD-MM-YYYY HH:mm:ss");
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
              if (
                payload.notification.body != null &&
                payload.notification.body.includes("Unconfirmed Cracks")
              ) {
                this.setIsDetect(false);
              }
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
      await notificationApi.deleteNoti(id);
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
      await notificationApi
        .deleteAllNoti(id)
        .catch(() =>
          this.$toast.add({
            severity: "error",
            summary: contentNoti.FAIL_SUMMARY,
            detail: contentNoti.NOTIFICATION_CLEAR_FAILED,
            life: 3000,
          })
        )
        .then((res) => {
          if (res.status == 200) {
            this.$toast.add({
              severity: "success",
              summary: contentNoti.SUCCESS_SUMMARY,
              detail: contentNoti.NOTIFICATION_CLEAR_SUCCESS,
              life: 3000,
            });
          } else {
            this.$toast.add({
              severity: "error",
              summary: contentNoti.FAIL_SUMMARY,
              detail: contentNoti.NOTIFICATION_CLEAR_FAILED,
              life: 3000,
            });
          }
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
.inner-link {
  display: flex;
  flex-direction: row;
  font-size: 18px;
}

.inner-link-icon {
  margin-right: 10px;
}

.inner-link:hover {
  color: #2170e7;
  cursor: pointer;
}

.inner-link-icon > i {
  font-size: 20px;
}

.nav-btn-menu > i {
  transition: transform 0.1s ease;
  transform-origin: center center;
}

.nav-btn-menu:hover > i {
  transform: rotate(90deg);
}
.nav-btn-menu:hover > ul.drop-menu li {
  display: block;
}
.nav-btn-menu:last-child {
  border-right: none;
}
ul.drop-menu {
  position: absolute;
  top: 100%;
  left: 35%;
  width: 100%;
  padding: 0;
}

ul.drop-menu li {
  background: white;
  display: none;
  margin-bottom: -2px;
}

ul.drop-menu li:first-child {
  border-radius: 24px 24px 0px 0px;
  border-bottom: none;
  margin-bottom: -3px;
}
ul.drop-menu li:last-child {
  border-radius: 0px 0px 24px 24px;
  border-bottom: none;
}

.nav-btn-menu:hover > ul.drop-menu.menu-2 li {
  opacity: 0;
}
.nav-btn-menu:hover > ul.drop-menu.menu-2 li:nth-child(1) {
  -webkit-animation-name: menu-2;
  animation-name: menu-2;
  -webkit-animation-duration: 300ms;
  animation-duration: 300ms;
  -webkit-animation-delay: 0ms;
  animation-delay: 0ms;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  z-index: 0;
}
.nav-btn-menu:hover > ul.drop-menu.menu-2 li:nth-child(2) {
  -webkit-animation-name: menu-2;
  animation-name: menu-2;
  -webkit-animation-duration: 300ms;
  animation-duration: 300ms;
  -webkit-animation-delay: 120ms;
  animation-delay: 120ms;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  z-index: 1;
}
.nav-btn-menu:hover > ul.drop-menu.menu-2 li:nth-child(3) {
  -webkit-animation-name: menu-2;
  animation-name: menu-2;
  -webkit-animation-duration: 300ms;
  animation-duration: 300ms;
  -webkit-animation-delay: 240ms;
  animation-delay: 240ms;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  z-index: 2;
}
@-webkit-keyframes menu-2 {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  50% {
    opacity: 1;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes menu-2 {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  50% {
    opacity: 1;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
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
  padding: rem;
}
.header--icon {
  width: 1.65rem;
  height: 1.65rem;
}
.header--button {
  margin: 0;
  padding: 20px;
  width: 57px;
  cursor: pointer;
  border: 1px solid transparent;
  background-color: transparent;
}
.header--button:focus {
  outline: 0;
}

.header__link > i {
  color: #2170e7;
  font-size: 1.8rem;
}

.header__link > img {
  padding: 12px 10px 10px;
  border-radius: 20px;
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
  padding: 8px 10px;
  color: #2170e7;
  cursor: pointer;
}

.btn-nav > i {
  font-size: 30px;
  margin-top: 3px;
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
  right: 10px;
  bottom: 18px;
  position: relative;
  padding: 2.5px 5px;
  color: #fff;
  font-size: 12px;
  font-family: Arial;
  font-weight: bold;
  text-align: center;
  background-color: #4f8eec;
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
.card2 {
  background: white;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  -moz-border-radius: 24px;
  -webkit-border-radius: 24px;
  border-radius: 10px;
  margin-bottom: 2rem;
  position: fixed;
  right: 5px;
  top: 58px;
  color: rgba(41, 50, 65, 0.8);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
  font-size: 14px;
  font-weight: 400;
  width: 20rem;
}

.header-info {
  background-color: #7fb4fa;
  padding: 10px 10px 10px 10px;
  margin-bottom: 10px;
  border-radius: 10px;
}

.card {
  background: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  -moz-border-radius: 24px;
  -webkit-border-radius: 24px;
  border-radius: 24px;
  margin-bottom: 2rem;
  position: fixed;
  right: 5px;
  top: 58px;
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
  max-height: 200px;
  overflow: auto;
}

.timeline > ul > li.blue > div > div > i {
  color: #297fff;
}

.timeline > ul > li > div > div > i {
  font-size: 8px;
  margin-right: 10px;
  margin-top: 4px;
}

.timeline > ul > li .event-content span.event-title {
  color: #3e4754;
}

.timeline > ul > li {
  cursor: pointer;
}

.timeline > ul > li .event-content .event-title-box {
  display: flex;
  flex-direction: row;
}

.timeline > ul > li .event-content span {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 13px;
  color: rgba(41, 50, 65, 0.5);
}

.timeline > ul > li .event-content span.time {
  font-size: 11px;
  font-weight: 400;
  color: rgba(41, 50, 65, 0.5);
}

.timeline > a {
  text-decoration: none;
  color: #4f8eec;
}

.userName-location {
  color: #343a40;
  font-weight: 600;
  margin-right: 20px;
  padding: 5px 8px;
  border-radius: 15px;
  font-weight: 6500;
  font-size: 14px;
}

.location-content {
  color: black;
  margin-right: 50px;
}
</style>
