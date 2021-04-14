import maintenanceOrderApi from "../apis/maintenanceOrder";

const maintenanceOrderStore = {
  namespaced: true,
  state: {
    maintenanceOrderList: [],
    status: ["WaitingForRepair", "Completed"],
    schedule: [],
    chartStatus: [],
    chartExpense: [],
    countOrders: 0,
    expenseTotal: 0,
    averageAssessment: 0,
    maintenanceOrder: null
  },

  getters: {
    getMaintenanceOrderList(state) {
      return state.maintenanceOrderList;
    },
    getStatusList(state) {
      return state.status;
    },
    getSchedule(state) {
      for (let index = 0; index < this.maintenanceOrderList.length; index++) {
        const tmp = null;
        tmp.id = index;
        tmp.title =
          this.maintenanceOrderList[index].locationName +
          "-" +
          this.maintenanceOrderList[index].status;
        tmp.start = this.maintenanceOrderList[index].maintenanceDate;
        this.schedule.push(tmp);
      }
      return state.schedule;
    },
    getChartStatus(state) {
      return state.chartStatus;
    },
    getChartExpense(state) {
      return state.chartExpense;
    },
    getOrdersCount(state) {
      return state.countOrders;
    },
    getExpenseTotal(state) {
      return state.expenseTotal;
    },
    getAverageAssessment(state) {
      return state.averageAssessment;
    },
    getMaintenanceOrder(state) {
      return state.maintenanceOrder;
    },
  },

  mutations: {
    setMaintenanceOrderList(state, maintenanceOrderList) {
      state.maintenanceOrderList = maintenanceOrderList;
    },
    setMaintenanceOrder(state, maintenanceOrder) {
      state.maintenanceOrder = maintenanceOrder;
    },
    setChartStatus(state, chartStatus) {
      state.chartStatus = chartStatus;
    },
    setChartExpense(state, chartExpense) {
      state.chartExpense = chartExpense;
    },
    setOrdersCount(state, value) {
      state.countOrders = value;
    },
    setExpenseTotal(state, value) {
      state.expenseTotal = value;
    },
    setAverageAssessment(state, value) {
      state.averageAssessment = value;
    },
  },

  actions: {
    async setMaintenanceOrderList({ commit }) {
      const res = await maintenanceOrderApi.getAll();
      if (res) {
        for (let index = 0; index < res.length; index++) {
          res[index].maintenanceDate = new Date(
            res[index].maintenanceDate + "Z"
          );
          res[index].created = new Date(
            res[index].created + "Z"
          );
          res[index].lastModified = new Date(
            res[index].lastModified + "Z"
          );
          res[index].assessmentDate = new Date(
            res[index].assessmentDate + "Z"
          );
          res[index].index = index + 1;
          var crack = res[index].cracks;
          for (let index2 = 0; index2 < crack.length; index2++) {
            res[index].cracks[index2].index = index2 + 1;  
            res[index].cracks[index2].created = new Date(res[index].cracks[index2].created + "Z");
          }
        }
        commit("setMaintenanceOrderList", res.filter((mo) => mo.status !== "WaitingForConfirm"));
      }
    },

    async setMaintenanceOrder({ commit }, id) {
      const res = await maintenanceOrderApi.getById(id);
        res.maintenanceDate = new Date(res.maintenanceDate + "Z");
        res.created = new Date(res.created + "Z");
        res.lastModified = new Date(res.lastModified + "Z");
      if (res) {
        commit("setMaintenanceOrder", res);
      }
    },

    async setChartStatus({ commit }, filterChart) {
      if (filterChart != null) {
        const res = await maintenanceOrderApi.countOrderByStatus(
          filterChart.selectedLocation.toString(),
          filterChart.period,
          filterChart.selectedYear
        );
        if (res) {
          commit("setChartStatus", res);
        } else {
          commit("setChartStatus", null);
        }
      }
    },

    async setChartExpense({ commit }, filterChart) {
      if (filterChart != null) {
        const res = await maintenanceOrderApi.getExpensesOrder(
          filterChart.selectedLocation.locationId,
          filterChart.selectedYear
        );
        if (res) {
          commit("setChartExpense", res);
        } else {
          commit("setChartExpense", null);
        }
      }
    },

    async setOrdersCount({ commit }, filterChart) {
      if (filterChart != null) {
        const res = await maintenanceOrderApi.getOrdersCount(
          filterChart.selectedLocation.locationId,
          filterChart.selectedYear
        );
        if (res) {
          commit("setOrdersCount", res);
        } else {
          commit("setOrdersCount", 0);
        }
      }
    },

    async setExpenseTotal({ commit }, filterChart) {
      if (filterChart != null) {
        const res = await maintenanceOrderApi.getExpensesOrderTotal(
          filterChart.selectedLocation.locationId,
          filterChart.selectedYear
        );
        if (res) {
          commit("setExpenseTotal", res);
        } else {
          commit("setExpenseTotal", 0);
        }
      }
    },

    async setAverageAssessment({ commit }, filterChart) {
      if (filterChart != null) {
        const res = await maintenanceOrderApi.getAverageAssessment(
          filterChart.selectedLocation.locationId,
          filterChart.selectedYear
        );
        if (res) {
          commit("setAverageAssessment", res);
        } else {
          commit("setAverageAssessment", 0);
        }
      }
    },
  },
};

export default maintenanceOrderStore;
