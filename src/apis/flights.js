import ApiHelper from "./ApiHelper.js";
import urlConstants from "../util/urlConstants.js";

export const flightApi = {
  getAll,
  getById,
};

async function getAll() {
  const res = await ApiHelper.get(urlConstants.FLIGHT_URL);
  console.log(res);
  return res.data;
}
async function getById(id) {
  const res = await ApiHelper.get(urlConstants.FLIGHT_URL + "/" + id);
  console.log(res);
  return res.data;
}


export default {
  getAll,
  getById
};
