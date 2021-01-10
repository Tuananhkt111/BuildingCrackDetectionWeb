import ApiHelper from "./ApiHelper.js";
import urlConstants from "../util/urlConstants.js";

export const notificationApi = {
  getAll,
  deleteNoti,
};

async function getAll() {
  const res = await ApiHelper.get(urlConstants.NOTIFICATION_URL);
  return res.data;
}
async function deleteNoti(id) {
  const tmp = JSON.stringify(id);
  const data = {
    tmp
  };
  console.log(data);
  const res = await ApiHelper.delete(urlConstants.NOTIFICATION_URL, data);
  return res;
}
export default {
  getAll,
  deleteNoti,
};
