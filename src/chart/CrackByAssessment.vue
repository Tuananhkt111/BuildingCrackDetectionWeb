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
    await this.setChartAssessment(this.data);
    await this.getChartAssessment.forEach((x) => {
      this.basicData.labels.push(x.key);
      this.basicData.datasets[0].data.push(x.value);
    });
    this.check++;
  },
  computed: {
    ...mapGetters("crack", ["getChartAssessment"]),
  },
  methods: {
    ...mapActions("crack", ["setChartAssessment"]),
  },
  data() {
    return {
      check: 0,
      basicData: {
        datasets: [
          {
            label: "Assessment Crack",
            backgroundColor: "#42A5F5",
            data: [],
            borderWidth: 1,
            width: 1,
          },
        ],
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Cracks",
          fontSize: 18,
        },
        scales: {
          yAxes: [
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

<style></style>
