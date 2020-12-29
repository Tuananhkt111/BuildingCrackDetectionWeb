import ApiHelper from './ApiHelper.js';
import urlConstants from '../util/urlConstants.js';

export const maintenanceWorkerApi = {
  create,
  getAll,
  disable,
  update,
};

async function create(name, address, phone, email) {
  const data = {
    "name": name,
    "address": address,
    "phone": phone,
    "email": email
  };
  const res = await ApiHelper.post(urlConstants.MAINTEANANCE_WORKER_URL + "/", data);
  return res;
}

async function getAll(){
    const res = await ApiHelper.get(urlConstants.MAINTEANANCE_WORKER_URL);
    return res.data;
}

async function disable(id){
    const res = await ApiHelper.delete(urlConstants.MAINTEANANCE_WORKER_URL + "/" + id);
  return res;
}

async function update(id, name, address, phone, email){
    const data = {
        "name": name,
        "address": address,
        "phone" : phone,
        "email" : email
      };
    const res = await ApiHelper.post(urlConstants.MAINTEANANCE_WORKER_URL + "/" + id + "/", data);
  return res;
}

export default {
  create,
  getAll,
  disable,
  update,
};
