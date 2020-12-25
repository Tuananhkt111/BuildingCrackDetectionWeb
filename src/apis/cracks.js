import ApiHelper from './ApiHelper.js';
import urlConstants from '../util/urlConstants.js';

export const crackApi = {
  getAll,
};


async function getAll(){
    const res = await ApiHelper.get(urlConstants.CRACK_URL);
    return res.data;
}

