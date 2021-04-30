<template>
  <div :key="check">
    <div v-if="getChartStatus != null && getChartStatus.length > 0">
      <Chart
        type="horizontalBar"
        :data="basicData"
        :options="options"
        :key="check"
      />
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
    await this.setChartStatus(this.data);
    if (this.setChartStatus != null) {
      this.getChartStatus.forEach((x) => {
        this.basicData.labels.push(x.key);
        this.basicData.datasets[0].data.push(x.value);
      });
      this.options.title.text = "Cracks by Status";
    } else {
      this.options.title.text = "No Data";
    }
    this.options.title.display = this.showTitle;
    this.check++;
  },
  computed: {
    ...mapGetters("crack", ["getChartStatus"]),
  },
  methods: {
    ...mapActions("crack", ["setChartStatus"]),
  },

  data() {
    return {
      check: 1,
      basicData: {
        datasets: [
          {
            data: [],
            backgroundColor: [
              "rgb(137 191 220)",
              "rgb(81 216 175)",
              "rgb(255 180 85)",
              "rgb(253 81 125)",
              "rgb(102, 153, 153)",
            ],
            hoverBackgroundColor: [
              "rgba(137, 191, 220, 0.7)",
              "rgba(81, 216, 175, 0.7)",
              "rgba(255, 180, 85, 0.7)",
              "rgba(253 81 125, 0.7)",
              "rgba(102, 153, 153, 0.7)",
            ],
            categoryPercentage: 0.9,
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
          display: false,
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
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
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
