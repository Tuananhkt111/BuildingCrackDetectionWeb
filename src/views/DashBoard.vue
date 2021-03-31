<template>
  <div>
    <div class="p-mb-4 main-layout-details">
      <div class="p-inputgroup">
        <Dropdown v-model="period" :options="periods"> </Dropdown>
        <Dropdown v-model="selectedYear" :options="years"></Dropdown>
        <MultiSelect
          v-model="selectedLocation"
          :options="getLocationList"
          optionLabel="name"
        >
        </MultiSelect>
        <Button label="Filter" icon="pi pi-filter" class="" @click="filter" />
      </div>
    </div>
    <div class="p-d-flex p-al-center p-jc-around">
      <div class="box box1">
        <div class="box-title">
          <span class="box-name">Unconfirm Cracks</span>
          <span class="box-count">{{ getCountCrackUnConfirm }}</span>
        </div>
        <div>
          <img class="box-img" src="../asset/box1.png" />
        </div>
      </div>
      <div class="box box2">
        <div class="box-title">
          <span class="box-name">Unrecorded Repair Cracks</span>
          <span class="box-count">{{ getCountCrackUnrecordedRepair }}</span>
        </div>
        <img class="box-img" src="../asset/box2.png"/>
      </div>
      <div class="box box3">
        <div class="box-title">
          <span class="box-name">Recorded Repair Cracks</span>
          <span class="box-count">{{ getCountCrackRecordedRepair }}</span>
        </div>
        <img class="box-img" src="../asset/box3.png" />
      </div>
      <div class="box box4">
        <div class="box-title">
          <span class="box-name">Fixed Cracks</span>
          <span class="box-count">{{ getCountCrackFixed }}</span>
        </div>
        <img class="box-img" src="../asset/box4.png"/>
      </div>
    </div>
    <div class="p-d-flex p-al-center p-jc-between">
      <div class="main-layout-details-chart" style="width: 49%">
        <Chart :data="data" :key="check1"></Chart>
      </div>
      <div class="p-col-6 main-layout-details-chart" style="width: 49%">
        <ChartAssessment :data="data" :key="check2"></ChartAssessment>
      </div>
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

.box {
  text-align: left;
  border-radius: 24px;
  height: 120px;
  width: 24%;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.box-title {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.box-name {
  font-size: 19px;
  display: block;
  width: 100%;
  margin: 4px 0 0 4px;
  color: #ffffff;
  opacity: 0.8;
}
.box-count {
  color: #ffffff;
  margin-left: 4px;
  font-size: 32px;
  display: block;
  font-weight: bold;
}
.box-img {
  height: 100px;
}
::v-deep(.p-button) {
  background: #007dfe;
  color: #ffffff;
  border: 1px solid #007dfe;
  margin: 0;
  outline: 0 none;
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
}

::v-deep(.p-button.p-button-success, .p-buttonset.p-button-success
    > .p-button, .p-splitbutton.p-button-success > .p-button) {
  color: #ffffff;
  background: #55e757;
  border: 1px solid #55e757;
}

::v-deep(.p-button.p-button-info, .p-buttonset.p-button-info
    > .p-button, .p-splitbutton.p-button-info > .p-button) {
  color: #ffffff;
  background: #7fb4fa;
  border: 1px solid #7fb4fa;
}

.main-layout-details {
  border-radius: 24px;
  background-color: white;
  padding: 4px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  width: 50%;
}

.main-layout-details-chart {
  border-radius: 24px;
  background-color: white;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  width: 50%;
  margin-top: 28px;
}

.active .main-layout-details {
  margin-left: 266.5px;
  transition: all 0.2s;
}
.inactive .main-layout-details {
  margin-left: 0;
  transition: all 0.2s;
}

.p-inputgroup-addon:first-child,
.p-inputgroup button:first-child,
.p-inputgroup input:first-child,
.p-inputgroup > .p-inputwrapper:first-child,
.p-inputgroup > .p-inputwrapper:first-child > .p-inputtext {
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
}
.p-inputgroup-addon:last-child,
.p-inputgroup button:last-child,
.p-inputgroup input:last-child,
.p-inputgroup > .p-inputwrapper:last-child,
.p-inputgroup > .p-inputwrapper:last-child > .p-inputtext {
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
}
</style>
