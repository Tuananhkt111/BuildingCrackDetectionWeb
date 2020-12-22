import ApiHelper from './ApiHelper.js';
import urlConstants from '../util/urlConstants.js';

export const userApi = {
  login,
  logout,
  getUsers,
  deleteUser,
  getUsersCount
};

async function login(userName, password) {
  const data = {
    "userName": userName,
    "password": password
  };
  const res = await ApiHelper.post(urlConstants.USER_URL + "/authenticate", data);
  alert(userName);
  if (res && res.data) {
    alert("ZZ" + res.data);
    alert(urlConstants.USER_URL + "/authenticate" + data);
    localStorage.setItem('jwtToken', res.data.jwtToken);
    alert(localStorage.getItem('jwtToken'));
  }
  return res.data;
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('jwtToken');
}

function getUsers(dataSearch) {
  const data = {
    "role": dataSearch.roleSearch,
    "state": dataSearch.status,
    "language": dataSearch.language,
    "sort": dataSearch.sortOrder,
    "search": dataSearch.fullname,
    "limit": dataSearch.limit,
    "offset": dataSearch.offset
  };
  return ApiHelper.get(urlConstants.USER_URL, {params: data}); 
}

function getUsersCount(dataSearch) {
  const data = {
    "role": dataSearch.roleSearch,
    "state": dataSearch.status,
    "language": dataSearch.language,
    "search": dataSearch.languageName,
  };
  return ApiHelper.get(urlConstants.USER_URL + "/count", {params: data}); 
}

function deleteUser(id) {
  return ApiHelper.delete(urlConstants.USER_URL + "/" + id);
}