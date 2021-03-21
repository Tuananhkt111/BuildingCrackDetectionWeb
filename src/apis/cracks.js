import ApiHelper from "./ApiHelper.js";
import urlConstants from "../util/urlConstants.js";

export const crackApi = {
  getAll,
  getById,
  rejectCrack,
  verifyCrack,
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

export default {
  getAll,
  getById,
  rejectCrack,
  verifyCrack,
};
