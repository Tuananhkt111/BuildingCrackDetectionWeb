<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-body">
        <div
          class="alert alert-info"
          v-for="item in getNotificationList"
          v-bind:key="item"
        >
          <p class="title">
            <i class="pi pi-check"></i><strong>{{ item.title }}</strong>
            <button
              type="button"
              class="close"
              @click="deleteNoti(item.pushNotificationId)"
            >
              ×
            </button>
          </p>
          {{ item.body }}
          <p class="time">{{ callDate(item.created) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import { notificationApi } from "../apis/notification";
export default {
  components: {},
  computed: {
    ...mapGetters("noti", ["getNotificationList"]),
    data() {
      return this.getNotificationList.filter(noti => !noti.isRead);
    },
  },
  async created() {
    await this.setNotificationList();
  },

  methods: {
    ...mapActions("noti", ["setNotificationList"]),
    callDate(date) {
      const date1 = new Date(date);
      return moment(date1).format("DD-MM-YYYY HH:mm:ss");
    },
    deleteNoti(id){
      notificationApi.deleteNoti(id);
    },
  },
};
</script>
<style scoped>
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
</style>
