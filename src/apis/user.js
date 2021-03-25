import ApiHelper from "./ApiHelper.js";
import urlConstants from "../util/urlConstants.js";

export const userApi = {
  login,
  logout,
  getAll,
  getUserById,
  deleteUser,
  createUser,
  updateUser,
  resetPassword,
  forgotPassword,
  changePassword,
  changeForgotPassword,
  updateLocationStaff,
};

async function login(userName, password) {
  const token = localStorage.getItem("fcm");
  localStorage.removeItem("fcm");
  const data = {
    userName: userName,
    password: password,
    fcmToken: token,
  };

  const res = await ApiHelper.post(
    urlConstants.USER_URL + "/authenticate",
    data
  );
  if (res != null) {
    localStorage.setItem("jwtToken", res.data.jwtToken);
    const user = await ApiHelper.get(
      urlConstants.USER_URL + "/" + res.data.userId
    );
    localStorage.setItem("user", JSON.stringify(user.data));
    return JSON.stringify(user.data);
  } else {
    return null;
  }
}

async function createUser(role, name, email, phoneNumber, address, location) {
  var locations = [];
  if (role == "Staff" && location != null) {
    locations[0] = location.locationId;
  } else if (location != null) {
    for (let i = 0; i != location.length; i++) {
      locations[i] = location[i].locationId;
    }
  } else {
    locations = [];
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

async function getUserById() {
  const id = JSON.parse(localStorage.getItem("user")).userId;
  const user = await ApiHelper.get(urlConstants.USER_URL + "/" + id);
  localStorage.setItem("user", JSON.stringify(user.data));
  return JSON.stringify(user.data);
}

async function updateUser(
  id,
  name,
  email,
  phoneNumber,
  address,
  location,
  role
) {
  var locations = [];
  if (role == "Manager") {
    for (let i = 0; i != location.length; i++) {
      locations[i] = location[i].locationId;
    }
  } else if (location.locationId != 0) {
    locations[0] = location.locationId;
  } else {
    locations = [];
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

async function changeForgotPassword(id, token, newPass) {
  const data = {
    newPass: newPass,
    token: token,
  };
  const res = await ApiHelper.post(
    urlConstants.USER_URL + "/" + id + "/forgotpass",
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
    urlConstants.USER_URL + "/forgotpass-confirm-w?userName=" + userName
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

function deleteUser(id) {
  return ApiHelper.delete(urlConstants.USER_URL + "/" + id);
}

async function updateLocationStaff(id, location) {
  const payload = [location];
  if (location != 0) {
    const res = await ApiHelper.post(
      urlConstants.USER_URL + "/" + id + "/locations",
      payload
    );
    return res;
  } else {
    const res = await ApiHelper.delete(
      urlConstants.USER_URL + "/" + id + "/locations"
    );
    return res;
  }
}

export default {
  login,
  logout,
  getAll,
  deleteUser,
  getUserById,
  createUser,
  updateUser,
  resetPassword,
  forgotPassword,
  changePassword,
  changeForgotPassword,
  updateLocationStaff,
};
