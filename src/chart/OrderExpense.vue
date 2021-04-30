<template>
  <Chart type="line" :data="basicData" :options="options" :key="check" />
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
    await this.setChartExpense(this.data);
    if (this.getChartExpense != null) {
      this.getChartExpense.forEach((x) => {
        this.basicData.labels.push(x.key);
        this.basicData.datasets[0].data.push(x.value);
      });
    }
    this.options.title.display = this.showTitle;
    this.check++;
  },
  computed: {
    ...mapGetters("maintenanceOrder", ["getChartExpense"]),
  },
  methods: {
    ...mapActions("maintenanceOrder", ["setChartExpense"]),
  },

  data() {
    return {
      check: 1,
      basicData: {
        labels: [],
        datasets: [
          {
            label: "Repair Expense",
            data: [],
            fill: false,
            borderColor: "#2196f3",
            lineTension: 0,
          },
        ],
      },
      options: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 50,
            fontSize: 14,
          },
        },
        tooltips: {
          bodyFontSize: 16,
        },
        title: {
          display: false,
          text: "Repair Expense",
          fontSize: 24,
          position: "top",
        },
        pointBorderWidth: 5,
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

<style scoped></style>
