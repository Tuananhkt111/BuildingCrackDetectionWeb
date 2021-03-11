import ApiHelper from "./ApiHelper.js";
import urlConstants from "../util/urlConstants.js";

export const flightApi = {
  getAll,
};

async function getAll() {
  const res = await ApiHelper.get(urlConstants.FLIGHT_URL);
  return res.data;
}
export default {
  getAll,
};
