import ApiHelper from "./ApiHelper.js";
import urlConstants from "../util/urlConstants.js";

export const locationApi = {
  create,
  getAll,
  disable,
  update,
  getAvailable,
};

async function create(locationName, description) {
  const data = {
    name: locationName,
    description: description,
  };
  const res = await ApiHelper.post(urlConstants.LOCATION_URL + "/", data);
  return res;
}

async function getAll() {
  const res = await ApiHelper.get(urlConstants.LOCATION_URL);
  return res.data;
}

async function getAvailable(role, empId) {
  const res = await ApiHelper.get(
    urlConstants.LOCATION_URL + "/available?role=" + role + "&empId=" + empId
  );
  return res.data;
}

async function disable(locationId) {
  const res = await ApiHelper.delete(
    urlConstants.LOCATION_URL + "/" + locationId
  );
  return res;
}

async function update(locationId, locationName, description) {
  const data = {
    name: locationName,
    description: description,
  };
  const res = await ApiHelper.post(
    urlConstants.LOCATION_URL + "/" + locationId + "/",
    data
  );
  return res;
}

export default {
  create,
  getAll,
  disable,
  update,
  getAvailable,
};
