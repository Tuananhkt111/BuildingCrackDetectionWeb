<template>
  <div class="top-nav-layout">
    <div class="top-nav p-d-flex p-ai-center p-jc-between">
      <div class="p-d-flex p-ai-center p-jc-between" @click="toggleSidebar">
        <img
          src="/assets/logoCrack.png"
          alt="logo"
          height="20"
          class="p-mr-2"
          style="padding-left:20px"
        />
        <span class="logo-text">BCD System</span>
      </div>
      <div class="top-nav-right p-d-flex p-ai-center p-jc-between">
        <div
          class="btn-nav"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_tmenu"
        >
          <i class="pi pi-bell" style="fontSize: 1.1rem"
            ><div class="count" v-if="getCount != 0">{{ getCount }}</div></i
          >
        </div>
        <OverlayPanel
          ref="op"
          style="width: 350px; margin-top:-20px; margin-right: 20px ; position : absolute"
        >
          <ScrollPanel
            style="width: 100%; max-height: 250px; "
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
import userApi from "../apis/user.js";
import moment from "moment";
import { notificationApi } from "../apis/notification";
export default {
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
  },
  async created() {
    if (this.getUnReadNotificationList != null) {
      this.showListNoti = true;
    }
    await this.setNotificationList();
  },
  mounted() {
    this.prepareFcm();
  },
  data() {
    return {
      display: false,
      showListNoti: false,
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
    toggleSidebar() {
      this.setIsActive(!this.getIsActive);
    },
  },
};
</script>
<style scoped>
.top-nav-layout {
  position: sticky;
  top: 0;
  z-index: 2;
}
.top-nav {
  background-color: #0388e5;
  border: 0;
  border-radius: 0 0 3px 3px;
}
.logo-text {
  color: white;
  font-size: 20px;
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
  padding: 15px;
  padding-right: 40px;
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
</style>
