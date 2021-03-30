import crackApi from "../apis/cracks";

const crackStore = {
  namespaced: true,
  state: {
    crackList: [],
    statuses: ["UnrecordedRepair", "RecordedRepair", "Fixed"],
    severitys: ["Low", "Medium", "High"],
    countCrackFixed: 0,
    countCrackRecordedRepair: 0,
    countCrackUnrecordedRepair: 0,
    countCrackUnConfirm: 0,
    chartSeverity: [],
    chartAssessment: [],
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
    getSeveritysList(state) {
      return state.severitys;
    },
    getCountCrackFixed(state) {
      return state.countCrackFixed;
    },
    getCountCrackRecordedRepair(state) {
      return state.countCrackRecordedRepair;
    },
    getCountCrackUnrecordedRepair(state) {
      return state.countCrackUnrecordedRepair;
    },
    getCountCrackUnConfirm(state) {
      return state.countCrackUnConfirm;
    },
    getChartSeverity(state) {
      return state.chartSeverity;
    },
    getChartAssessment(state) {
      return state.chartAssessment;
    },
  },

  mutations: {
    setCrackList(state, crackList) {
      state.crackList = crackList;
    },
    setCountCrackFixed(state, countCrackFixed) {
      state.countCrackFixed = countCrackFixed;
    },

    setCountCrackRecordedRepair(state, countCrackRecordedRepair) {
      state.countCrackRecordedRepair = countCrackRecordedRepair;
    },
    setCountCrackUnrecordedRepair(state, countCrackUnrecordedRepair) {
      state.countCrackUnrecordedRepair = countCrackUnrecordedRepair;
    },
    setCountCrackUnConfirm(state, countCrackUnConfirm) {
      state.countCrackUnConfirm = countCrackUnConfirm;
    },
    setChartSeverity(state, chartSeverity) {
      state.chartSeverity = chartSeverity;
    },
    setChartAssessment(state, chartAssessment) {
      state.chartAssessment = chartAssessment;
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
        commit(
          "setCrackList",
          res.filter(
            (crack) =>
              !(
                crack.status === "UnrecordedRepair" &&
                crack.maintenanceOrderId !== null
              )
          )
        );
      }
    },
    async setCountCrackFixed({ commit }, location) {
      var locationId = [];
      var tmp = 0;
      for (let index = 0; index < location.length - 2; index++) {
        locationId[index] = location[index].locationId;
        tmp++;
      }
      var period = location[tmp];
      var year = location[tmp + 1];
      const fixed = await crackApi.countCrackByStatus(
        locationId.toString(),
        "Fixed",
        period,
        year
      );
      commit("setCountCrackFixed", fixed);
    },

    async setCountCrackUnrecordedRepair({ commit }, location) {
      var locationId = [];
      var tmp = 0;
      for (let index = 0; index < location.length - 2; index++) {
        locationId[index] = location[index].locationId;
        tmp++;
      }
      var period = location[tmp];
      var year = location[tmp + 1];
      const UnrecordedRepair = await crackApi.countCrackByStatus(
        locationId.toString(),
        "UnrecordedRepair",
        period,
        year
      );
      commit("setCountCrackUnrecordedRepair", UnrecordedRepair);
    },

    async setCountCrackRecordedRepair({ commit }, location) {
      var locationId = [];
      var tmp = 0;
      for (let index = 0; index < location.length - 2; index++) {
        locationId[index] = location[index].locationId;
        tmp++;
      }
      var period = location[tmp];
      var year = location[tmp + 1];
      const RecordedRepair = await crackApi.countCrackByStatus(
        locationId.toString(),
        "RecordedRepair",
        period,
        year
      );
      commit("setCountCrackRecordedRepair", RecordedRepair);
    },

    async setCountCrackUnConfirm({ commit }, location) {
      var locationId = [];
      var tmp = 0;
      for (let index = 0; index < location.length - 2; index++) {
        locationId[index] = location[index].locationId;
        tmp++;
      }
      var period = location[tmp];
      var year = location[tmp + 1];
      const unConfirmed = await crackApi.countCrackByStatus(
        locationId.toString(),
        "UnConfirmed",
        period,
        year
      );
      commit("setCountCrackUnConfirm", unConfirmed);
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
    async setChartAssessment({ commit }, location) {
      if (location != null) {
        var locationId = [];
        var tmp = 0;
        for (let index = 0; index < location.length - 2; index++) {
          locationId[index] = location[index].locationId;
          tmp++;
        }
        var period = location[tmp];
        var year = location[tmp + 1];
        const res = await crackApi.countCrackByAssessment(
          locationId.toString(),
          period,
          year
        );
        if (res) {
          commit("setChartAssessment", res);
        } else {
          commit("setChartAssessment", null);
        }
      }
    },
  },
};

export default crackStore;
