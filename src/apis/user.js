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
  forgotPassword,
  changePassword,
};

async function login(userName, password) {
  const token = localStorage.getItem("fcm");
  localStorage.removeItem("fcm");
  const data = {
    userName: userName,
    password: password,
    fcmToken : token,
  };

  const res = await ApiHelper.post(
    urlConstants.USER_URL + "/authenticate/manager",
    data
  );
  if (res && res.data) {
    localStorage.setItem("jwtToken", res.data.jwtToken);
    const user = await ApiHelper.get(urlConstants.USER_URL + "/" + res.data.userId);
    localStorage.setItem("user", JSON.stringify(user.data));
  }
  return res.data;
}

async function createUser(role, name, email, phoneNumber, address, location) {
  var locations = [];
  if (role == "Staff" && location != null) {
    locations[0] = location.locationId;
  } else if(location != null) {
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

async function updateUser(id, name, email, phoneNumber, address, location) {
  var locations = [];
  if (location.locationId != null) {
    locations[0] = location.locationId;
  } else {
    locations = [];
    for (let i = 0; i != location.length; i++) {
      locations[i] = location[i].locationId;
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
async function changePassword(id, oldPass, newPass) {
  const data = {
    oldPass: oldPass,
    newPass: newPass,
  };
  const res = await ApiHelper.post(
    urlConstants.USER_URL + "/" + id + "/password",
    data
  );
  return res;
}

async function resetPassword(id) {
  const res = await ApiHelper.post(
    urlConstants.USER_URL + "/" + id + "/resetpass"
  );
  return res;
}
async function forgotPassword(userName) {
  const res = await ApiHelper.post(
    urlConstants.USER_URL + "/forgotpass-confirm?userName=" + userName
  );
  return res;
}
function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
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
  forgotPassword,
  changePassword,
};
