import ApiHelper from "./ApiHelper.js";
import urlConstants from "../util/urlConstants.js";

export const crackApi = {
  getAll,
  getById,
  rejectCrack,
  verifyCrack,
  countCrackByStatus,
  countCrackBySeverity,
  countCrackByAssessment,
  countCrackByStatusList,
  addHighSeverityToQueue
};

async function getAll() {
  const res = await ApiHelper.get(urlConstants.CRACK_URL);
  return res.data;
}

async function getById(id) {
  const res = await ApiHelper.get(urlConstants.CRACK_URL + "/" + id);
  return res.data;
}
async function rejectCrack(id) {
  const res = await ApiHelper.delete(urlConstants.CRACK_URL + "/" + id);
  return res;
}

async function verifyCrack(id, position, description, severity) {
  const data = {
    position: position,
    description: description,
    severity: severity,
  };
  const res = await ApiHelper.post(urlConstants.CRACK_URL + "/" + id, data);
  return res;
}

async function countCrackByStatus(locationId, status, period, year) {
  const res = await ApiHelper.get(
    urlConstants.CRACK_URL +
      "/count/status?period=" +
      period +
      "&year=" +
      year +
      "&locationIdsStr=" +
      locationId +
      "&status=" +
      status
  );
  if (res.status == 200) {
    return res.data;
  } else return 0;
}

async function countCrackByStatusList(locationId, period, year) {
  const res = await ApiHelper.get(
    urlConstants.CRACK_URL +
      "/count/status-list?period=" +
      period +
      "&year=" +
      year +
      "&locationIdsStr=" +
      locationId
  );
  if (res.status == 200) {
    return res.data;
  } else return 0;
}

async function countCrackBySeverity(locationId, period, year) {
  const res = await ApiHelper.get(
    urlConstants.CRACK_URL +
      "/count/severity?period=" +
      period +
      "&year=" +
      year +
      "&locationIdsStr=" +
      locationId
  );
  console.log(res);
  if (res.status == 200) {
    return res.data;
  } else return null;
}

async function countCrackByAssessment(locationId, period, year) {
  const res = await ApiHelper.get(
    urlConstants.CRACK_URL +
      "/count/assessment?period=" +
      period +
      "&year=" +
      year +
      "&locationIdsStr=" +
      locationId
  );
  if (res.status == 200) {
    return res.data;
  } else return null;
}

async function addHighSeverityToQueue(crackId) {
  const payload = [crackId];
  const res = await ApiHelper.post(urlConstants.MAINTEANANCE_ORDER_URL + "/queue" ,payload);
  console.log(res);
  if (res.status == 200) {
    return res.data;
  } else return res;
}

export default {
  getAll,
  getById,
  rejectCrack,
  verifyCrack,
  countCrackByStatus,
  countCrackBySeverity,
  countCrackByAssessment,
  countCrackByStatusList,
  addHighSeverityToQueue
};
