import ApiHelper from "./ApiHelper.js";
import urlConstants from "../util/urlConstants.js";

export const userApi = {
  login,
  logout,
  getAll,
  deleteUser,
  getUsersCount,
  createUser,
  updateUser,
  resetPassword,
  forgotPassword
};

async function login(userName, password) {
  const data = {
    userName: userName,
    password: password,
  };

  const res = await ApiHelper.post(
    urlConstants.USER_URL + "/authenticate",
    data
  );
  if (res && res.data) {
    localStorage.setItem("jwtToken", res.data.jwtToken);
    localStorage.setItem("userId", res.data.userId);
  }
  return res.data;
}

async function createUser(role, name, email, phoneNumber, address, location) {
  var locations = [];
  if(location.locationId != null) {
    locations[0] = location.locationId;
  } else {
    for (let i = 0; i != location.length; i++) {
      locations[i] = location[i].locationId;
    }
  }
  const data = {
    role: role,
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    address: address,
    locationIds: locations,
  };
  const res = await ApiHelper.post(urlConstants.USER_URL + "/", data);
  return res;
}

async function updateUser(id, name, email, phoneNumber, address, location){
  var locations = [];
  if(location.locationId != null) {
    locations[0] = location.locationId;
  } else {
    locations = [];
    for (let i = 0; i != location.length; i++) {
      locations[i] = location[i].locationId;
      console.log(locations[i]);
    }
  }
  const data = {
    phoneNumber: phoneNumber,
    name: name,
    address: address,
    email: email,
    locationIds: locations,
  };
  const res = await ApiHelper.post(urlConstants.USER_URL + "/" + id, data);
  return res;
}

async function resetPassword(id) {
  const res = await ApiHelper.post(urlConstants.USER_URL + "/" + id + "/resetpass");
  return res;
}
async function forgotPassword(userName) {
  const res = await ApiHelper.post(urlConstants.USER_URL + "/forgotpass-confirm?userName=" + userName);
  return res;
}
function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("userId");
}

async function getAll() {
  const res = await ApiHelper.get(urlConstants.USER_URL);
  return res.data;
}

function getUsersCount(dataSearch) {
  const data = {
    role: dataSearch.roleSearch,
    state: dataSearch.status,
    language: dataSearch.language,
    search: dataSearch.languageName,
  };
  return ApiHelper.get(urlConstants.USER_URL + "/count", { params: data });
}

function deleteUser(id) {
  return ApiHelper.delete(urlConstants.USER_URL + "/" + id);
}

export default {
  login,
  logout,
  getAll,
  deleteUser,
  getUsersCount,
  createUser,
  updateUser,
  resetPassword,
  forgotPassword
};
