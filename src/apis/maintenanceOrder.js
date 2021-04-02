import ApiHelper from './ApiHelper.js';
import urlConstants from '../util/urlConstants.js';

export const mainteanceOrderApi = {
  getAll,
  getById,
  countOrderByStatus,
  getExpensesOrder,
  getExpensesOrderTotal,
  getAverageAssessment,
  getOrdersCount
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

async function getExpensesOrder(locationId, year) {
  const res = await ApiHelper.get(
    urlConstants.MAINTEANANCE_ORDER_URL +
      "/count/expense?year=" +
      year +
      "&locationId=" +
      locationId
  );
  if (res.status == 200) {
    return res.data;
  } else return 0;
}

async function getExpensesOrderTotal(locationId, year) {
  const res = await ApiHelper.get(
    urlConstants.MAINTEANANCE_ORDER_URL +
      "/count/expense-total?year=" +
      year +
      "&locationId=" +
      locationId
  );
  if (res.status == 200) {
    return res.data;
  } else return 0;
}

async function getAverageAssessment(locationId, year) {
  const res = await ApiHelper.get(
    urlConstants.MAINTEANANCE_ORDER_URL +
      "/count/assessment-average?year=" +
      year +
      "&locationId=" +
      locationId
  );
  if (res.status == 200) {
    return res.data;
  } else return 0;
}

async function getOrdersCount(locationId, year) {
  const res = await ApiHelper.get(
    urlConstants.MAINTEANANCE_ORDER_URL +
      "/count?year=" +
      year +
      "&locationId=" +
      locationId
  );
  if (res.status == 200) {
    return res.data;
  } else return 0;
}

export default {
  getAll,
  getById,
  countOrderByStatus,
  getExpensesOrder,
  getExpensesOrderTotal,
  getAverageAssessment,
  getOrdersCount
}
