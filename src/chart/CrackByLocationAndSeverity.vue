<template>
  <Chart type="bar" :data="basicData" :options="options" :key="check" />
</template>

<script>
import Chart from "primevue/chart";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    Chart,
  },
  props: ["data"],
  async mounted() {
    await this.setChartLocationsAndSeverity(this.data);
    await this.getChartLocationsAndSeverity.forEach((x) => {
      this.basicData.labels.push(x.key);
      this.basicData.datasets[0].data.push(x.values[0]);
      this.basicData.datasets[1].data.push(x.values[1]);
      this.basicData.datasets[2].data.push(x.values[2]);
    });
    this.check++;
  },
  computed: {
    ...mapGetters("crack", ["getChartLocationsAndSeverity"]),
  },
  methods: {
    ...mapActions("crack", ["setChartLocationsAndSeverity"]),
  },
  data() {
    return {
      check: 0,
      basicData: {
        labels: [],
        datasets: [
          {
            label: "Low",
            backgroundColor: "rgb(81 216 175)",
            hoverBackgroundColor: "rgba(81, 216, 175, 0.7)",
            data: [],
          },
          {
            label: "Medium",
            backgroundColor: "rgb(255 180 85)",
            hoverBackgroundColor: "rgba(255, 180, 85, 0.7)",
            data: [],
          },
          {
            label: "High",
            backgroundColor: "rgb(255 74 92)",
            hoverBackgroundColor: "rgba(255, 74, 92, 0.7)",
            data: [],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "Cracks By Severity",
          fontSize: 24,
        },
        legend: {
          position: "top",
          labels: {
            boxWidth: 50,
            fontSize: 14,
          },
        },
        barValueSpacing: 10,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                fontSize: 16,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                fontSize: 16,
              },
            },
          ],
        },
      },
    };
  },
};
</script>

<style></style>
