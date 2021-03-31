import ApiHelper from './ApiHelper.js';
import urlConstants from '../util/urlConstants.js';

export const mainteanceOrderApi = {
  getAll,
  getById,
  countOrderByStatus
};


async function getAll(){
    const res = await ApiHelper.get(urlConstants.MAINTEANANCE_ORDER_URL);
    return res.data;
}

async function getById(id){
    const res = await ApiHelper.get(urlConstants.MAINTEANANCE_ORDER_URL + "/" + id);
    return res.data;
}

async function countOrderByStatus(locationId, period, year) {
  const res = await ApiHelper.get(
    urlConstants.MAINTEANANCE_ORDER_URL +
      "/count/status?period=" +
      period +
      "&year=" +
      year +
      "&locationIdsStr=" +
      locationId
  );
  if (res.status == 200) {
    return res.data;
  } else return 0;
}

export default {
  getAll,
  getById,
  countOrderByStatus
}
