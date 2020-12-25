import ApiHelper from './ApiHelper.js';
import urlConstants from '../util/urlConstants.js';

export const mainteanceOrderApi = {
  getAll,
  getById
};


async function getAll(){
    const res = await ApiHelper.get(urlConstants.CRACK_URL);
    return res.data;
}

async function getById(id){
    const res = await ApiHelper.get(urlConstants.CRACK_URL + "/" + id);
    return res.data;
}
