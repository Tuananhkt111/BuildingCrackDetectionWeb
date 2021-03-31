<template>
  <div :key="check">
    <div v-if="getChartSeverity != null && getChartSeverity.length > 0">
      <Chart type="doughnut" :data="basicData" :options="options" />
    </div>
    <div v-else class="p-d-flex p-ai-center p-jc-center">
      <img src="../asset/2953962.jpg" style="width: 50%;" />
    </div>
  </div>
</template>

<script>
import Chart from "primevue/chart";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    Chart,
  },
  props: ["data", "showTitle"],
  async mounted() {
    await this.setChartSeverity(this.data);
    if (this.getChartSeverity != null) {
      this.getChartSeverity.forEach((x) => {
        this.basicData.labels.push(x.key);
        this.basicData.datasets[0].data.push(x.value);
      });
      this.options.title.text = "Cracks by Severity";
    } else {
      this.options.title.text = "No Data";
    }
    this.options.title.display = this.showTitle;
    this.check++;
  },
  computed: {
    ...mapGetters("crack", ["getChartSeverity"]),
  },
  methods: {
    ...mapActions("crack", ["setChartSeverity"]),
  },

  data() {
    return {
      check: 1,
      basicData: {
        datasets: [
          {
            data: [],
            backgroundColor: [
              "rgb(255 74 92)",
              "rgb(81 216 175)",
              "rgb(255 180 85)",
            ],
            hoverBackgroundColor: [
              "rgba(255,74,92,0.7)",
              "rgba(81, 216, 175, 0.7)",
              "rgba(255, 180, 85, 0.7)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: {
          position: "right",
          labels: {
            boxWidth: 40,
            fontSize: 14,
          },
        },
        tooltips: {
          bodyFontSize: 16,
        },
        title: {
          display: false,
          text: "Cracks by Severity",
          fontSize: 24,
          position: "top",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                display: false,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
    };
  },
};
</script>

<style scoped></style>
