<template>
  <div :key="check">
    <div class="calendar-model">
      <FullCalendar :events="events" :options="options" />
    </div>
  </div>
</template>

<script>
import FullCalendar from "primevue/fullcalendar";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { mapGetters, mapActions } from "vuex";
import webRole from "../util/webRole.js";
import moment from "moment";

export default {
  components: {
    FullCalendar,
  },
  props:["parentMethod"],
  async mounted() {
    await this.setMaintenanceOrderList(this.data);
    if (this.getMaintenanceOrderList != null) {
      this.getMaintenanceOrderList.forEach((x) => {
        this.events.push({
          title: !this.isStaff ? x.locationName : "",
          start: x.maintenanceDate,
          backgroundColor: x.status !== "Completed" ? 'rgb(122 241 255)' : 'rgb(99 255 151)',
          id: x.maintenanceOrderId
        });
      });
    }
    let curDate = new Date();
    this.options.initialDate = moment(curDate).format("YYYY-MM-DD");
    this.check++;
  },
  computed: {
    ...mapGetters("maintenanceOrder", ["getMaintenanceOrderList", "getMaintenanceOrder"]),

    isStaff() {
      let role = JSON.parse(localStorage.getItem("user")).role;
      if (webRole.STAFF_ROLE === role) return true;
      return false;
    },
  },
  methods: {
    ...mapActions("maintenanceOrder", ["setMaintenanceOrderList", "setMaintenanceOrder"]),
    async handleEventClick(arg) {
      await this.setMaintenanceOrder(arg.event.id);
      this.parentMethod(this.getMaintenanceOrder);
    }
  },

  data() {
    return {
      check: 1,
      events: [],
      options: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialDate: "2019-01-01",
        initialView: "dayGridWeek",
        eventClick: this.handleEventClick,
        headerToolbar: {
          left: "prev,next",
          center: "",
          right: "title",
        },
        height: 220,
      },
    };
  },
};
</script>
<style scoped>
.chart-title {
  margin-bottom: 0;
}
</style>
