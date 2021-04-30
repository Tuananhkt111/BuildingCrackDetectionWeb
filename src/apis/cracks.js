import ApiHelper from "./ApiHelper.js";
import urlConstants from "../util/urlConstants.js";

export const crackApi = {
  getAll,
  getById,
  rejectCrack,
  verifyCrack,
  countCrack,
  countCrackBySeverity,
  countCrackByLocationsAndSeverity,
  countCrackByStatusList,
  addHighSeverityToQueue,
  remomveLowSeverity
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

async function countCrack(locationId, year) {
  const res = await ApiHelper.get(
    urlConstants.CRACK_URL +
      "/count?year=" +
      year +
      "&locationId=" +
      locationId
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
  if (res.status == 200) {
    return res.data;
  } else return null;
}

async function countCrackByLocationsAndSeverity(locationId, year) {
  const res = await ApiHelper.get(
    urlConstants.CRACK_URL +
      "/count/location-and-severity?year=" +
      year +
      "&locationId=" +
      locationId
  );
  if (res.status == 200) {
    return res.data;
  } else return null;
}

async function addHighSeverityToQueue(crackId) {
  const payload = [crackId];
  const res = await ApiHelper.post(urlConstants.MAINTEANANCE_ORDER_URL + "/queue" ,payload);
  if (res.status == 200) {
    return res;
  } else return res;
}

async function remomveLowSeverity(crackId) {
  const payload = [crackId];
  const res = await ApiHelper.delete(urlConstants.MAINTEANANCE_ORDER_URL + "/queue" ,{data: payload});
  if (res.status == 200) {
    return res;
  } else return res;
}

export default {
  getAll,
  getById,
  rejectCrack,
  verifyCrack,
  countCrack,
  countCrackBySeverity,
  countCrackByLocationsAndSeverity,
  countCrackByStatusList,
  addHighSeverityToQueue,
  remomveLowSeverity
};
