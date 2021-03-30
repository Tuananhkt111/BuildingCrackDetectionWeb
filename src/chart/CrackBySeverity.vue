<template>
  <Chart type="doughnut" :data="basicData" :options="options" :key="check" />
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
    await this.setChartSeverity(this.data);
    if (this.getChartSeverity != null) {
      this.getChartSeverity.forEach((x) => {
        this.basicData.labels.push(x.key);
        this.basicData.datasets[0].data.push(x.value);
      });
      this.options.title.text = "Crack";
    } else {
      this.options.title.text = "No Crack Found";
    }

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
            backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
            hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "Cracks",
          fontSize: 18,
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

<style></style>
