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
  const payload = [id];
<<<<<<< HEAD
  return await ApiHelper.delete(urlConstants.NOTIFICATION_URL, {
    data: payload,
  });
=======
  const res = await ApiHelper.delete(urlConstants.NOTIFICATION_URL, {data: payload});
  return res;
>>>>>>> 7e3f171821260bd4121469a9f8962e226d82a30a
}
export default {
  getAll,
  deleteNoti,
};
