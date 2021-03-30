<template>
  <div>
    <div class="p-mb-3">
      <Dropdown v-model="selectedYear" :options="years"> </Dropdown>
      <Dropdown v-model="period" :options="periods"> </Dropdown>
      <MultiSelect
        v-model="selectedLocation"
        :options="getLocationList"
        optionLabel="name"
      >
      </MultiSelect>
      <Button
        label="Filter"
        icon="pi pi-check"
        @click="filter"
        style="background-color:#ebf8f1;border:none;color:#4cc788"
      />
      <Button
        label="Refesh"
        icon="pi pi-circle"
        @click="refresh"
        style="background-color:#ebf8f1;border:none;color:#4cc788"
      />
    </div>
    <hr class="p-mb-3" />
    <div class="p-grid">
      <div class="p-col box1" style="margin-left:20px">
        <span class="box-name">Unconfirm Cracks</span>
        <span class="box-count">{{ getCountCrackUnConfirm }}</span>
        <img class="box-img" src="../asset/box1.png" />
      </div>
      <div class="p-col box2">
        <span class="box-name">Unrecorded Repair Cracks</span>
        <span class="box-count">{{ getCountCrackUnrecordedRepair }}</span>
        <img class="box-img" src="../asset/box2.png" style="width:40px" />
      </div>
      <div class="p-col box3">
        <span class="box-name">Recorded Repair Cracks</span>
        <span class="box-count">{{ getCountCrackRecordedRepair }}</span>
        <img class="box-img" src="../asset/box3.png" />
      </div>
      <div class="p-col box4">
        <span class="box-name">Fixed Cracks</span>
        <span class="box-count">{{ getCountCrackFixed }}</span>
        <img class="box-img" src="../asset/box4.png" style="width:40px" />
      </div>
    </div>
    <div class="p-grid">
      <Chart class="p-col-6" :data="data" :key="check1"></Chart>
      <ChartAssessment
        class="p-col-6"
        :data="data"
        :key="check2"
      ></ChartAssessment>
    </div>
  </div>
</template>

<script>
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import Chart from "../chart/CrackBySeverity.vue";
import { mapGetters, mapActions } from "vuex";
import ChartAssessment from "../chart/CrackByAssessment.vue";
export default {
  components: {
    Dropdown,
    MultiSelect,
    Chart,
    ChartAssessment,
  },

  data() {
    return {
      years: [],
      selectedYear: null,
      selectedLocation: [],
      periods: [],
      period: "",
      tmpPeriod: 0,
      data: null,
      check1: 0,
      check2: 0,
    };
  },

  computed: {
    ...mapGetters("location", ["getLocationList"]),
    ...mapGetters("crack", [
      "getCountCrackFixed",
      "getCountCrackRecordedRepair",
      "getCountCrackUnrecordedRepair",
      "getCountCrackUnConfirm",
    ]),
  },

  methods: {
    ...mapActions("location", ["setLocationList"]),
    ...mapActions("crack", [
      "setCountCrackUnConfirm",
      "setCountCrackFixed",
      "setCountCrackUnrecordedRepair",
      "setCountCrackRecordedRepair",
    ]),

    async filter() {
      if (this.period == "Period 1") {
        this.tmpPeriod = 1;
      } else if (this.period == "Period 2") {
        this.tmpPeriod = 2;
      } else if (this.period == "Period 3") {
        this.tmpPeriod = 3;
      }
      this.data = this.selectedLocation.slice();
      this.data.push(this.tmpPeriod);
      this.data.push(this.selectedYear);
      Promise.all([
        this.setCountCrackFixed(this.data),
        this.setCountCrackUnrecordedRepair(this.data),
        this.setCountCrackRecordedRepair(this.data),
        await this.setCountCrackUnConfirm(this.data),
      ]);
      this.check1++;
      this.check2++;
    },

    async refresh() {
      this.selectedLocation = this.getLocationList;
      var d = new Date();
      this.selectedYear = d.getFullYear();
      var n = d.getMonth();
      if (n > 0 && n < 5) {
        this.period = "Period 1";
        this.tmpPeriod = 1;
      } else if (n >= 5 && n < 8) {
        this.period = "Period 2";
        this.tmpPeriod = 2;
      } else if (n >= 8 && n <= 12) {
        this.period = "Period 3";
        this.tmpPeriod = 3;
      }
      this.data = this.selectedLocation.slice();
      this.data.push(this.tmpPeriod);
      this.data.push(this.selectedYear);
      Promise.all([
        this.setCountCrackFixed(this.data),
        this.setCountCrackUnrecordedRepair(this.data),
        this.setCountCrackRecordedRepair(this.data),
        await this.setCountCrackUnConfirm(this.data),
      ]);
      this.check1++;
      this.check2++;
    },
    async setDefault() {
      var d = new Date();
      this.selectedYear = d.getFullYear();
      this.years.push(this.selectedYear);
      this.years.push(this.selectedYear - 1);
      this.years.push(this.selectedYear - 2);
      var n = d.getMonth();
      this.periods.push("Period 1");
      this.periods.push("Period 2");
      this.periods.push("Period 3");
      if (n > 0 && n < 5) {
        this.period = "Period 1";
        this.tmpPeriod = 1;
      } else if (n >= 5 && n < 8) {
        this.period = "Period 2";
        this.tmpPeriod = 2;
      } else if (n >= 8 && n <= 12) {
        this.period = "Period 3";
        this.tmpPeriod = 3;
      }
      this.data = this.selectedLocation.slice();
      this.data.push(this.tmpPeriod);
      this.data.push(this.selectedYear);
      Promise.all([
        this.setCountCrackFixed(this.data),
        this.setCountCrackUnrecordedRepair(this.data),
        this.setCountCrackRecordedRepair(this.data),
        await this.setCountCrackUnConfirm(this.data),
      ]);
      this.check1++;
      this.check2++;
    },
  },

  async created() {
    await this.setLocationList();
    this.selectedLocation = this.getLocationList;
    await this.setDefault();
  },
};
</script>

<style scoped>
.p-col {
  text-align: left;
  border-radius: 10px;
  margin-top: 10px;
  margin-right: 30px;
  margin-left: 10px;
  height: 100px;
}
.box1 {
  background: linear-gradient(229deg, #fd9a77, #fb827a);
}
.box2 {
  background: linear-gradient(229deg, #8edead, #43c6ac);
}
.box3 {
  background: linear-gradient(248deg, #348ac7, #7474bf);
}
.box4 {
  background: linear-gradient(67deg, #f15f79, #b24592);
}
.box-name {
  font-size: 16px;
  display: block;
  width: 100%;
  margin: 4px 0 0 4px;
  color: #ffffff;
  opacity: 0.8;
}
.box-count {
  color: #ffffff;
  margin-left: 4px;
  font-size: 24px;
  display: block;
  font-weight: bold;
}
.box-img {
  position: relative;
  bottom: 68px;
  left: 160px;
  width: 60px;
  height: 90px;
}
</style>
