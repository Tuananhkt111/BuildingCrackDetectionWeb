import ApiHelper from "./ApiHelper.js";
import urlConstants from "../util/urlConstants.js";

export const flightApi = {
  getAll,
  getById,
  removeVideo
};

async function getAll() {
  const res = await ApiHelper.get(urlConstants.FLIGHT_URL);
  return res.data;
}
async function getById(id) {
  const res = await ApiHelper.get(urlConstants.FLIGHT_URL + "/" + id);
  if (res != null) {
    return res.data;
  } else return null;
}

async function removeVideo(id) {
  return await ApiHelper.delete(urlConstants.FLIGHT_URL + "/" + id + "/video");
}

async function checkExists(video) {
  return await ApiHelper.get(urlConstants.FLIGHT_URL + "/exists?video=" + video);
}

export default {
  getAll,
  getById,
  removeVideo,
  checkExists
};
