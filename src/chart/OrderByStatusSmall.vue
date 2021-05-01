<template>
  <div :key="check">
    <div v-if="getChartStatus != null && getChartStatus.length > 0">
      <Chart
        type="pie"
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
      this.options.title.text = "Repair Records by Status";
    } else {
      this.options.title.text = "No Data";
    }
    this.options.title.display = this.showTitle;
    this.check++;
  },
  computed: {
    ...mapGetters("maintenanceOrder", ["getChartStatus"]),
  },
  methods: {
    ...mapActions("maintenanceOrder", ["setChartStatus"]),
  },

  data() {
    return {
      check: 1,
      basicData: {
        datasets: [
          {
            data: [],
            backgroundColor: [
              "rgb(99 255 151)",
              "rgb(255, 0, 0)",
            ],
            hoverBackgroundColor: [
              "rgba(99, 255, 151, 0.7)",
              "rgba(122, 241, 255, 0.7)",
            ],
            borderWidth: 1
          },
        ],
      },
      options: {
        legend: {
          position: "left",
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
          text: "Repair Records by Status",
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
