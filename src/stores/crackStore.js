import crackApi from "../apis/cracks";

const crackStore = {
  namespaced: true,
  state: {
    crackList: [],
    statuses: [
      "UnrecordedRepair",
      "RecordedRepair",
      "UnqualifiedRepair",
      "Fixed",
    ],
    statusList: [
      "UnrecordedRepair",
      "RecordedRepair",
      "Fixed",
      "UnqualifiedRepair",
    ],
    severitys: ["Low", "Medium", "High"],
    countCrack: 0,
    chartSeverity: [],
    chartLocationsAndSeverity: [],
    chartStatus: [],
  },

  getters: {
    getCrackList(state) {
      return state.crackList;
    },
    getCrackListConfirm(state) {
      var tmp = state.crackList.filter(
        (crack) => crack.status !== "Unconfirmed"
      );
      for (let index = 0; index < tmp.length; index++) {
        tmp[index].index = index + 1;
      }
      return tmp;
    },
    getStatusList(state) {
      return state.statuses;
    },
    getStatusListMore(state) {
      return state.statusList;
    },
    getSeveritysList(state) {
      return state.severitys;
    },
    getCountCrack(state) {
      return state.countCrack;
    },
    getChartSeverity(state) {
      return state.chartSeverity;
    },
    getChartLocationsAndSeverity(state) {
      return state.chartLocationsAndSeverity;
    },
    getChartStatus(state) {
      return state.chartStatus;
    },
  },

  mutations: {
    setCrackList(state, crackList) {
      state.crackList = crackList;
    },
    setCountCrack(state, countCrack) {
      state.countCrack = countCrack;
    },
    setChartSeverity(state, chartSeverity) {
      state.chartSeverity = chartSeverity;
    },
    setChartLocationsAndSeverity(state, chartLocationsAndSeverity) {
      state.chartLocationsAndSeverity = chartLocationsAndSeverity;
    },
    setChartStatus(state, chartStatus) {
      state.chartStatus = chartStatus;
    },
  },

  actions: {
    async setCrackList({ commit }) {
      const res = await crackApi.getAll();
      for (let index = 0; index < res.length; index++) {
        res[index].lastModified = new Date(res[index].lastModified + "Z");
        res[index].created = new Date(res[index].created + "Z");
        res[index].accuracy = Math.round(res[index].accuracy * 100);
      }
      if (res) {
        commit("setCrackList", res);
      }
    },
    async setCountCrack({ commit }, data) {
      if (data != null) {
        const res = await crackApi.countCrack(
          data.selectedLocation.locationId,
          data.selectedYear
        );
        if (res) {
          commit("setCountCrack", res);
        } else {
          commit("setCountCrack", 0);
        }
      }
    },

    async setChartSeverity({ commit }, location) {
      if (location != null) {
        var locationId = [];
        var tmp = 0;
        for (let index = 0; index < location.length - 2; index++) {
          locationId[index] = location[index].locationId;
          tmp++;
        }
        var period = location[tmp];
        var year = location[tmp + 1];
        const res = await crackApi.countCrackBySeverity(
          locationId.toString(),
          period,
          year
        );
        if (res) {
          commit("setChartSeverity", res);
        } else {
          commit("setChartSeverity", null);
        }
      }
    },
    async setChartLocationsAndSeverity({ commit }, data) {
      if (data != null) {
        const res = await crackApi.countCrackByLocationsAndSeverity(
          data.selectedLocation.locationId,
          data.selectedYear
        );
        if (res) {
          commit("setChartLocationsAndSeverity", res);
        } else {
          commit("setChartLocationsAndSeverity", null);
        }
      }
    },

    async setChartStatus({ commit }, filterChart) {
      if (filterChart != null) {
        const res = await crackApi.countCrackByStatusList(
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
  },
};

export default crackStore;
